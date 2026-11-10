#!/usr/bin/env python3
"""Export toques from an FL Studio .flp to MIDI + manifest for the site.

Convention in the FL project:
  - one FPC channel per instrument, the channel name is the instrument (e.g. "tarol")
  - one pattern with the whole toque, named "<toque>" (e.g. "vale old")
  - patterns named "<toque> <anything>" (e.g. "vale old - Tarol") are ignored

Usage: python3 tools/flp2site.py <project.flp> [--fl-data <FL Studio install dir>]
Writes public/toques/<slug>.mid, public/toques/manifest.json and public/samples/<instrument>/*.wav.
"""
import argparse, json, re, shutil, struct, subprocess, sys, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "public"
DEFAULT_FL = Path.home() / ".var/app/com.usebottles.bottles/data/bottles/bottles/Fl__129/drive_c/Program Files/Image-Line/FL Studio 2025"
# shortcut: FPC pad -> MIDI key assumes the stock FPC GM layout, in pad order; read the
# real per-pad key from the FPC blob if pads ever get re-assigned in FL.
FPC_GM_KEYS = [37, 36, 42, 54, 38, 40, 46, 44, 48, 47, 45, 43, 49, 57, 51, 53]
# Channel-name abbreviations used in the FL project -> instrument name on the site.
ALIASES = {"p2": "Surdo"}
# FPC pad name -> where to hit, shown on the site when an instrument uses several pads.
PAD_LABELS = {"Snare 1": "Pele", "Snare 2": "Pele", "SideStick": "Aro"}
# Per-instrument timbre (ffmpeg -af chain) applied to the site samples only; FL keeps its sound.
# Repique: the FPC "Hi Tom" sits at ~162 Hz like a tom; a real repique is small and very tight
# (~300-450 Hz, sharp attack, dry). Up 10 semitones (asetrate = 44100 * 2^(10/12); aresample normalizes the rate first), cut lows,
# lift the skin crack around 3.5 kHz, short tail.
TIMBRE = {
    "Repique": "aresample=44100,asetrate=78577,aresample=44100,highpass=f=180,"
               "equalizer=f=3500:t=q:w=1.2:g=6,afade=t=out:st=0.12:d=0.18,atrim=0:0.32",
}


def read_events(path):
    d = Path(path).read_bytes()
    if d[:4] != b"FLhd":
        sys.exit(f"{path}: not an FL Studio project")
    ppq = struct.unpack("<H", d[12:14])[0]
    i = 8 + struct.unpack("<I", d[4:8])[0]
    if d[i:i + 4] != b"FLdt":
        sys.exit(f"{path}: missing FLdt chunk")
    i += 8
    out = []
    while i < len(d):
        eid = d[i]; i += 1
        if eid < 64: v = d[i]; i += 1
        elif eid < 128: v = struct.unpack("<H", d[i:i + 2])[0]; i += 2
        elif eid == 172: v = d[i:i + 3]; i += 3  # FL 25 writes a 3-byte payload here
        elif eid < 192: v = struct.unpack("<I", d[i:i + 4])[0]; i += 4
        else:
            n = s = 0
            while True:
                b = d[i]; i += 1; n |= (b & 0x7F) << s; s += 7
                if not b & 0x80: break
            v = d[i:i + n]; i += n
        out.append((eid, v))
    if i != len(d):
        sys.exit("event stream misaligned; FL format changed?")
    return ppq, out


def utf16(b):
    return b.decode("utf-16-le").rstrip("\0")


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def parse(path):
    ppq, ev = read_events(path)
    tempo, num, den, names, notes, cur, chans, fpc, ch = None, 4, 4, {}, {}, None, {}, {}, None
    for e, v in ev:
        if e == 64: ch = v
        elif e == 203 and ch is not None and ch not in chans: chans[ch] = utf16(v).strip()
        elif e == 213 and ch is not None and ch not in fpc and b"F\x00P\x00C\x00_" in v: fpc[ch] = v
        if e == 156: tempo = v / 1000
        elif e == 17: num = v
        elif e == 18: den = v
        elif e == 65: cur = v
        elif e == 193: names[cur] = utf16(v).strip()
        elif e == 224:
            # pos, flags, chan, len, key, group, pitch, _, rel, midich, pan, vel, modx, mody
            ns = {}  # identical stacked notes (same tick, key, channel) are accidental: keep one
            for k in range(0, len(v), 24):
                n = struct.unpack("<IHHIHHBBBBBBBB", v[k:k + 24])
                ns.setdefault((n[0], n[4], n[2]), n)
            notes[cur] = list(ns.values())
    if tempo is None:
        sys.exit("tempo not found")
    return ppq, tempo, num, den, names, notes, chans, fpc


def fpc_pads(blob):
    """{key: (pad name, [sample paths by velocity layer])} from the FPC state blob."""
    pads = []
    for m in re.finditer(rb"(?:[ -~]\x00){4,}", blob):
        s = m.group().decode("utf-16-le")
        if s.startswith("%"): pads[-1][1].append(s)
        elif len(pads) < len(FPC_GM_KEYS): pads.append((s.rstrip("f"), []))
    return {FPC_GM_KEYS[i]: p for i, p in enumerate(pads)}


def copy_sample(src, dst, af=None):
    """Copy a sample as browser-playable PCM WAV, optionally through an ffmpeg filter chain `af`.
    FL factory WAVs use codec 0x6750 (an Ogg Vorbis stream inside the data chunk), which browsers cannot decode."""
    d = src.read_bytes()
    chunks, i = {}, 12
    while i + 8 <= len(d):
        n = struct.unpack("<I", d[i + 4:i + 8])[0]
        chunks.setdefault(d[i:i + 4], d[i + 8:i + 8 + n]); i += 8 + n + (n & 1)
    vorbis = struct.unpack("<H", chunks[b"fmt "][:2])[0] == 0x6750
    if not vorbis and not af:
        shutil.copy2(src, dst); return
    inp = dst.with_suffix(".ogg") if vorbis else src
    if vorbis:
        inp.write_bytes(chunks[b"data"])
    try:
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(inp), *(["-af", af] if af else []),
                        "-c:a", "pcm_s16le", str(dst)], check=True)
    finally:
        if vorbis:
            inp.unlink()


def write_midi(path, ppq, tempo, num, den, title, tracks):
    def vlq(n):
        b = [n & 0x7F]
        while n > 127: n >>= 7; b.insert(0, (n & 0x7F) | 0x80)
        return bytes(b)

    def chunk(events):  # events: [(tick, bytes)]
        data, last = b"", 0
        for t, msg in sorted(events, key=lambda x: (x[0], x[1][0] & 0xF0 == 0x90)):
            data += vlq(t - last) + msg; last = t
        data += b"\x00\xff\x2f\x00"
        return b"MTrk" + struct.pack(">I", len(data)) + data

    def name(s):
        s = s.encode(); return b"\xff\x03" + vlq(len(s)) + s

    us = round(60_000_000 / tempo)
    head = [(0, name(title)), (0, b"\xff\x51\x03" + us.to_bytes(3, "big")),
            (0, bytes([0xFF, 0x58, 4, num, den.bit_length() - 1, 24, 8]))]
    body = [chunk(head)]
    for inst, ns in tracks.items():
        evs = [(0, name(inst))]
        for pos, key, length, vel in ns:
            v = max(1, min(127, vel))
            evs += [(pos, bytes([0x99, key, v])), (pos + max(1, length), bytes([0x89, key, 0]))]
        body.append(chunk(evs))
    Path(path).write_bytes(b"MThd" + struct.pack(">IHHH", 6, 1, len(body), ppq) + b"".join(body))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("flp")
    ap.add_argument("--fl-data", type=Path, default=DEFAULT_FL)
    a = ap.parse_args()

    ppq, tempo, num, den, names, notes, chans, fpc = parse(a.flp)
    bar = ppq * 4 * num // den
    (ROOT / "toques").mkdir(parents=True, exist_ok=True)
    manifest = {"toques": [], "instrumentos": {}}
    inst_name = {c: ALIASES.get(n.lower(), n[:1].upper() + n[1:]) for c, n in chans.items()}
    used = {}  # instrument -> (channel, keys)

    for pid, title in names.items():
        if pid not in notes or any(p != pid and title.lower().startswith(n.lower() + " ") for p, n in names.items()):
            continue
        tracks = {}
        for n in sorted(notes[pid]):
            if n[2] not in fpc:
                sys.exit(f"{title}: notes on channel '{chans.get(n[2])}', which is not an FPC")
            inst = inst_name[n[2]]
            tracks.setdefault(inst, []).append((n[0], n[4], n[3], n[11]))
            used.setdefault(inst, (n[2], set()))[1].add(n[4])
        bars = -(-max(n[0] + n[3] for n in notes[pid]) // bar)
        fname = slug(title) + ".mid"
        write_midi(ROOT / "toques" / fname, ppq, tempo, num, den, title, tracks)
        manifest["toques"].append({"id": slug(title), "nome": title.title(), "arquivo": f"toques/{fname}",
                                   "bpm": tempo, "compasso": f"{num}/{den}", "compassos": bars})
        print(f"{title}: {len(notes[pid])} notas, {bars} compassos -> toques/{fname}")

    shutil.rmtree(ROOT / "samples", ignore_errors=True)  # generated output; rebuilt below
    for inst, (ch, keys) in used.items():
        pads = fpc_pads(fpc[ch])
        for key in sorted(keys):
            pad, layers = pads.get(key, (f"key {key}", []))
            files = []
            for src in layers:
                f = a.fl_data / src.replace("%FLStudioFactoryData%\\", "").replace("\\", "/")
                dst = ROOT / "samples" / slug(inst) / f.name
                if f.exists():
                    dst.parent.mkdir(parents=True, exist_ok=True); copy_sample(f, dst, TIMBRE.get(inst))
                    files.append(str(dst.relative_to(ROOT)))
                else:
                    print(f"AVISO: sample não encontrado: {f}", file=sys.stderr)
            manifest["instrumentos"].setdefault(inst, {})[str(key)] = {"pad": pad, "rotulo": PAD_LABELS.get(pad, pad), "samples": files}

    (ROOT / "toques" / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

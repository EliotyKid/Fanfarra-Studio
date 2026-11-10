// Student toques: stored in this browser's localStorage, exported/imported as JSON files.
// Doc: { id, nome, bpm, compasso: '4/4', compassos, subdiv, hits: { rowId: [[step, velocity], ...] }, atualizado }
// subdiv = grid steps per beat; docs saved before it existed are 16ths (4).
// Older docs stored bare step numbers; they load as Normal-strength hits.
import { kitRows } from './kit.js'

const KEY = 'fanfarra-studio:meus-toques:v1'
export const COMPASSOS = ['2/4', '3/4', '4/4']
export const MAX_COMPASSOS = 16
export const FORCAS = [
  { value: 60, label: 'Fraca' },
  { value: 100, label: 'Normal' },
  { value: 127, label: 'Forte' },
]
export const NORMAL = 100

export const SUBDIVISOES = [
  { value: 2, label: 'Colcheias' },
  { value: 3, label: 'Tercinas' },
  { value: 4, label: 'Semicolcheias' },
  { value: 6, label: 'Sextinas' },
  { value: 8, label: 'Fusas' },
]
export const subdivOf = (doc) => (SUBDIVISOES.some((s) => s.value === doc.subdiv) ? doc.subdiv : 4)
export const stepsPerBar = (doc) => parseInt(doc.compasso, 10) * subdivOf(doc)

// crypto.randomUUID only exists on HTTPS/localhost; phones opening the dev server over the LAN (http) lack it.
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

const clampVel = (v) => Math.min(127, Math.max(1, Math.round(v)))

// Accepts both formats, drops anything malformed or past `total`, one hit per step, sorted.
function normHits(steps, total = Infinity) {
  const byStep = new Map()
  for (const h of Array.isArray(steps) ? steps : []) {
    const [i, v] = Array.isArray(h) ? h : [h, NORMAL]
    if (Number.isInteger(i) && i >= 0 && i < total && Number.isFinite(v)) byStep.set(i, clampVel(v))
  }
  return [...byStep].sort((a, b) => a[0] - b[0])
}

export function loadAll() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]')
    if (!Array.isArray(list)) return []
    return list.map((d) => ({ ...d, hits: Object.fromEntries(Object.entries(d.hits || {}).map(([id, s]) => [id, normHits(s)])) }))
  } catch {
    return []
  }
}

// false when the browser refuses (private mode, storage full). Toques opened from a link and not saved
// yet (temp) stay out of storage.
export function saveAll(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.filter((d) => !d.temp)))
    return true
  } catch {
    return false
  }
}

export const novo = (n) => ({
  id: uid(), nome: `Meu toque ${n}`, bpm: 120, compasso: '4/4', compassos: 4, subdiv: 4, hits: {},
  atualizado: new Date().toISOString(),
})

export function toTracks(doc, rows) {
  const total = doc.compassos * stepsPerBar(doc)
  return rows.map((r) => {
    const steps = Array(total).fill(null)
    for (const [i, v] of doc.hits[r.id] || []) if (i < total) steps[i] = [[r.key, v]]
    return { ...r, steps }
  })
}

export const hitFor = (row, vel) => [[row.key, vel]]

export const velAt = (doc, rowId, step) => (doc.hits[rowId] || []).find(([i]) => i === step)?.[1]

// Click with the chosen strength: empty -> add; other strength -> change it; same strength -> remove.
// Reads the stored doc (not what the grid last rendered), so fast repeated clicks stay consistent.
export function applyHit(doc, rowId, step, vel) {
  const cur = new Map(doc.hits[rowId] || [])
  cur.get(step) === vel ? cur.delete(step) : cur.set(step, vel)
  return { ...doc, hits: { ...doc.hits, [rowId]: [...cur].sort((a, b) => a[0] - b[0]) } }
}

// Changing the time signature keeps each hit in its bar when the bar still has that step.
export function setCompasso(doc, compasso) {
  const from = stepsPerBar(doc), to = stepsPerBar({ ...doc, compasso })
  const hits = {}
  for (const [id, steps] of Object.entries(doc.hits)) {
    hits[id] = steps.filter(([i]) => i % from < to).map(([i, v]) => [Math.floor(i / from) * to + (i % from), v])
  }
  return { ...doc, compasso, hits }
}

// Fewer bars drops hits past the end, so lowering then raising the count does not bring them back.
export function setCompassos(doc, compassos) {
  const total = compassos * stepsPerBar(doc)
  const hits = {}
  for (const [id, steps] of Object.entries(doc.hits)) hits[id] = steps.filter(([i]) => i < total)
  return { ...doc, compassos, hits }
}

// New grid: each hit keeps its time when the new grid has that point, otherwise it snaps to the nearest one.
// `movidas` counts hits that moved, merged with another (strongest kept) or fell past the end.
export function setSubdiv(doc, subdiv) {
  const from = subdivOf(doc), total = doc.compassos * parseInt(doc.compasso, 10) * subdiv
  let movidas = 0
  const hits = {}
  for (const [id, steps] of Object.entries(doc.hits)) {
    const byStep = new Map()
    for (const [i, v] of steps) {
      const j = Math.round((i * subdiv) / from)
      if (j * from !== i * subdiv || j >= total || byStep.has(j)) movidas++
      if (j < total) byStep.set(j, Math.max(v, byStep.get(j) ?? 0))
    }
    hits[id] = [...byStep].sort((a, b) => a[0] - b[0])
  }
  return { doc: { ...doc, subdiv, hits }, movidas }
}

// Imported files are untrusted: keep only known fields, in range.
export function parseImport(text, rows) {
  const d = JSON.parse(text)
  if (!d || typeof d !== 'object') throw new Error('arquivo inválido')
  const compasso = COMPASSOS.includes(d.compasso) ? d.compasso : '4/4'
  const compassos = Number.isInteger(d.compassos) ? Math.min(MAX_COMPASSOS, Math.max(1, d.compassos)) : 4
  const subdiv = subdivOf(d)
  const total = compassos * stepsPerBar({ compasso, subdiv })
  const ids = new Set(rows.map((r) => r.id))
  const hits = {}
  for (const [id, steps] of Object.entries(d.hits && typeof d.hits === 'object' ? d.hits : {})) {
    if (ids.has(id)) hits[id] = normHits(steps, total)
  }
  return {
    id: uid(),
    nome: (typeof d.nome === 'string' && d.nome.trim().slice(0, 60)) || 'Toque importado',
    bpm: Number.isFinite(d.bpm) ? Math.min(240, Math.max(40, Math.round(d.bpm))) : 120,
    compasso, compassos, subdiv, hits,
    atualizado: new Date().toISOString(),
  }
}

// ---------- Selection editing ----------
// A selection is a Set of "rowId:step" keys pointing at existing hits. Ops return { doc, sel }
// with sel = the hits they placed, so the result stays selected (move, paste, duplicate...).
export const selKey = (rowId, step) => `${rowId}:${step}`
const parseKey = (k) => { const c = k.lastIndexOf(':'); return [k.slice(0, c), Number(k.slice(c + 1))] }
const totalOf = (doc) => doc.compassos * stepsPerBar(doc)

// Hits of the given rows between steps s0..s1 (any order, inclusive).
export function selectRect(doc, rowIds, s0, s1) {
  const lo = Math.min(s0, s1), hi = Math.max(s0, s1), sel = new Set()
  for (const id of rowIds) for (const [i] of doc.hits[id] || []) if (i >= lo && i <= hi) sel.add(selKey(id, i))
  return sel
}
export const selectSteps = (doc, s0, s1) => selectRect(doc, Object.keys(doc.hits), s0, s1)
export const selectAll = (doc) => selectSteps(doc, 0, Infinity)

function entries(doc, sel) {
  const out = []
  for (const k of sel) {
    const [id, i] = parseKey(k), v = velAt(doc, id, i)
    if (v !== undefined) out.push({ id, i, v })
  }
  return out
}

// Removes `remove`, then writes `add` (overwriting what is there); hits past the end are dropped.
function withHits(doc, remove, add) {
  const maps = {}
  const m = (id) => (maps[id] ??= new Map(doc.hits[id] || []))
  for (const { id, i } of remove) m(id).delete(i)
  const total = totalOf(doc), sel = new Set()
  for (const { id, i, v } of add) if (i >= 0 && i < total) { m(id).set(i, v); sel.add(selKey(id, i)) }
  const hits = { ...doc.hits }
  for (const [id, map] of Object.entries(maps)) hits[id] = [...map].sort((a, b) => a[0] - b[0])
  return { doc: { ...doc, hits }, sel }
}

export const deleteSel = (doc, sel) => withHits(doc, entries(doc, sel), [])
export const setVelSel = (doc, sel, vel) => withHits(doc, [], entries(doc, sel).map((h) => ({ ...h, v: vel })))
export function moveSel(doc, sel, delta) {
  const e = entries(doc, sel)
  return withHits(doc, e, e.map((h) => ({ ...h, i: h.i + delta })))
}

// Clipboard: positions relative to the first selected step, plus the grid they came from.
export function copySel(doc, sel) {
  const e = entries(doc, sel)
  if (!e.length) return null
  const min = Math.min(...e.map((h) => h.i))
  return { subdiv: subdivOf(doc), notes: e.map((h) => ({ id: h.id, off: h.i - min, v: h.v })) }
}
// Pastes starting at step `at`; a clip from another grid is rescaled to this one.
export function pasteAt(doc, clip, at) {
  const k = subdivOf(doc) / clip.subdiv
  return withHits(doc, [], clip.notes.map((n) => ({ id: n.id, i: at + Math.round(n.off * k), v: n.v })))
}

// The whole bars that contain the selection.
function barSpan(doc, e) {
  const spb = stepsPerBar(doc)
  const b0 = Math.floor(Math.min(...e.map((h) => h.i)) / spb), b1 = Math.floor(Math.max(...e.map((h) => h.i)) / spb)
  return { len: (b1 - b0 + 1) * spb, bars: b1 - b0 + 1, lastBar: b1 }
}
// Copies the selected bars right after themselves, adding bars to the toque if needed (up to the max).
export function duplicateSel(doc, sel) {
  const e = entries(doc, sel)
  if (!e.length) return { doc, sel }
  const { len, bars, lastBar } = barSpan(doc, e)
  const compassos = Math.min(MAX_COMPASSOS, Math.max(doc.compassos, lastBar + 1 + bars))
  return withHits({ ...doc, compassos }, [], e.map((h) => ({ ...h, i: h.i + len })))
}
// Fills the rest of the toque with copies of the selected bars; the original stays selected.
export function repeatSel(doc, sel) {
  const e = entries(doc, sel)
  if (!e.length) return { doc, sel }
  const { len } = barSpan(doc, e), total = totalOf(doc), start = Math.min(...e.map((h) => h.i)), add = []
  for (let k = len; start + k < total; k += len) add.push(...e.map((h) => ({ ...h, i: h.i + k })))
  return { doc: withHits(doc, [], add).doc, sel }
}

// An official toque (player tracks) as an editable student toque. Rows are matched by instrument + pad key,
// so they land on the editor's kit rows whatever the player grouped. Grids the editor lacks (12, 16, 24 per
// beat) are snapped to 32nds.
export function fromOfficial(toque, instrumentos) {
  const rows = kitRows(instrumentos)
  const grade = toque.stepsPerBeat
  const subdiv = SUBDIVISOES.some((s) => s.value === grade) ? grade : 8
  const compassos = Math.min(MAX_COMPASSOS, toque.compassos)
  const total = compassos * parseInt(toque.compasso, 10) * subdiv
  const hits = {}
  for (const tr of toque.tracks) {
    tr.steps.forEach((step, i) => {
      for (const [key, vel] of step || []) {
        const row = rows.find((r) => r.inst === tr.inst && r.key === key)
        const j = Math.round((i * subdiv) / grade)
        if (row && j < total) (hits[row.id] ??= new Map()).set(j, vel)
      }
    })
  }
  return {
    id: uid(), nome: `${toque.nome} (minha versão)`.slice(0, 60), bpm: toque.bpm,
    compasso: COMPASSOS.includes(toque.compasso) ? toque.compasso : '4/4', compassos, subdiv,
    hits: Object.fromEntries(Object.entries(hits).map(([id, m]) => [id, [...m].sort((a, b) => a[0] - b[0])])),
    atualizado: new Date().toISOString(),
  }
}

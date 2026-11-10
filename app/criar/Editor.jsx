'use client'
// Criar: students build their own toques on the official kit; saved in this browser.
// Editing: undo/redo per toque, selection mode (tap, drag a rectangle, or pick bars on the ruler),
// copy/cut/paste at the playhead, move, strength, duplicate and repeat-to-end.
import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Button } from '@ds/components/actions/Button.jsx'
import { IconButton } from '@ds/components/actions/IconButton.jsx'
import { ToggleButton } from '@ds/components/actions/ToggleButton.jsx'
import { Select } from '@ds/components/forms/Select.jsx'
import { VolumeSlider } from '@ds/components/forms/VolumeSlider.jsx'
import { Icon } from '@ds/components/icons/Icon.jsx'
import { StatusMessage } from '@ds/components/feedback/StatusMessage.jsx'
import { TransportControls } from '@ds/components/player/TransportControls.jsx'
import { kitRows, slug } from '@/lib/kit'
import { bpmOptions, useEngine, useSpaceToPlay } from '@/lib/useEngine'
import { useFullscreen, useLandscapePhone, useMobile } from '@/lib/media'
import { canRedo, canUndo, reducer } from '@/lib/historico'
import * as M from '@/lib/meusToques'
import { FullscreenButton, LoadError, Sequencer } from '../ui'

const plural = (n) => `${n} ${n === 1 ? 'compasso' : 'compassos'}`
const EMPTY = new Set()
let clipboard = null // shared by every toque on this page, so notes can be copied between toques

export default function Editor({ instrumentos }) {
  const rows = useMemo(() => kitRows(instrumentos), [instrumentos])
  const [state, dispatch] = useReducer(reducer, null) // { list, hist }; null until read from localStorage
  const [curId, setCurId] = useState(null)
  const [saved, setSaved] = useState(true)
  const [erro, setErro] = useState('')
  const [loop, setLoop] = useState(true)
  const [forca, setForca] = useState(M.NORMAL) // strength used by the next click on the grid
  const [selecting, setSelecting] = useState(false)
  const [sel, setSel] = useState(EMPTY)
  const [ajustes, setAjustes] = useState(false) // settings panel, phone lying down
  const [hasClip, setHasClip] = useState(!!clipboard)
  const fileRef = useRef(null)
  const mobile = useMobile()
  const landscape = useLandscapePhone()
  const fs = useFullscreen()

  useEffect(() => {
    const stored = M.loadAll()
    const list = stored.length ? stored : [M.novo(1)]
    dispatch({ type: 'load', list })
    setCurId(list[0].id)
  }, [])
  const list = state?.list
  useEffect(() => { if (list) setSaved(M.saveAll(list)) }, [list])

  const doc = list?.find((d) => d.id === curId)
  const spb = doc ? M.stepsPerBar(doc) : 16
  const perBeat = doc ? M.subdivOf(doc) : 4
  const total = doc ? doc.compassos * spb : 16
  const rawTracks = useMemo(() => (doc ? M.toTracks(doc, rows) : []), [doc, rows])
  const e = useEngine({ rawTracks, total, bpm: doc?.bpm ?? 120, perBeat, loop, instrumentos })
  useSpaceToPlay(e.togglePlay)

  // Keyboard shortcuts read the latest actions through a ref (the listener is registered once).
  const keys = useRef({})
  useEffect(() => {
    const onKey = (ev) => {
      if (ev.target.closest?.('input,textarea,[role=listbox],[role=slider],[contenteditable=true]')) return
      const k = keys.current, mod = ev.ctrlKey || ev.metaKey, key = ev.key.toLowerCase()
      const run = (fn) => { ev.preventDefault(); fn() }
      if (mod && key === 'z') run(ev.shiftKey ? k.redo : k.undo)
      else if (mod && key === 'y') run(k.redo)
      else if (mod && key === 'a') run(k.selectAll)
      else if (mod && key === 'c' && k.hasSel) run(k.copy)
      else if (mod && key === 'x' && k.hasSel) run(k.cut)
      else if (mod && key === 'v' && clipboard) run(k.paste)
      else if (mod && key === 'd' && k.hasSel) run(k.duplicate)
      else if ((key === 'delete' || key === 'backspace') && k.hasSel) run(k.del)
      else if ((key === 'arrowleft' || key === 'arrowright') && k.hasSel) run(() => k.move((key === 'arrowleft' ? -1 : 1) * (ev.shiftKey ? k.perBeat : 1)))
      else if (key === 'escape' && k.hasSel) run(k.clear)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!doc || mobile === null) return null

  // ---------- document edits (all undoable) ----------
  const edit = (fn, tag) => dispatch({ type: 'edit', id: curId, fn, tag, at: Date.now() })
  // Selection ops compute { doc, sel } from the current doc, then commit both.
  const apply = (op) => { const r = op(doc); edit(() => r.doc); setSel(r.sel) }
  const choose = (id) => { setCurId(id); setSel(EMPTY); e.resetPos() }
  const add = (d) => { dispatch({ type: 'add', doc: d }); choose(d.id) }
  const idx = list.findIndex((d) => d.id === curId)
  const step = (k) => choose(list[(idx + k + list.length) % list.length].id)
  const undo = () => { dispatch({ type: 'undo', id: curId }); setSel(EMPTY) }
  const redo = () => { dispatch({ type: 'redo', id: curId }); setSel(EMPTY) }

  const hasSel = sel.size > 0
  const copy = () => { clipboard = M.copySel(doc, sel); setHasClip(!!clipboard) }
  const actions = {
    hasSel, perBeat, undo, redo,
    selectAll: () => { setSelecting(true); setSel(M.selectAll(doc)) },
    clear: () => setSel(EMPTY),
    copy,
    cut: () => { copy(); apply((d) => M.deleteSel(d, sel)) },
    paste: () => clipboard && apply((d) => M.pasteAt(d, clipboard, Math.floor(e.pos))),
    del: () => apply((d) => M.deleteSel(d, sel)),
    move: (k) => apply((d) => M.moveSel(d, sel, k)),
    duplicate: () => apply((d) => M.duplicateSel(d, sel)),
    repeat: () => apply((d) => M.repeatSel(d, sel)),
  }
  keys.current = actions

  const toggleStep = (id, i) => {
    if (selecting) {
      if (M.velAt(doc, id, i) === undefined) return setSel(EMPTY) // empty cell: clear the selection
      const k = M.selKey(id, i), next = new Set(sel)
      next.has(k) ? next.delete(k) : next.add(k)
      setSel(next)
      if (!e.playing) e.audition(id, i)
      return
    }
    const removing = M.velAt(doc, id, i) === forca
    edit((d) => M.applyHit(d, id, i, forca))
    if (!removing && !e.playing) e.audition(id, i, M.hitFor(rows.find((r) => r.id === id), forca))
  }
  const pickForca = (v) => {
    setForca(v)
    if (selecting && hasSel) apply((d) => M.setVelSel(d, sel, v))
  }
  const toggleSelecting = (on) => { setSelecting(on); if (!on) setSel(EMPTY) }
  const selectProps = selecting ? {
    selected: sel,
    onRect: (ids, s0, s1) => setSel(M.selectRect(doc, ids, s0, s1)),
    onBars: (b0, b1) => setSel(M.selectSteps(doc, b0 * spb, (b1 + 1) * spb - 1)),
  } : undefined

  const changeSubdiv = (v) => {
    const { doc: next, movidas } = M.setSubdiv(doc, v)
    if (movidas && !window.confirm(`${movidas} ${movidas === 1 ? 'batida não cabe' : 'batidas não cabem'} certinho na nova subdivisão e ${movidas === 1 ? 'vai' : 'vão'} para o ponto mais próximo. Continuar?`)) return
    edit(() => next)
    setSel(EMPTY)
    e.resetPos()
  }
  const removeBar = () => {
    const first = (doc.compassos - 1) * spb
    const lost = Object.values(doc.hits).some((h) => h.some(([i]) => i >= first))
    if (lost && !window.confirm(`O compasso ${doc.compassos} tem batidas. Tirar e apagar essas batidas?`)) return
    edit((d) => M.setCompassos(d, d.compassos - 1))
  }
  const remove = () => {
    if (!window.confirm(`Excluir “${doc.nome}”? Isso não pode ser desfeito.`)) return
    e.setPlaying(false)
    const rest = list.filter((d) => d.id !== curId)
    const next = rest.length ? rest : [M.novo(1)]
    dispatch({ type: 'remove', id: curId, list: next })
    choose(next[0].id)
  }
  const exportar = () => {
    const { id, ...data } = doc
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `${slug(doc.nome) || 'toque'}.json` })
    a.click()
    URL.revokeObjectURL(url)
  }
  const importar = async (ev) => {
    const f = ev.target.files[0]
    ev.target.value = ''
    if (!f) return
    try {
      add(M.parseImport(await f.text(), rows))
      setErro('')
    } catch {
      setErro('Esse arquivo não é um toque do Fanfarra Studio.')
    }
  }

  const hits = Object.values(doc.hits).reduce((n, s) => n + s.length, 0)
  const meta = `${doc.compasso} · ${plural(doc.compassos)} · ${hits} ${hits === 1 ? 'batida' : 'batidas'}`
  const size = mobile && !landscape ? 'lg' : 'md'
  const btn = mobile && !landscape ? 'lg' : 'md'

  // ---------- pieces ----------
  const nameInput = (
    <input className="fs-title-input" aria-label="Nome do toque" value={doc.nome} maxLength={60}
      onChange={(ev) => edit((d) => ({ ...d, nome: ev.target.value }), 'nome')}
      style={{ font: mobile ? '700 20px/1.2 var(--font-display)' : 'var(--type-title)' }} />
  )
  const toqueSelect = (
    <Select label="Meus toques" icon="list-music" value={curId} size={size} block={mobile}
      options={list.map((d) => ({ value: d.id, label: d.nome || 'Sem nome' }))} onChange={choose} />
  )
  const novoBtn = mobile
    ? <IconButton icon="plus" label="Novo toque" variant="surface" size={btn} onClick={() => add(M.novo(list.length + 1))} />
    : <Button variant="secondary" size={size} icon="plus" onClick={() => add(M.novo(list.length + 1))}>Novo toque</Button>
  const bpmSelect = (
    <Select label="Andamento" icon="music-2" value={doc.bpm} options={bpmOptions(doc.bpm)} size={size}
      onChange={(v) => edit((d) => ({ ...d, bpm: v }))} />
  )
  const settings = (
    <>
      <Select label="Compasso" icon="drum" value={doc.compasso} options={M.COMPASSOS} size={size}
        onChange={(v) => { edit((d) => M.setCompasso(d, v)); setSel(EMPTY); e.resetPos() }} />
      <Select label="Subdivisão" icon="audio-lines" value={perBeat} options={M.SUBDIVISOES} size={size} onChange={changeSubdiv} />
      <div role="group" aria-label="Número de compassos" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <IconButton icon="minus" label="Tirar o último compasso" variant="surface" size={btn} disabled={doc.compassos <= 1} onClick={removeBar} />
        <span aria-live="polite" style={{ font: 'var(--type-value)', minWidth: 112, textAlign: 'center' }}>{plural(doc.compassos)}</span>
        <IconButton icon="plus" label="Adicionar compasso" variant="surface" size={btn}
          disabled={doc.compassos >= M.MAX_COMPASSOS} onClick={() => edit((d) => M.setCompassos(d, d.compassos + 1))} />
      </div>
    </>
  )
  const fileActions = (
    <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
      <Button variant="ghost" size="sm" onClick={exportar}>Exportar</Button>
      <Button variant="ghost" size="sm" onClick={() => fileRef.current.click()}>Importar</Button>
      <IconButton icon="trash-2" label="Excluir toque" size="sm" onClick={remove} />
      <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importar} />
    </div>
  )
  const transport = (
    <TransportControls size={mobile ? 'sm' : 'lg'} spread={mobile && !landscape} playing={e.playing} onPlayToggle={e.setPlaying}
      onPrev={() => step(-1)} onNext={() => step(1)} prevDisabled={list.length < 2} nextDisabled={list.length < 2}
      loop={mobile ? loop : undefined} onLoopToggle={mobile ? setLoop : undefined} />
  )
  const sep = <span aria-hidden="true" style={{ width: 1, alignSelf: 'stretch', margin: '4px 4px', background: 'var(--border-default)' }} />
  const editBar = (
    <div role="toolbar" aria-label="Edição" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {landscape ? (
        // Lying down the bar must fit one line: strength as one select, selection as an icon.
        <>
          <Select label={selecting && hasSel ? 'Força das batidas selecionadas' : 'Força da batida'} icon="audio-lines" value={forca}
            options={M.FORCAS} onChange={pickForca} />
          {sep}
          <IconButton icon="mouse-pointer-click" label="Selecionar" variant="surface" pressed={selecting} onClick={() => toggleSelecting(!selecting)} />
        </>
      ) : (
        <>
          <div role="group" aria-label={selecting && hasSel ? 'Força das batidas selecionadas' : 'Força da batida'} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ font: 'var(--type-caption)', color: 'var(--fg-2)', marginRight: 2 }}>Força</span>
            {M.FORCAS.map((f) => (
              <ToggleButton key={f.value} pressed={forca === f.value} onPressedChange={() => pickForca(f.value)}>{f.label}</ToggleButton>
            ))}
          </div>
          {sep}
          <ToggleButton icon="mouse-pointer-click" pressed={selecting} onPressedChange={toggleSelecting}>Selecionar</ToggleButton>
        </>
      )}
      <IconButton icon="undo-2" label="Desfazer (Ctrl+Z)" size="sm" disabled={!canUndo(state, curId)} onClick={undo} />
      <IconButton icon="redo-2" label="Refazer (Ctrl+Shift+Z)" size="sm" disabled={!canRedo(state, curId)} onClick={redo} />
      {selecting && (
        <>
          {sep}
          <IconButton icon="copy" label="Copiar (Ctrl+C)" size="sm" disabled={!hasSel} onClick={actions.copy} />
          <IconButton icon="scissors" label="Recortar (Ctrl+X)" size="sm" disabled={!hasSel} onClick={actions.cut} />
          <IconButton icon="clipboard-paste" label="Colar na posição da barra (Ctrl+V)" size="sm" disabled={!hasClip} onClick={actions.paste} />
          <IconButton icon="trash-2" label="Apagar seleção (Delete)" size="sm" disabled={!hasSel} onClick={actions.del} />
          <IconButton icon="chevron-left" label="Mover para trás (←)" size="sm" disabled={!hasSel} onClick={() => actions.move(-1)} />
          <IconButton icon="chevron-right" label="Mover para frente (→)" size="sm" disabled={!hasSel} onClick={() => actions.move(1)} />
          <IconButton icon="copy-plus" label="Duplicar compassos selecionados (Ctrl+D)" size="sm" disabled={!hasSel} onClick={actions.duplicate} />
          <IconButton icon="repeat" label="Repetir até o fim" size="sm" disabled={!hasSel} onClick={actions.repeat} />
          {!landscape && (
            <span style={{ font: 'var(--type-caption)', color: 'var(--fg-2)', marginLeft: 4 }}>
              {hasSel ? `${sel.size} ${sel.size === 1 ? 'batida selecionada' : 'batidas selecionadas'}` : 'Toque nas batidas, arraste no grid ou nos números dos compassos.'}
            </span>
          )}
        </>
      )}
    </div>
  )
  const banners = (
    <>
      <LoadError p={e} />
      {(erro || !saved) && (
        <div style={{ padding: '0 16px 16px' }}>
          <StatusMessage variant="banner" tone={erro ? 'danger' : 'warning'}
            title={erro ? 'Algo deu errado.' : 'Atenção necessária.'}
            message={erro || 'Este navegador não deixou salvar. Use Exportar para não perder o toque.'}
            onDismiss={erro ? () => setErro('') : undefined} />
        </div>
      )}
    </>
  )
  const grid = (cellWidth, dense) => (
    <Sequencer p={e} bars={doc.compassos} spb={spb} compact={mobile} dense={dense} onToggleStep={toggleStep} cellWidth={cellWidth} select={selectProps} />
  )

  // ---------- phone lying down: controls on top, grid fills the rest (like the Toques player) ----------
  if (landscape) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px 2px 16px' }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>{toqueSelect}</div>
          {bpmSelect}
          {transport}
          <IconButton icon="settings" label="Ajustes do toque" variant="surface" pressed={ajustes} onClick={() => setAjustes((a) => !a)} />
          <FullscreenButton fs={fs} />
        </div>
        <div style={{ padding: '0 16px 4px' }}>{editBar}</div>
        {ajustes && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: '6px 16px 10px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ flex: '1 1 220px', minWidth: 0 }}>{nameInput}</div>
            {novoBtn}
            {settings}
            {fileActions}
          </div>
        )}
        {banners}
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg-sunken)' }}>{grid(30, true)}</div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: mobile ? 'auto' : 0 }}>
      <header style={{ display: 'grid', gap: 20, padding: mobile ? '20px 16px 0' : '36px 24px 0 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0, flex: '1 1 260px' }}>
            {nameInput}
            <div style={{ font: mobile ? '400 13px/1.3 var(--font-mono)' : 'var(--type-meta)', color: 'var(--fg-2)', marginTop: 6 }}>{meta}</div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: mobile ? '1 1 100%' : undefined }}>
            <div style={{ flex: mobile ? 1 : undefined, minWidth: 0 }}>{toqueSelect}</div>
            {novoBtn}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {bpmSelect}
          {settings}
          {!mobile && <ToggleButton icon="rotate-cw" pressed={loop} onPressedChange={setLoop}>Loop</ToggleButton>}
          {fileActions}
        </div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', padding: mobile ? '20px 16px 20px 24px' : '20px 0' }}>{transport}</div>
      <div style={{ padding: mobile ? '0 16px 16px' : '0 24px 16px 40px' }}>{editBar}</div>
      {banners}
      <div style={{ flex: mobile ? 'none' : 1, minHeight: 0, overflow: mobile ? 'visible' : 'auto', marginRight: mobile ? 0 : 16, background: 'var(--bg-sunken)' }}>
        {grid(mobile ? 30 : undefined)}
      </div>
      <footer className={mobile ? 'safe-bottom' : undefined} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, minHeight: mobile ? 0 : 72, padding: mobile ? '12px 12px 24px 16px' : '0 24px 0 40px', borderTop: '1px solid var(--border-subtle)', background: mobile ? undefined : 'var(--surface-panel)' }}>
        {!mobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--fg-2)', font: 'var(--type-body)' }}>
            <Icon name={saved ? 'check' : 'triangle-alert'} size={20} />
            <span>{e.status === 'loading' ? 'Carregando sons…' : saved ? 'Salvo neste navegador' : 'Não salvo'}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: mobile ? 1 : undefined }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <VolumeSlider value={e.volume} onChange={e.setVolume} muted={e.muted} onMuteToggle={e.setMuted} width={mobile ? undefined : 160} />
          </div>
          <FullscreenButton fs={fs} />
        </div>
      </footer>
    </div>
  )
}

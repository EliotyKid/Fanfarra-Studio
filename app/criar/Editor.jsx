'use client'
// Criar: students build their own toques on the official kit; saved in this browser.
import { useEffect, useMemo, useRef, useState } from 'react'
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
import { useFullscreen, useMobile } from '@/lib/media'
import * as M from '@/lib/meusToques'
import { FullscreenButton, LoadError, Sequencer } from '../ui'

const compassosOptions = Array.from({ length: M.MAX_COMPASSOS }, (_, i) => ({ value: i + 1, label: `${i + 1} ${i ? 'compassos' : 'compasso'}` }))

export default function Editor({ instrumentos }) {
  const rows = useMemo(() => kitRows(instrumentos), [instrumentos])
  const [list, setList] = useState(null) // null until read from localStorage (client only)
  const [curId, setCurId] = useState(null)
  const [saved, setSaved] = useState(true)
  const [erro, setErro] = useState('')
  const [loop, setLoop] = useState(true)
  const [forca, setForca] = useState(M.NORMAL) // strength used by the next click on the grid
  const fileRef = useRef(null)
  const mobile = useMobile()
  const fs = useFullscreen()

  useEffect(() => {
    const stored = M.loadAll()
    const l = stored.length ? stored : [M.novo(1)]
    setList(l)
    setCurId(l[0].id)
  }, [])
  useEffect(() => { if (list) setSaved(M.saveAll(list)) }, [list])

  const doc = list?.find((d) => d.id === curId)
  const spb = doc ? M.stepsPerBar(doc.compasso) : 16
  const total = doc ? doc.compassos * spb : 16
  const rawTracks = useMemo(() => (doc ? M.toTracks(doc, rows) : []), [doc, rows])
  const e = useEngine({ rawTracks, total, bpm: doc?.bpm ?? 120, loop, instrumentos })
  useSpaceToPlay(e.togglePlay)

  if (!doc || mobile === null) return null

  const update = (fn) => setList((l) => l.map((d) => (d.id === curId ? { ...fn(d), atualizado: new Date().toISOString() } : d)))
  const select = (id) => { setCurId(id); e.resetPos() }
  const add = (d) => { setList((l) => [...l, d]); select(d.id) }
  const idx = list.findIndex((d) => d.id === curId)
  const step = (k) => select(list[(idx + k + list.length) % list.length].id)

  const toggleStep = (id, i) => {
    const removing = M.velAt(doc, id, i) === forca
    update((d) => M.applyHit(d, id, i, forca))
    if (!removing && !e.playing) e.audition(id, i, M.hitFor(rows.find((r) => r.id === id), forca))
  }
  const remove = () => {
    if (!window.confirm(`Excluir “${doc.nome}”? Isso não pode ser desfeito.`)) return
    e.setPlaying(false)
    const rest = list.filter((d) => d.id !== curId)
    const next = rest.length ? rest : [M.novo(1)]
    setList(next)
    select(next[0].id)
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
  const meta = `${doc.compasso} · ${doc.compassos} ${doc.compassos > 1 ? 'compassos' : 'compasso'} · ${hits} ${hits === 1 ? 'batida' : 'batidas'}`
  const size = mobile ? 'lg' : 'md'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: mobile ? 'auto' : 0 }}>
      <header style={{ display: 'grid', gap: 20, padding: mobile ? '20px 16px 0' : '36px 24px 0 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0, flex: '1 1 260px' }}>
            <input className="fs-title-input" aria-label="Nome do toque" value={doc.nome} maxLength={60}
              onChange={(ev) => update((d) => ({ ...d, nome: ev.target.value }))}
              style={{ font: mobile ? '700 20px/1.2 var(--font-display)' : 'var(--type-title)' }} />
            <div style={{ font: mobile ? '400 13px/1.3 var(--font-mono)' : 'var(--type-meta)', color: 'var(--fg-2)', marginTop: 6 }}>{meta}</div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: mobile ? '1 1 100%' : undefined }}>
            <div style={{ flex: mobile ? 1 : undefined, minWidth: 0 }}>
              <Select label="Meus toques" icon="list-music" value={curId} size={size} block={mobile}
                options={list.map((d) => ({ value: d.id, label: d.nome || 'Sem nome' }))} onChange={select} />
            </div>
            {mobile
              ? <IconButton icon="plus" label="Novo toque" variant="surface" size="lg" onClick={() => add(M.novo(list.length + 1))} />
              : <Button variant="secondary" size={size} icon="plus" onClick={() => add(M.novo(list.length + 1))}>Novo toque</Button>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Select label="Andamento" icon="music-2" value={doc.bpm} options={bpmOptions(doc.bpm)} size={size}
            onChange={(v) => update((d) => ({ ...d, bpm: v }))} />
          <Select label="Compasso" icon="drum" value={doc.compasso} options={M.COMPASSOS} size={size}
            onChange={(v) => { update((d) => M.setCompasso(d, v)); e.resetPos() }} />
          <Select label="Tamanho" icon="timer" value={doc.compassos} options={compassosOptions} size={size}
            onChange={(v) => update((d) => M.setCompassos(d, v))} />
          {!mobile && <ToggleButton icon="rotate-cw" pressed={loop} onPressedChange={setLoop}>Loop</ToggleButton>}
          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
            <Button variant="ghost" size="sm" onClick={exportar}>Exportar</Button>
            <Button variant="ghost" size="sm" onClick={() => fileRef.current.click()}>Importar</Button>
            <IconButton icon="trash-2" label="Excluir toque" size="sm" onClick={remove} />
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importar} />
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', padding: mobile ? '20px 16px 20px 24px' : '20px 0' }}>
        <TransportControls size={mobile ? 'sm' : 'lg'} spread={mobile} playing={e.playing} onPlayToggle={e.setPlaying}
          onPrev={() => step(-1)} onNext={() => step(1)} prevDisabled={list.length < 2} nextDisabled={list.length < 2}
          loop={mobile ? loop : undefined} onLoopToggle={mobile ? setLoop : undefined} />
      </div>
      <div role="group" aria-label="Força da batida" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: mobile ? '0 16px 16px' : '0 24px 16px 40px' }}>
        <span style={{ font: 'var(--type-caption)', color: 'var(--fg-2)', marginRight: 4 }}>Força da batida</span>
        {M.FORCAS.map((f) => (
          <ToggleButton key={f.value} pressed={forca === f.value} onPressedChange={() => setForca(f.value)}>{f.label}</ToggleButton>
        ))}
      </div>
      <LoadError p={e} />
      {(erro || !saved) && (
        <div style={{ padding: '0 16px 16px' }}>
          <StatusMessage variant="banner" tone={erro ? 'danger' : 'warning'}
            title={erro ? 'Algo deu errado.' : 'Atenção necessária.'}
            message={erro || 'Este navegador não deixou salvar. Use Exportar para não perder o toque.'}
            onDismiss={erro ? () => setErro('') : undefined} />
        </div>
      )}
      <div style={{ flex: mobile ? 'none' : 1, minHeight: 0, overflow: mobile ? 'visible' : 'auto', marginRight: mobile ? 0 : 16, background: 'var(--bg-sunken)' }}>
        <Sequencer p={e} bars={doc.compassos} spb={spb} compact={mobile} onToggleStep={toggleStep} cellWidth={mobile ? 30 : undefined} />
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

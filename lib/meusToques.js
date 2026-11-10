// Student toques: stored in this browser's localStorage, exported/imported as JSON files.
// Doc: { id, nome, bpm, compasso: '4/4', compassos, hits: { rowId: [[step, velocity], ...] }, atualizado }
// Older docs stored bare step numbers; they load as Normal-strength hits.
const KEY = 'fanfarra-studio:meus-toques:v1'
export const COMPASSOS = ['2/4', '3/4', '4/4']
export const MAX_COMPASSOS = 16
export const FORCAS = [
  { value: 60, label: 'Fraca' },
  { value: 100, label: 'Normal' },
  { value: 127, label: 'Forte' },
]
export const NORMAL = 100

export const stepsPerBar = (compasso) => parseInt(compasso, 10) * 4

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

// false when the browser refuses (private mode, storage full).
export function saveAll(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

export const novo = (n) => ({
  id: uid(), nome: `Meu toque ${n}`, bpm: 120, compasso: '4/4', compassos: 4, hits: {},
  atualizado: new Date().toISOString(),
})

export function toTracks(doc, rows) {
  const total = doc.compassos * stepsPerBar(doc.compasso)
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
  const from = stepsPerBar(doc.compasso), to = stepsPerBar(compasso)
  const hits = {}
  for (const [id, steps] of Object.entries(doc.hits)) {
    hits[id] = steps.filter(([i]) => i % from < to).map(([i, v]) => [Math.floor(i / from) * to + (i % from), v])
  }
  return { ...doc, compasso, hits }
}

// Fewer bars drops hits past the end, so lowering then raising the count does not bring them back.
export function setCompassos(doc, compassos) {
  const total = compassos * stepsPerBar(doc.compasso)
  const hits = {}
  for (const [id, steps] of Object.entries(doc.hits)) hits[id] = steps.filter(([i]) => i < total)
  return { ...doc, compassos, hits }
}

// Imported files are untrusted: keep only known fields, in range.
export function parseImport(text, rows) {
  const d = JSON.parse(text)
  if (!d || typeof d !== 'object') throw new Error('arquivo inválido')
  const compasso = COMPASSOS.includes(d.compasso) ? d.compasso : '4/4'
  const compassos = Number.isInteger(d.compassos) ? Math.min(MAX_COMPASSOS, Math.max(1, d.compassos)) : 4
  const total = compassos * stepsPerBar(compasso)
  const ids = new Set(rows.map((r) => r.id))
  const hits = {}
  for (const [id, steps] of Object.entries(d.hits && typeof d.hits === 'object' ? d.hits : {})) {
    if (ids.has(id)) hits[id] = normHits(steps, total)
  }
  return {
    id: uid(),
    nome: (typeof d.nome === 'string' && d.nome.trim().slice(0, 60)) || 'Toque importado',
    bpm: Number.isFinite(d.bpm) ? Math.min(240, Math.max(40, Math.round(d.bpm))) : 120,
    compasso, compassos, hits,
    atualizado: new Date().toISOString(),
  }
}

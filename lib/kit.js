// Instrument rows shared by the player (official toques) and the editor (student toques).
// Row order from the design system: low -> high.
export const ORDER = ['bumbo', 'prato', 'tarol', 'surdo', 'repique']

export const slug = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')

// One row of the grid. key === null means "the whole instrument" (single-pad instruments).
export function rowMeta(instName, key, pads = {}) {
  const inst = slug(instName)
  const label = key === null ? '' : pads[key]?.rotulo || pads[key]?.pad || String(key)
  return {
    id: key === null ? inst : `${inst}-${key}`,
    inst: instName, // sample lookup key
    name: label ? `${instName} · ${label}` : instName,
    color: `var(--inst-${inst})`,
    order: ORDER.indexOf(inst) + 1 || 99,
  }
}

const byOrder = (a, b) => a.order - b.order // stable: pad rows keep their order

// Every row available to students: one per pad for multi-pad instruments (Tarol: pele, aro).
export function kitRows(instrumentos) {
  return Object.entries(instrumentos)
    .flatMap(([name, pads]) => {
      const keys = Object.keys(pads).map(Number).sort((a, b) => b - a)
      return (keys.length > 1 ? keys : [keys[0]]).map((key) => ({ ...rowMeta(name, keys.length > 1 ? key : null, pads), key }))
    })
    .sort(byOrder)
}

export const sortRows = (rows) => rows.sort(byOrder)

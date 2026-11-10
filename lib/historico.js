// Editor state: the student's toques plus undo/redo history per toque. Pure reducer (time comes in the action).
const LIMIT = 100
const COALESCE_MS = 1500 // edits with the same tag this close together undo as one step (typing a name)

const replace = (list, doc) => list.map((d) => (d.id === doc.id ? doc : d))
const empty = { past: [], future: [] }

export function reducer(state, a) {
  switch (a.type) {
    case 'load':
      return { list: a.list, hist: {} }
    case 'add':
      return { ...state, list: [...state.list, a.doc] }
    case 'remove': {
      const { [a.id]: _, ...hist } = state.hist
      return { list: a.list, hist }
    }
    case 'edit': {
      const cur = state.list.find((d) => d.id === a.id)
      if (!cur) return state
      const next = a.fn(cur)
      if (next === cur) return state
      const h = state.hist[a.id] || empty
      const coalesce = a.tag && h.tag === a.tag && a.at - h.at < COALESCE_MS
      const past = coalesce ? h.past : [...h.past, cur].slice(-LIMIT)
      return {
        list: replace(state.list, { ...next, atualizado: new Date(a.at).toISOString() }),
        hist: { ...state.hist, [a.id]: { past, future: [], tag: a.tag, at: a.at } },
      }
    }
    case 'undo':
    case 'redo': {
      const h = state.hist[a.id] || empty
      const from = a.type === 'undo' ? h.past : h.future
      if (!from.length) return state
      const cur = state.list.find((d) => d.id === a.id), to = from.at(-1)
      const moved = { past: h.past, future: h.future }
      if (a.type === 'undo') moved.past = h.past.slice(0, -1), moved.future = [...h.future, cur]
      else moved.future = h.future.slice(0, -1), moved.past = [...h.past, cur]
      return { list: replace(state.list, to), hist: { ...state.hist, [a.id]: moved } }
    }
    default:
      return state
  }
}

export const canUndo = (state, id) => !!state?.hist[id]?.past.length
export const canRedo = (state, id) => !!state?.hist[id]?.future.length

import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as M from '../lib/meusToques.js'
import { reducer, canUndo, canRedo } from '../lib/historico.js'

// 2 bars of 4/4 in 16ths = 32 steps
const base = () => ({ ...M.novo(1), compassos: 2, hits: { bumbo: [[0, 100], [4, 60]], 'tarol-40': [[2, 127], [20, 100]] } })

test('selectRect picks hits of the given rows in the step range', () => {
  const sel = M.selectRect(base(), ['bumbo', 'tarol-40'], 5, 0)
  assert.deepEqual([...sel].sort(), ['bumbo:0', 'bumbo:4', 'tarol-40:2'])
  assert.equal(M.selectAll(base()).size, 4)
})

test('move, delete, strength', () => {
  const d = base(), sel = new Set(['bumbo:0', 'tarol-40:2'])
  const mv = M.moveSel(d, sel, 1)
  assert.deepEqual(mv.doc.hits.bumbo, [[1, 100], [4, 60]])
  assert.deepEqual([...mv.sel].sort(), ['bumbo:1', 'tarol-40:3'])
  assert.deepEqual(M.moveSel(d, new Set(['tarol-40:20']), 20).doc.hits['tarol-40'], [[2, 127]]) // past the end: dropped
  assert.deepEqual(M.deleteSel(d, sel).doc.hits, { bumbo: [[4, 60]], 'tarol-40': [[20, 100]] })
  assert.deepEqual(M.setVelSel(d, sel, 60).doc.hits.bumbo, [[0, 60], [4, 60]])
})

test('copy/paste keeps relative timing and rescales across grids', () => {
  const clip = M.copySel(base(), new Set(['bumbo:4', 'tarol-40:2'])) // offsets: tarol 0, bumbo 2
  const p = M.pasteAt(base(), clip, 16)
  assert.deepEqual(p.doc.hits.bumbo, [[0, 100], [4, 60], [18, 60]])
  assert.deepEqual(p.doc.hits['tarol-40'], [[2, 127], [16, 127], [20, 100]])
  const fusas = { ...M.novo(1), subdiv: 8, hits: {} }
  assert.deepEqual(M.pasteAt(fusas, clip, 0).doc.hits.bumbo, [[4, 60]]) // offset 2 sixteenths = 4 thirty-seconds
})

test('duplicate copies whole bars after themselves and grows the toque', () => {
  const d = { ...base(), compassos: 1, hits: { bumbo: [[0, 100], [4, 60]] } }
  const r = M.duplicateSel(d, new Set(['bumbo:4']))
  assert.equal(r.doc.compassos, 2)
  assert.deepEqual(r.doc.hits.bumbo, [[0, 100], [4, 60], [20, 60]])
  assert.deepEqual([...r.sel], ['bumbo:20'])
})

test('repeat fills to the end', () => {
  const d = { ...base(), compassos: 3, hits: { bumbo: [[0, 100]] } }
  assert.deepEqual(M.repeatSel(d, new Set(['bumbo:0'])).doc.hits.bumbo, [[0, 100], [16, 100], [32, 100]])
})

test('history: undo/redo, coalescing, new edit clears redo', () => {
  const d = M.novo(1)
  let s = reducer(null, { type: 'load', list: [d] })
  const edit = (fn, at, tag) => (s = reducer(s, { type: 'edit', id: d.id, fn, at, tag }))
  edit((x) => M.applyHit(x, 'bumbo', 0, 100), 1000)
  edit((x) => ({ ...x, nome: 'A' }), 2000, 'nome')
  edit((x) => ({ ...x, nome: 'AB' }), 2500, 'nome') // coalesced with the previous one
  assert.equal(s.hist[d.id].past.length, 2)
  s = reducer(s, { type: 'undo', id: d.id })
  assert.equal(s.list[0].nome, 'Meu toque 1')
  assert.ok(canRedo(s, d.id))
  s = reducer(s, { type: 'redo', id: d.id })
  assert.equal(s.list[0].nome, 'AB')
  s = reducer(s, { type: 'undo', id: d.id }); s = reducer(s, { type: 'undo', id: d.id })
  assert.deepEqual(s.list[0].hits, {})
  assert.equal(canUndo(s, d.id), false)
  edit((x) => M.applyHit(x, 'bumbo', 3, 100), 9000)
  assert.equal(canRedo(s, d.id), false)
})

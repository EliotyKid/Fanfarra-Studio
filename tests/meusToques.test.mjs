import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as M from '../lib/meusToques.js'

const rows = [{ id: 'bumbo', key: 45 }, { id: 'tarol-40', key: 40 }]

test('applyHit adds, changes strength, removes on same strength', () => {
  let d = M.novo(1)
  d = M.applyHit(d, 'bumbo', 5, 100)
  d = M.applyHit(d, 'bumbo', 1, 60)
  assert.deepEqual(d.hits.bumbo, [[1, 60], [5, 100]])
  d = M.applyHit(d, 'bumbo', 5, 127) // other strength: change
  assert.deepEqual(d.hits.bumbo, [[1, 60], [5, 127]])
  assert.deepEqual(M.applyHit(d, 'bumbo', 5, 127).hits.bumbo, [[1, 60]]) // same strength: remove
  assert.equal(M.velAt(d, 'bumbo', 1), 60)
})

test('setCompasso keeps hits (and strength) inside each bar', () => {
  const d = { ...M.novo(1), compassos: 2, hits: { bumbo: [[0, 60], [9, 100], [15, 100], [16, 127], [20, 100]] } }
  assert.deepEqual(M.setCompasso(d, '2/4').hits.bumbo, [[0, 60], [8, 127], [12, 100]])
})

test('setCompassos trims hits past the end', () => {
  const d = { ...M.novo(1), compassos: 2, hits: { bumbo: [[3, 100], [20, 100]] } }
  assert.deepEqual(M.setCompassos(d, 1).hits.bumbo, [[3, 100]])
})

test('toTracks carries the strength', () => {
  const d = { ...M.novo(1), compassos: 1, hits: { 'tarol-40': [[2, 60]] } }
  const t = M.toTracks(d, rows)
  assert.equal(t[1].steps.length, 16)
  assert.deepEqual(t[1].steps[2], [[40, 60]])
  assert.equal(t[0].steps.every((s) => s === null), true)
})

test('old saved format (bare steps) loads as Normal', () => {
  const store = { 'fanfarra-studio:meus-toques:v1': JSON.stringify([{ ...M.novo(1), hits: { bumbo: [4, 0, 4] } }]) }
  globalThis.localStorage = { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v } }
  assert.deepEqual(M.loadAll()[0].hits.bumbo, [[0, 100], [4, 100]])
})

test('parseImport sanitizes untrusted files', () => {
  const d = M.parseImport(JSON.stringify({ nome: 'x'.repeat(99), bpm: 9999, compasso: '7/8', compassos: 99, hits: { bumbo: [0, -1, 1.5, 9999, [3, 500], [5, 'x']], hack: [1] } }), rows)
  assert.equal(d.nome.length, 60)
  assert.equal(d.bpm, 240)
  assert.equal(d.compasso, '4/4')
  assert.equal(d.compassos, M.MAX_COMPASSOS)
  assert.deepEqual(d.hits, { bumbo: [[0, 100], [3, 127]] })
  assert.throws(() => M.parseImport('not json', rows))
})

test('setSubdiv keeps exact hits, snaps the rest and counts them', () => {
  const d = { ...M.novo(1), compassos: 1, hits: { bumbo: [[0, 100], [2, 60], [3, 127]] } } // 16ths: beat 1, its 8th, its last 16th
  const up = M.setSubdiv(d, 8) // fusas: everything fits exactly
  assert.deepEqual(up.doc.hits.bumbo, [[0, 100], [4, 60], [6, 127]])
  assert.equal(up.movidas, 0)
  const tri = M.setSubdiv(d, 3) // tercinas: 2/4 of a beat -> 1.5 -> 2, 3/4 -> 2.25 -> 2 (merged, strongest kept)
  assert.deepEqual(tri.doc.hits.bumbo, [[0, 100], [2, 127]])
  assert.equal(tri.movidas, 2)
  assert.equal(M.stepsPerBar(tri.doc), 12)
})

test('docs without subdiv are 16ths; import keeps a valid subdiv', () => {
  assert.equal(M.subdivOf({}), 4)
  const d = M.parseImport(JSON.stringify({ compassos: 1, subdiv: 8, hits: { bumbo: [31, 32] } }), rows)
  assert.equal(d.subdiv, 8)
  assert.deepEqual(d.hits.bumbo, [[31, 100]]) // 1 bar of 4/4 in fusas = 32 steps
  assert.equal(M.parseImport(JSON.stringify({ subdiv: 5 }), rows).subdiv, 4)
})

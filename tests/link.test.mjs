import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as M from '../lib/meusToques.js'
import { encodeToque, decodeToque, dataFromHash, shareUrl } from '../lib/link.js'

const instrumentos = { Bumbo: { 45: { pad: 'Lo Tom' } }, Tarol: { 40: { pad: 'Snare 2', rotulo: 'Pele' }, 37: { pad: 'SideStick', rotulo: 'Aro' } } }
const rows = [{ id: 'bumbo', key: 45 }, { id: 'tarol-40', key: 40 }, { id: 'tarol-37', key: 37 }]

test('link round trip: compressed, short, and validated on the way back', async () => {
  const doc = { ...M.novo(1), nome: 'Vale do aluno', compassos: 8, hits: { bumbo: Array.from({ length: 32 }, (_, i) => [i * 4, 100]), 'tarol-40': [[2, 60], [6, 127]] } }
  const data = await encodeToque(doc)
  assert.equal(data[0], 'z')
  assert.match(data, /^[A-Za-z0-9_-]+$/) // URL-safe
  assert.ok(data.length < 400, `link data ${data.length} chars`)
  const back = M.parseImport(await decodeToque(dataFromHash('#' + shareUrl('https://x', data).split('#')[1])), rows)
  assert.equal(back.nome, 'Vale do aluno')
  assert.deepEqual(back.hits, doc.hits)
})

test('bad links are rejected', async () => {
  await assert.rejects(decodeToque('zAAAA'))
  await assert.rejects(decodeToque('x123'))
  await assert.rejects(decodeToque('z' + 'A'.repeat(200000)))
})

test('temp toques are not saved', () => {
  const store = {}
  globalThis.localStorage = { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v } }
  M.saveAll([{ ...M.novo(1), nome: 'fica' }, { ...M.novo(2), temp: true }])
  assert.deepEqual(M.loadAll().map((d) => d.nome), ['fica'])
})

test('fromOfficial maps player rows to kit rows by instrument + key', () => {
  const toque = { nome: 'Vale Old', bpm: 170, compasso: '4/4', compassos: 1, stepsPerBeat: 4, tracks: [
    { inst: 'Bumbo', steps: [[[45, 100]], null, null, [[45, 76]], ...Array(12).fill(null)] },
    { inst: 'Tarol', steps: [null, [[40, 116]], [[37, 92]], ...Array(13).fill(null)] }, // one row holding both pads
  ] }
  const d = M.fromOfficial(toque, instrumentos)
  assert.equal(d.nome, 'Vale Old (minha versão)')
  assert.deepEqual(d.hits, { bumbo: [[0, 100], [3, 76]], 'tarol-40': [[1, 116]], 'tarol-37': [[2, 92]] })
  assert.equal(d.subdiv, 4)
})

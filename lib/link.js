// Share a toque inside the URL fragment (#t=...): compressed JSON, base64url. The fragment never reaches
// the server, so links need no hosting or database. Decoded text is untrusted: callers validate it
// (meusToques.parseImport) before using it.
export const HASH_KEY = 't'
const MAX_LEN = 100_000 // a dense 16-bar toque in 32nds is a few KB; anything far bigger is not ours

const toB64url = (bytes) => {
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
const fromB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))
const pipe = async (bytes, stream) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer())

// 'z' + deflate when the browser has CompressionStream, 'j' + plain JSON otherwise.
export async function encodeToque(doc) {
  const { nome, bpm, compasso, compassos, subdiv, hits } = doc
  const bytes = new TextEncoder().encode(JSON.stringify({ v: 1, nome, bpm, compasso, compassos, subdiv, hits }))
  if (typeof CompressionStream === 'undefined') return 'j' + toB64url(bytes)
  return 'z' + toB64url(await pipe(bytes, new CompressionStream('deflate-raw')))
}

// Returns the JSON text, or throws on anything malformed.
export async function decodeToque(data) {
  if (typeof data !== 'string' || data.length > MAX_LEN) throw new Error('link inválido')
  const bytes = fromB64url(data.slice(1))
  if (data[0] === 'j') return new TextDecoder().decode(bytes)
  if (data[0] === 'z') return new TextDecoder().decode(await pipe(bytes, new DecompressionStream('deflate-raw')))
  throw new Error('link inválido')
}

export const shareUrl = (origin, data) => `${origin}/criar/#${HASH_KEY}=${data}`
export const dataFromHash = (hash) => new URLSearchParams(hash.replace(/^#/, '')).get(HASH_KEY)

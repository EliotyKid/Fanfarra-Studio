import { loadToques } from '@/lib/toques'
import Player from './Player'

export default async function Page() {
  const { toques, instrumentos } = await loadToques()
  return <Player toques={toques} instrumentos={instrumentos} />
}

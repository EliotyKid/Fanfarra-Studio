import { loadInstrumentos } from '@/lib/toques'
import Editor from './Editor'

export const metadata = { title: 'Criar · Fanfarra Studio' }

export default async function Page() {
  return <Editor instrumentos={await loadInstrumentos()} />
}

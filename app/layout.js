import '@ds/styles.css'
import './globals.css'
import Shell from './Shell'

export const metadata = {
  title: 'Fanfarra Studio',
  description: 'Aprenda. Toque. Evolua.',
}

// cover + env(safe-area-inset-*) in CSS: content avoids the notch and home indicator.
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#101018' }

export default function RootLayout({ children }) {
  return (
    // Browser extensions add attributes to <html> before React loads; ignore those (this element only, not its children).
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}

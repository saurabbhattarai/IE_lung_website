import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata = {
  title: 'IE Lung - Pulmonary & Sleep Medicine',
  description: 'Inland Empire Lung and Sleep Institute - Comprehensive care for lung and sleep disorders. Science-Led. Patient-Centered.',
  generator: 'v0.app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">{children}</body>
    </html>
  )
}

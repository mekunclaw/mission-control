import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'nes.css/css/nes.min.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mission Control',
  description: 'Agent Workforce Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} nes-container is-dark`}>
        {children}
      </body>
    </html>
  )
}

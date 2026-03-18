import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'
import 'nes.css/css/nes.min.css'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixel',
})

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
    <html lang="en" className={pressStart2P.variable}>
      <body className="bg-gray-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}

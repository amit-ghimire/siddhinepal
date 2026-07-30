import type { Metadata } from 'next'
import React from 'react'

import { SmoothScroll } from '@/components/SmoothScroll'

import { archivo, ibmPlexMono, newsreader } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'SIDDHI Nepal',
  description:
    'SIDDHI Nepal — public health research and implementation NGO based in Kathmandu.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable} ${ibmPlexMono.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  )
}

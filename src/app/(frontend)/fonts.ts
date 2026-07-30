import { Archivo, IBM_Plex_Mono, Newsreader } from 'next/font/google'

// next/font/google self-hosts these at build time — no runtime request to
// Google's CDN, satisfying the brief's "self-host the subsets, don't
// hotlink" requirement. All three have paths to Devanagari support later.
export const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// Mounted once, high in the tree. Smooth scroll is itself motion, so it's
// skipped entirely under prefers-reduced-motion — native scroll behaviour
// applies instead, same as every other animation on the site.
export function SmoothScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis()
      lenis.on('scroll', ScrollTrigger.update)

      const update = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(update)
      gsap.ticker.lagSmoothing(0)

      return () => {
        gsap.ticker.remove(update)
        lenis.destroy()
      }
    })

    return () => mm.revert()
  }, [])

  return null
}

'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'

import { DuotoneImage } from '@/components/DuotoneImage'
import type { Homepage } from '@/payload-types'

import styles from './Hero.module.css'

gsap.registerPlugin(SplitText)

// Typographic hero, no video background. SplitText line-by-line mask
// reveal on the mission statement — wrapped in matchMedia so
// prefers-reduced-motion renders the final state immediately.
export function Hero({ hero }: { hero: Homepage['hero'] }) {
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const standfirstRef = useRef<HTMLParagraphElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const splits = [headlineRef.current, standfirstRef.current]
        .filter(Boolean)
        .map((el) => new SplitText(el, { type: 'lines', mask: 'lines' }))

      const lines = splits.flatMap((split) => split.lines)
      gsap.from(lines, {
        yPercent: 100,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: 'power3.out',
      })

      return () => splits.forEach((split) => split.revert())
    })

    return () => mm.revert()
  }, [])

  return (
    <header className={styles.hero}>
      <div>
        <span className="field-label">Field Report · SIDDHI Nepal</span>
        <h1 className={styles.headline} ref={headlineRef}>
          {hero?.headline}
        </h1>
        {hero?.standfirst ? (
          <p className={styles.standfirst} ref={standfirstRef}>
            {hero.standfirst}
          </p>
        ) : null}
      </div>
      {hero?.image && typeof hero.image === 'object' ? (
        <div className={styles.imageFrame}>
          <DuotoneImage media={hero.image} aspectRatio="4 / 5" sizes="420px" priority />
        </div>
      ) : null}
    </header>
  )
}

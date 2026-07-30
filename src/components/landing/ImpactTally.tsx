'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

import type { Homepage } from '@/payload-types'

import styles from './ImpactTally.module.css'

gsap.registerPlugin(ScrollTrigger)

const MAX_RENDERED_DOTS = 400

// The signature element (IMPLEMENTATION_BRIEF.md §6): a tally-sheet dot
// matrix, not an odometer counter — one dot per fixed unit, so magnitude
// reads as scale rather than a spinning number. Dots stagger in on scroll;
// prefers-reduced-motion renders every dot filled immediately.
export function ImpactTally({ figures }: { figures: Homepage['impactFigures'] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const figureEls = containerRef.current!.querySelectorAll<HTMLElement>(
          '[data-tally-figure]',
        )

        figureEls.forEach((figureEl) => {
          const dots = figureEl.querySelectorAll(`.${styles.dot}`)
          if (!dots.length) return

          gsap.set(dots, { opacity: 0, scale: 0 })
          gsap.to(dots, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'power1.out',
            stagger: { each: 0.012, from: 'start' },
            scrollTrigger: {
              trigger: figureEl,
              start: 'top 80%',
            },
          })
        })

        return () => figureEls.forEach((el) => gsap.set(el.querySelectorAll(`.${styles.dot}`), { clearProps: 'all' }))
      })

      return () => mm.revert()
    },
    { scope: containerRef, dependencies: [figures] },
  )

  if (!figures?.length) return null

  return (
    <section className={styles.section} ref={containerRef}>
      <span className="field-label">Impact Tally</span>
      {figures.map((figure, i) => {
        const unitsPerDot = Math.max(1, figure.unitsPerDot || 1)
        const dotCount = Math.max(1, Math.round(figure.value / unitsPerDot))
        const rendered = Math.min(dotCount, MAX_RENDERED_DOTS)
        const remainder = dotCount - rendered

        return (
          <div className={styles.figure} key={i} data-tally-figure>
            <div className={styles.readout}>
              <span className={styles.value}>{figure.value.toLocaleString()}</span>
              {figure.unit ? <span className={styles.unit}>{figure.unit}</span> : null}
            </div>
            <p className="field-label">
              {figure.label} — 1 dot ≈ {unitsPerDot} {figure.unit || ''}
            </p>
            <div className={styles.grid}>
              {Array.from({ length: rendered }).map((_, dotIndex) => (
                <span className={styles.dot} key={dotIndex} />
              ))}
              {remainder > 0 ? <span className={styles.overflow}>+{remainder}</span> : null}
            </div>
          </div>
        )
      })}
    </section>
  )
}

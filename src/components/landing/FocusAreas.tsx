'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

import type { FocusArea } from '@/payload-types'

import styles from './FocusAreas.module.css'

gsap.registerPlugin(ScrollTrigger)

// Pinned horizontal scroll through five numbered form-section panels — the
// safest high-impact moment on the page since it's purely typographic.
// Mobile and prefers-reduced-motion both fall back to the wrapping CSS grid
// (defined in FocusAreas.module.css) with pinning/horizontal scroll dropped
// entirely, per IMPLEMENTATION_BRIEF.md §7.
export function FocusAreas({ areas }: { areas: FocusArea[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 900px)', () => {
        const panelsEl = panelsRef.current
        if (!panelsEl) return

        panelsEl.classList.add(styles.track)
        const scrollDistance = panelsEl.scrollWidth - sectionRef.current!.clientWidth

        const tween = gsap.to(panelsEl, {
          x: -scrollDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${scrollDistance}`,
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
          },
        })

        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
          panelsEl.classList.remove(styles.track)
          gsap.set(panelsEl, { clearProps: 'transform' })
        }
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [areas] },
  )

  if (!areas.length) return null

  return (
    <section className={styles.section} ref={sectionRef}>
      <span className="field-label">Focus Areas</span>
      <div className={styles.panels} ref={panelsRef}>
        {areas.map((area, i) => (
          <article className={styles.panel} key={area.id}>
            <span className={`field-label ${styles.number}`}>SECTION 0{i + 1}</span>
            <h3 className={styles.title}>{area.title}</h3>
            <p className={styles.description}>{area.shortDescription}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

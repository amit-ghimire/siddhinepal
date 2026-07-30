'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useRef } from 'react'

import type { Project, Publication } from '@/payload-types'

import styles from './FeaturedResearch.module.css'

gsap.registerPlugin(ScrollTrigger)

type CardData = {
  href: string
  meta: string
  title: string
  summary: string
}

function projectToCard(project: Project): CardData {
  return {
    href: `/work/${project.slug}`,
    meta: `${project.status} · ${project.startYear}`,
    title: project.title,
    summary: project.summary,
  }
}

function publicationToCard(pub: Publication): CardData {
  return {
    href: `/publications/${pub.slug}`,
    meta: `${pub.type} · ${pub.year}`,
    title: pub.title,
    summary: pub.abstract || '',
  }
}

// Cards link to real project/publication pages — this is the fix for the
// old site's dead "Details" links. clip-path reveal staggers in on scroll;
// prefers-reduced-motion renders every card fully visible immediately.
export function FeaturedResearch({
  projects,
  publications,
}: {
  projects: Project[]
  publications: Publication[]
}) {
  const gridRef = useRef<HTMLDivElement>(null)
  const cards: CardData[] = [
    ...projects.map(projectToCard),
    ...publications.map(publicationToCard),
  ]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cardEls = gridRef.current?.querySelectorAll(`.${styles.card}`)
        if (!cardEls?.length) return

        gsap.from(cardEls, {
          clipPath: 'inset(0 0 100% 0)',
          y: 24,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          },
        })
      })

      return () => mm.revert()
    },
    { scope: gridRef, dependencies: [cards.length] },
  )

  if (!cards.length) return null

  return (
    <section className={styles.section}>
      <span className="field-label">Featured Research</span>
      <div className={styles.grid} ref={gridRef}>
        {cards.map((card) => (
          <Link href={card.href} className={styles.card} key={card.href}>
            <span className={`field-label ${styles.meta}`}>{card.meta}</span>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            {card.summary ? <p className={styles.summary}>{card.summary}</p> : null}
          </Link>
        ))}
      </div>
    </section>
  )
}

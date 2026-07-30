import { FeaturedResearch } from '@/components/landing/FeaturedResearch'
import { FocusAreas } from '@/components/landing/FocusAreas'
import { Hero } from '@/components/landing/Hero'
import { ImpactTally } from '@/components/landing/ImpactTally'
import { PartnersAndContact } from '@/components/landing/PartnersAndContact'
import { getPayloadClient } from '@/lib/payload'
import type { Project, Publication } from '@/payload-types'

// Landing page sections, in IMPLEMENTATION_BRIEF.md §7 order, minus the
// "Where we work" map (deferred — see plan: blocked on district-count answer
// from SIDDHI). Unanimated for now; GSAP/ScrollTrigger/Lenis added last,
// once this layout is proven with real content.
export default async function HomePage() {
  const payload = await getPayloadClient()

  const [homepage, focusAreasResult, partnersResult, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', depth: 2 }),
    payload.find({ collection: 'focus-areas', sort: 'order', limit: 5 }),
    payload.find({ collection: 'partners', limit: 0 }),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

  const featuredProjects = (homepage.featuredProjects || []).filter(
    (p): p is Project => typeof p === 'object',
  )
  const featuredPublications = (homepage.featuredPublications || []).filter(
    (p): p is Publication => typeof p === 'object',
  )

  return (
    <main>
      <Hero hero={homepage.hero} />
      <ImpactTally figures={homepage.impactFigures} />
      <FocusAreas areas={focusAreasResult.docs} />
      <FeaturedResearch projects={featuredProjects} publications={featuredPublications} />
      <PartnersAndContact partners={partnersResult.docs} siteSettings={siteSettings} />
    </main>
  )
}

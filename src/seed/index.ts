import 'dotenv/config'

import { getPayloadClient } from '@/lib/payload'

// Migrates the copy that already exists on the current single-page site
// (index.html) into the new content model. Idempotent: re-running skips
// anything that already exists by slug/email. Does NOT invent data the old
// site didn't have — e.g. no impact figures are seeded, since none exist yet.
async function run() {
  const payload = await getPayloadClient()

  // --- Admin user -----------------------------------------------------
  const adminEmail = process.env.SEED_ADMIN_EMAIL
  const adminPassword = process.env.SEED_ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) {
    console.warn(
      'Skipping admin user seed: set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one.',
    )
  } else {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: adminEmail } },
      limit: 1,
    })
    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: { email: adminEmail, password: adminPassword, name: 'SIDDHI Admin', role: 'admin' },
      })
      console.log(`Created admin user ${adminEmail}`)
    } else {
      console.log(`Admin user ${adminEmail} already exists, skipping.`)
    }
  }

  // --- Focus areas ------------------------------------------------------
  // Consolidated from the current site's 9 focus areas + 6 expertise areas
  // toward what SIDDHI actually runs (per IMPLEMENTATION_BRIEF.md §1: survey
  // research on climate/health and adolescent mental health, SBCC materials).
  // PROVISIONAL — flagged for SIDDHI to confirm/replace, see brief §4.3.
  const focusAreas = [
    {
      title: 'Public Health Research',
      slug: 'public-health-research',
      shortDescription:
        'Survey research and implementation work on maternal, adolescent, and community health.',
      order: 1,
    },
    {
      title: 'Climate Change & Health',
      slug: 'climate-change-and-health',
      shortDescription:
        "Evidence on how Nepal's changing climate affects health outcomes and health systems.",
      order: 2,
    },
    {
      title: 'Gender & Adolescent Wellbeing',
      slug: 'gender-and-adolescent-wellbeing',
      shortDescription:
        'Research and programming on gender equality, adolescent mental health, and social inclusion.',
      order: 3,
    },
    {
      title: 'Social & Behaviour Change Communication',
      slug: 'social-and-behaviour-change-communication',
      shortDescription:
        'SBCC material design and delivery for public health and development programmes.',
      order: 4,
    },
    {
      title: 'Research, Evidence & Knowledge Management',
      slug: 'research-evidence-and-knowledge-management',
      shortDescription:
        'Monitoring, evaluation, and knowledge management across research and implementation partners.',
      order: 5,
    },
  ]

  const focusAreaIds: Record<string, number> = {}
  for (const area of focusAreas) {
    const existing = await payload.find({
      collection: 'focus-areas',
      where: { slug: { equals: area.slug } },
      limit: 1,
    })
    if (existing.docs.length === 0) {
      const doc = await payload.create({ collection: 'focus-areas', data: area })
      focusAreaIds[area.slug] = doc.id
      console.log(`Created focus area: ${area.title}`)
    } else {
      focusAreaIds[area.slug] = existing.docs[0].id
    }
  }

  // --- Projects (the three the current site names under "Featured Work") -
  const projects = [
    {
      title: 'Perception & Experience of Human Milk Bank in Nepal',
      slug: 'perception-and-experience-of-human-milk-bank-in-nepal',
      status: 'ongoing' as const,
      startYear: 2024,
      summary:
        'Research on perceptions and experience of human milk banking, in partnership with Paropakar Maternity Hospital, Kathmandu.',
      locations: [{ district: 'Kathmandu', municipality: 'Paropakar Maternity Hospital' }],
      focusAreas: [focusAreaIds['public-health-research']],
    },
    {
      title: 'Mental Health & Support Needs of Adolescents in Kageshwori Manohara',
      slug: 'mental-health-and-support-needs-of-adolescents-in-kageshwori-manohara',
      status: 'ongoing' as const,
      startYear: 2024,
      summary:
        'Research into the mental health and support needs of adolescents, in partnership with Kageshwori Manohara Municipality.',
      locations: [{ district: 'Kathmandu', municipality: 'Kageshwori Manohara Municipality' }],
      focusAreas: [focusAreaIds['gender-and-adolescent-wellbeing']],
    },
    {
      title: 'Effects of Climate Change on Health in Nepal',
      slug: 'effects-of-climate-change-on-health-in-nepal',
      status: 'completed' as const,
      startYear: 2022,
      endYear: 2022,
      summary: 'Analysis of the health effects of climate change, based on the National Climate Change Survey 2022.',
      focusAreas: [focusAreaIds['climate-change-and-health']],
    },
  ]

  const projectIds: Record<string, number> = {}
  for (const project of projects) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
    })
    if (existing.docs.length === 0) {
      const doc = await payload.create({
        collection: 'projects',
        // `draft: false` alone does not publish on a non-localized
        // collection — the `_status` field's own defaultValue ('draft')
        // still wins unless set explicitly. This is real migrated content,
        // not a draft, so publish it outright.
        data: { ...project, _status: 'published' },
      })
      projectIds[project.slug] = doc.id
      console.log(`Created project: ${project.title}`)
    } else {
      projectIds[project.slug] = existing.docs[0].id
    }
  }

  // --- Team (current site's "Our Team" section, all four are exec committee)
  const team = [
    {
      name: 'Sushmita Ghimire',
      role: 'Chairperson / Founding Director',
      category: 'board' as const,
      bio: 'Public health professional with extensive experience in health, education, climate change, and humanitarian response in Nepal.',
      order: 1,
    },
    {
      name: 'Sushmita KC',
      role: 'Board Member',
      category: 'board' as const,
      bio: 'Ph.D. Scholar and public health researcher specializing in child development, gender studies, and community-oriented research.',
      order: 2,
    },
    {
      name: 'Sabina Khadka',
      role: 'Secretary',
      category: 'board' as const,
      bio: 'Responsible for administrative and organizational coordination.',
      order: 3,
    },
    {
      name: 'Kanchan Shrestha',
      role: 'Treasurer',
      category: 'board' as const,
      bio: 'Oversees financial management and accountability.',
      order: 4,
    },
  ]

  for (const member of team) {
    const existing = await payload.find({
      collection: 'team',
      where: { name: { equals: member.name } },
      limit: 1,
    })
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'team', data: member })
      console.log(`Created team member: ${member.name}`)
    }
  }

  // --- Site settings ------------------------------------------------------
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      organisationName: 'SIDDHI Nepal',
      address: 'Jawalakhel, Lalitpur-04',
      email: 'info@siddhinepal.org',
      phone: '+977-9849627546',
    },
  })
  console.log('Updated site settings.')

  // --- Homepage -------------------------------------------------------
  // Mission statement migrated near-verbatim from index.html per the brief
  // ("copy is decent and should be migrated, not rewritten"). No impact
  // figures seeded — the old site never published any; inventing numbers
  // would be worse than an empty section until SIDDHI supplies real ones.
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        headline: 'Public health research and implementation, grounded in Nepal’s communities.',
        standfirst:
          'To drive inclusive, ethical, and sustainable development by empowering communities through education, health, research, innovation, and equitable opportunities—ensuring dignity, resilience, and well-being for all.',
      },
      featuredProjects: Object.values(projectIds),
    },
  })
  console.log('Updated homepage.')

  console.log('Seed complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

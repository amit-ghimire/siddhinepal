import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'

type Args = {
  params: Promise<{ slug: string }>
}

async function getProject(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    limit: 0,
    select: { slug: true },
  })
  return result.docs.map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}
  return {
    title: `${project.title} — SIDDHI Nepal`,
    description: project.summary,
  }
}

export default async function ProjectPage({ params }: Args) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1.5rem' }}>
      <p style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}>
        {project.status} · {project.startYear}
        {project.endYear ? `–${project.endYear}` : ''}
      </p>
      <h1>{project.title}</h1>
      <p>{project.summary}</p>

      {project.locations?.length ? (
        <ul>
          {project.locations.map((loc, i) => (
            <li key={i}>
              {loc.district}
              {loc.municipality ? `, ${loc.municipality}` : ''}
            </li>
          ))}
        </ul>
      ) : null}

      {project.body ? <RichText data={project.body} /> : null}

      {project.outcomes?.length ? (
        <dl>
          {project.outcomes.map((outcome, i) => (
            <div key={i}>
              <dt>{outcome.label}</dt>
              <dd>
                {outcome.value} {outcome.unit}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </main>
  )
}

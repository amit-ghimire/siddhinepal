import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'

type Args = {
  params: Promise<{ slug: string }>
}

async function getPublication(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'publications',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'publications',
    where: { _status: { equals: 'published' } },
    limit: 0,
    select: { slug: true },
  })
  return result.docs.map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const publication = await getPublication(slug)
  if (!publication) return {}
  return {
    title: `${publication.title} — SIDDHI Nepal`,
    description: publication.abstract ?? undefined,
  }
}

export default async function PublicationPage({ params }: Args) {
  const { slug } = await params
  const publication = await getPublication(slug)
  if (!publication) notFound()

  const fileUrl =
    typeof publication.file === 'object' && publication.file ? publication.file.url : null

  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1.5rem' }}>
      <p style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}>
        {publication.type} · {publication.year}
      </p>
      <h1>{publication.title}</h1>
      {publication.authors?.length ? (
        <p>{publication.authors.map((a) => a.name).join(', ')}</p>
      ) : null}
      {publication.abstract ? <p>{publication.abstract}</p> : null}

      {fileUrl ? (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>
      ) : publication.externalUrl ? (
        <a href={publication.externalUrl} target="_blank" rel="noopener noreferrer">
          View external link
        </a>
      ) : null}
    </main>
  )
}

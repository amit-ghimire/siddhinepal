import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { getPayloadClient } from '@/lib/payload'

type Args = {
  params: Promise<{ slug: string }>
}

async function getPage(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    limit: 0,
    select: { slug: true },
  })
  return result.docs.map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}
  return { title: `${page.title} — SIDDHI Nepal` }
}

export default async function GenericPage({ params }: Args) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1.5rem' }}>
      <h1>{page.title}</h1>
      <RenderBlocks blocks={page.layout} />
    </main>
  )
}

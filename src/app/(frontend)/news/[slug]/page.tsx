import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'

type Args = {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 0,
    select: { slug: true },
  })
  return result.docs.map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return { title: `${post.title} — SIDDHI Nepal`, description: post.excerpt }
}

export default async function PostPage({ params }: Args) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1.5rem' }}>
      <h1>{post.title}</h1>
      {post.body ? <RichText data={post.body} /> : null}
    </main>
  )
}

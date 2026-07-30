import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'

export default async function NewsIndexPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 0,
  })

  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1.5rem' }}>
      <h1>News</h1>
      <ul>
        {result.docs.map((post) => (
          <li key={post.id}>
            <Link href={`/news/${post.slug}`}>{post.title}</Link>
            <p>{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}

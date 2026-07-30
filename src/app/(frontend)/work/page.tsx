import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'

export default async function WorkIndexPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    sort: '-startYear',
    depth: 0,
  })

  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1.5rem' }}>
      <h1>Our Work</h1>
      <ul>
        {result.docs.map((project) => (
          <li key={project.id}>
            <Link href={`/work/${project.slug}`}>{project.title}</Link>
            <p>{project.summary}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}

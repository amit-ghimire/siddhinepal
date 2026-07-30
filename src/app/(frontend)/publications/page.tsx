import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'

const TYPE_LABELS: Record<string, string> = {
  report: 'Report',
  'policy-brief': 'Policy Brief',
  'journal-article': 'Journal Article',
  'sbcc-material': 'SBCC Material',
  'annual-report': 'Annual Report',
}

export default async function PublicationsIndexPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'publications',
    where: { _status: { equals: 'published' } },
    sort: '-year',
    depth: 0,
  })

  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1.5rem' }}>
      <h1>Publications</h1>
      {result.docs.length === 0 ? (
        <p>Publications will be added here as SIDDHI's reports, policy briefs, and journal articles are catalogued.</p>
      ) : (
        <ul>
          {result.docs.map((pub) => (
            <li key={pub.id}>
              <Link href={`/publications/${pub.slug}`}>{pub.title}</Link>
              <p style={{ fontFamily: 'monospace' }}>
                {TYPE_LABELS[pub.type] ?? pub.type} · {pub.year}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

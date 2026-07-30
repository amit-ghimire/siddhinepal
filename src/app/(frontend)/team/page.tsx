import { getPayloadClient } from '@/lib/payload'

const CATEGORY_LABELS: Record<string, string> = {
  board: 'Board',
  staff: 'Staff',
  advisor: 'Advisors',
}

export default async function TeamPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'team',
    sort: 'order',
    depth: 1,
    limit: 0,
  })

  const byCategory = result.docs.reduce<Record<string, typeof result.docs>>((acc, member) => {
    acc[member.category] = acc[member.category] ?? []
    acc[member.category].push(member)
    return acc
  }, {})

  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1.5rem' }}>
      <h1>Our Team</h1>
      {Object.entries(byCategory).map(([category, members]) => (
        <section key={category}>
          <h2>{CATEGORY_LABELS[category] ?? category}</h2>
          <ul>
            {members.map((member) => (
              <li key={member.id}>
                <strong>{member.name}</strong> — {member.role}
                {member.bio ? <p>{member.bio}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}

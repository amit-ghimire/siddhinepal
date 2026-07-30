import { RichText } from '@payloadcms/richtext-lexical/react'

import { getPayloadClient } from '@/lib/payload'
import type { Page } from '@/payload-types'

type PageBlock = NonNullable<Page['layout']>[number]

async function TeamGrid({ category }: { category?: string | null }) {
  const payload = await getPayloadClient()
  const where =
    category && category !== 'all' ? { category: { equals: category } } : undefined
  const result = await payload.find({ collection: 'team', where, sort: 'order', limit: 0 })

  return (
    <ul>
      {result.docs.map((member) => (
        <li key={member.id}>
          <strong>{member.name}</strong> — {member.role}
        </li>
      ))}
    </ul>
  )
}

async function ContactDetails() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  return (
    <address style={{ fontStyle: 'normal' }}>
      {settings.address ? <p>{settings.address}</p> : null}
      {settings.email ? <p>{settings.email}</p> : null}
      {settings.phone ? <p>{settings.phone}</p> : null}
    </address>
  )
}

function Block({ block }: { block: PageBlock }) {
  switch (block.blockType) {
    case 'richText':
      return block.content ? <RichText data={block.content} /> : null

    case 'imageWithCaption': {
      const image = typeof block.image === 'object' ? block.image : null
      if (!image?.url) return null
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.url} alt={image.alt} />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      )
    }

    case 'statRow':
      return (
        <dl style={{ display: 'flex', gap: '2rem' }}>
          {block.stats?.map((stat, i) => (
            <div key={i}>
              <dt>{stat.label}</dt>
              <dd>
                {stat.value} {stat.unit}
              </dd>
            </div>
          ))}
        </dl>
      )

    case 'teamGrid':
      return (
        <section>
          {block.heading ? <h2>{block.heading}</h2> : null}
          <TeamGrid category={block.category} />
        </section>
      )

    case 'contactBlock':
      return (
        <section>
          {block.heading ? <h2>{block.heading}</h2> : null}
          <ContactDetails />
        </section>
      )

    default:
      return null
  }
}

export function RenderBlocks({ blocks }: { blocks: Page['layout'] }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </>
  )
}

import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

import { isAdminOrEditor } from '@/access/roles'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath('/')
        } catch {
          // no request context (e.g. seed script) — nothing to revalidate yet
        }
      },
    ],
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text', required: true },
        { name: 'standfirst', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'impactFigures',
      type: 'array',
      admin: { description: 'Feeds the tally-grid impact section.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'number', required: true },
        { name: 'unit', type: 'text' },
        {
          name: 'unitsPerDot',
          type: 'number',
          defaultValue: 50,
          admin: { description: 'e.g. one dot per 50 people surveyed.' },
        },
      ],
    },
    {
      name: 'featuredProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      maxRows: 6,
    },
    {
      name: 'featuredPublications',
      type: 'relationship',
      relationTo: 'publications',
      hasMany: true,
      maxRows: 6,
    },
  ],
}

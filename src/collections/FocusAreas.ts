import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor } from '@/access/roles'

export const FocusAreas: CollectionConfig = {
  slug: 'focus-areas',
  labels: { singular: 'Focus Area', plural: 'Focus Areas' },
  access: {
    create: isAdminOrEditor,
    read: () => true,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
    description:
      'Consolidated to five per SIDDHI leadership decision. Entries below are provisional — see IMPLEMENTATION_BRIEF.md §4.3.',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'shortDescription', type: 'textarea', required: true },
    { name: 'order', type: 'number', required: true, defaultValue: 0 },
  ],
}

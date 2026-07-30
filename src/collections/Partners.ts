import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor } from '@/access/roles'

export const Partners: CollectionConfig = {
  slug: 'partners',
  access: {
    create: isAdminOrEditor,
    read: () => true,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'url', type: 'text' },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Funder', value: 'funder' },
        { label: 'Implementing', value: 'implementing' },
        { label: 'Academic', value: 'academic' },
        { label: 'Government', value: 'government' },
      ],
    },
  ],
}

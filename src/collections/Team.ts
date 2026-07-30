import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor } from '@/access/roles'

export const Team: CollectionConfig = {
  slug: 'team',
  access: {
    create: isAdminOrEditor,
    read: () => true,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'category', 'order'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Board', value: 'board' },
        { label: 'Staff', value: 'staff' },
        { label: 'Advisor', value: 'advisor' },
      ],
    },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}

import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
  },
  access: {
    // Only admins create/manage users — editors cannot.
    create: isAdmin,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user }, id }) => user?.role === 'admin' || user?.id === id,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Only admins can change a user's role.
        update: isAdminField,
      },
    },
  ],
}

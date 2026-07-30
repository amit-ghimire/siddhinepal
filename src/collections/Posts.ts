import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, publishedOrLoggedIn } from '@/access/roles'
import { formatSlugHook } from '@/hooks/formatSlug'
import { revalidateDeleteFactory, revalidatePathFactory } from '@/hooks/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: isAdminOrEditor,
    read: publishedOrLoggedIn,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidatePathFactory('/news')],
    afterDelete: [revalidateDeleteFactory('/news')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [formatSlugHook('title')] },
    },
    { name: 'publishedAt', type: 'date' },
    { name: 'excerpt', type: 'textarea', required: true, maxLength: 240 },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'team',
    },
  ],
}

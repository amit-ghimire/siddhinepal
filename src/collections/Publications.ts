import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, publishedOrLoggedIn } from '@/access/roles'
import { formatSlugHook } from '@/hooks/formatSlug'
import { revalidateDeleteFactory, revalidatePathFactory } from '@/hooks/revalidate'

export const Publications: CollectionConfig = {
  slug: 'publications',
  access: {
    create: isAdminOrEditor,
    read: publishedOrLoggedIn,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'year'],
  },
  versions: {
    drafts: true,
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
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Report', value: 'report' },
        { label: 'Policy Brief', value: 'policy-brief' },
        { label: 'Journal Article', value: 'journal-article' },
        { label: 'SBCC Material', value: 'sbcc-material' },
        { label: 'Annual Report', value: 'annual-report' },
      ],
    },
    { name: 'year', type: 'number', required: true, min: 1990, max: 2100 },
    {
      name: 'authors',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'abstract', type: 'textarea' },
    { name: 'file', type: 'upload', relationTo: 'media' },
    {
      name: 'externalUrl',
      type: 'text',
      admin: { description: 'DOI or external link. At least one of File / External URL is required.' },
    },
    {
      name: 'relatedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data?.file && !data?.externalUrl) {
          throw new Error('Provide either a File upload or an External URL (DOI).')
        }
        return data
      },
    ],
    afterChange: [revalidatePathFactory('/publications')],
    afterDelete: [revalidateDeleteFactory('/publications')],
  },
}

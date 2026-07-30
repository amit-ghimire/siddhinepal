import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, publishedOrLoggedIn } from '@/access/roles'
import { formatSlugHook } from '@/hooks/formatSlug'
import { revalidateDeleteFactory, revalidatePathFactory } from '@/hooks/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: isAdminOrEditor,
    read: publishedOrLoggedIn,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'startYear'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidatePathFactory('/work')],
    afterDelete: [revalidateDeleteFactory('/work')],
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
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'ongoing',
      // Without this, Payload generates the same Postgres enum name for this
      // field and its own internal drafts `_status` field (both sanitize to
      // "projects_status"), and migrate fails with "invalid input value for
      // enum enum_projects_status: 'ongoing'".
      enumName: 'project_lifecycle_status',
      options: [
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    { name: 'startYear', type: 'number', required: true, min: 2000, max: 2100 },
    { name: 'endYear', type: 'number', min: 2000, max: 2100 },
    {
      name: 'locations',
      type: 'array',
      fields: [
        { name: 'district', type: 'text', required: true },
        { name: 'municipality', type: 'text' },
      ],
    },
    {
      name: 'partners',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'focusAreas',
      type: 'relationship',
      relationTo: 'focus-areas',
      hasMany: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 240,
      admin: { description: 'Max ~240 characters — used in cards and previews.' },
    },
    { name: 'body', type: 'richText' },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'relatedPublications',
      type: 'relationship',
      relationTo: 'publications',
      hasMany: true,
    },
    {
      name: 'outcomes',
      type: 'array',
      admin: { description: 'Feeds the impact tally section on the landing page.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'number', required: true },
        { name: 'unit', type: 'text' },
      ],
    },
  ],
}

import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, publishedOrLoggedIn } from '@/access/roles'
import { ContactBlock } from '@/blocks/ContactBlock'
import { ImageWithCaptionBlock } from '@/blocks/ImageWithCaptionBlock'
import { RichTextBlock } from '@/blocks/RichTextBlock'
import { StatRowBlock } from '@/blocks/StatRowBlock'
import { TeamGridBlock } from '@/blocks/TeamGridBlock'
import { formatSlugHook } from '@/hooks/formatSlug'
import { revalidateDeleteFactory, revalidatePathFactory } from '@/hooks/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: isAdminOrEditor,
    read: publishedOrLoggedIn,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    description: 'Flexible pages for About and Contact. Resist adding more block types.',
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidatePathFactory('')],
    afterDelete: [revalidateDeleteFactory('')],
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
      name: 'layout',
      type: 'blocks',
      blocks: [RichTextBlock, ImageWithCaptionBlock, StatRowBlock, TeamGridBlock, ContactBlock],
    },
  ],
}

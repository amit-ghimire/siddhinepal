import path from 'path'
import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { isAdmin, isAdminOrEditor } from '@/access/roles'

const MIN_WIDTH = 1200

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: isAdminOrEditor,
    read: () => true,
    update: isAdminOrEditor,
    // Editors cannot delete — see IMPLEMENTATION_BRIEF.md §5 `users`.
    delete: isAdmin,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'credit'],
  },
  upload: {
    // Absolute path outside the release tree — every deploy replaces the
    // release directory, so uploads must not live inside it. Must come from
    // an env var, not a __dirname-relative computation, because __dirname
    // resolves to a different, fresh release directory on every deploy.
    staticDir: process.env.UPLOADS_DIR || path.resolve(process.cwd(), 'data/media'),
    mimeTypes: ['image/*', 'application/pdf'],
    focalPoint: true,
    crop: true,
    adminThumbnail: 'thumb',
    imageSizes: [
      { name: 'thumb', width: 400, height: undefined, position: 'centre' },
      { name: 'card', width: 800, height: undefined, position: 'centre' },
      { name: 'hero', width: 1800, height: undefined, position: 'centre' },
    ],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Their photo library is inconsistent in resolution; this is the
        // guardrail so a low-res phone snapshot never lands in a hero/card
        // slot. PDFs and other non-image uploads have no width and skip this.
        if (data?.width && data.width < MIN_WIDTH) {
          throw new APIError(
            `Image is ${data.width}px wide. Minimum is ${MIN_WIDTH}px — upload a larger source image.`,
            400,
          )
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Required for every upload, including PDFs — no exceptions.',
      },
    },
    {
      name: 'credit',
      type: 'text',
    },
  ],
}

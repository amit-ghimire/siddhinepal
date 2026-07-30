import type { Block } from 'payload'

export const ImageWithCaptionBlock: Block = {
  slug: 'imageWithCaption',
  labels: { singular: 'Image with Caption', plural: 'Image with Caption Blocks' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
  ],
}

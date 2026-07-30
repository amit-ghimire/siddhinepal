import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contactBlock',
  labels: { singular: 'Contact Block', plural: 'Contact Blocks' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'showMap',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Contact details pull from the Site Settings global.' },
    },
  ],
}

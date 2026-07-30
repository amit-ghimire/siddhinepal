import type { Block } from 'payload'

export const StatRowBlock: Block = {
  slug: 'statRow',
  labels: { singular: 'Stat Row', plural: 'Stat Row Blocks' },
  fields: [
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'number', required: true },
        { name: 'unit', type: 'text' },
      ],
    },
  ],
}

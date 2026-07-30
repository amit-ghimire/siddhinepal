import type { Block } from 'payload'

export const TeamGridBlock: Block = {
  slug: 'teamGrid',
  labels: { singular: 'Team Grid', plural: 'Team Grid Blocks' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Board', value: 'board' },
        { label: 'Staff', value: 'staff' },
        { label: 'Advisor', value: 'advisor' },
        { label: 'All', value: 'all' },
      ],
      defaultValue: 'all',
      admin: { description: 'Filter the team collection shown in this grid.' },
    },
  ],
}

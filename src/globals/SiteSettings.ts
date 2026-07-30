import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

import { isAdminOrEditor } from '@/access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [
      () => {
        // Footer/contact details render on every page. Wrapped because the
        // Local API also runs from standalone scripts (seed, migrations)
        // with no active Next.js request — revalidatePath throws there.
        try {
          revalidatePath('/', 'layout')
        } catch {
          // no request context (e.g. seed script) — nothing to revalidate yet
        }
      },
    ],
  },
  fields: [
    { name: 'organisationName', type: 'text', required: true, defaultValue: 'SIDDHI Nepal' },
    { name: 'address', type: 'textarea' },
    { name: 'email', type: 'text' },
    { name: 'phone', type: 'text' },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Instagram', value: 'instagram' },
          ],
          required: true,
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'swcRegistrationNumber', type: 'text', label: 'SWC Registration Number' },
    { name: 'organisationRegistrationDetails', type: 'textarea' },
  ],
}

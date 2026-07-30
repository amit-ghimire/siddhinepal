import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

// Access control lives in code, not in the admin UI, per the brief:
// editors can create/edit content but never delete it or touch users.

export const isAdmin: Access<User> = ({ req: { user } }) => user?.role === 'admin'

export const isAdminOrEditor: Access<User> = ({ req: { user } }) =>
  user?.role === 'admin' || user?.role === 'editor'

export const isAdminField: FieldAccess<User> = ({ req: { user } }) => user?.role === 'admin'

export const isLoggedIn: Access<User> = ({ req: { user } }) => Boolean(user)

// Public content is readable by anyone; logged-in staff also see drafts.
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

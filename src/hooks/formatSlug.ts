import type { FieldHook } from 'payload'

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')

// Field-level beforeValidate hook for a `slug` text field: keeps a
// hand-edited slug as-is, otherwise derives one from `fallbackField` (title)
// so staff never have to think about it on create.
export const formatSlugHook = (fallbackField: string): FieldHook => {
  return ({ data, value }) => {
    if (typeof value === 'string' && value.length > 0) {
      return slugify(value)
    }

    const fallback = data?.[fallbackField]
    if (typeof fallback === 'string' && fallback.length > 0) {
      return slugify(fallback)
    }

    return value
  }
}

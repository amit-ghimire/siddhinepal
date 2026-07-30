import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

// Payload runs in-process inside this same Next.js server (single Hostinger
// instance, no load balancer), so a direct revalidatePath call from the
// collection hook is enough — no HTTP webhook round-trip or signing secret
// needed. Revisit only if this ever runs as more than one Node process.
const slugPath = (pathPrefix: string, slug: string) => `${pathPrefix}/${slug}`

// revalidatePath only works inside an active Next.js request. The Local API
// is also used from standalone scripts (seed, migrations) with no request
// context, where it throws "static generation store missing" — harmless
// there since there's no stale page cache to invalidate yet.
const safeRevalidatePath = (path: string) => {
  try {
    revalidatePath(path)
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes('static generation store')) {
      throw err
    }
  }
}

export const revalidatePathFactory = (pathPrefix: string): CollectionAfterChangeHook => {
  return ({ doc, previousDoc }) => {
    const isPublished = doc._status === 'published' || doc._status === undefined

    if (isPublished && doc.slug) {
      safeRevalidatePath(slugPath(pathPrefix, doc.slug))
      if (pathPrefix) safeRevalidatePath(pathPrefix)
    }

    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      safeRevalidatePath(slugPath(pathPrefix, previousDoc.slug))
    }

    return doc
  }
}

export const revalidateDeleteFactory = (pathPrefix: string): CollectionAfterDeleteHook => {
  return ({ doc }) => {
    if (doc?.slug) {
      safeRevalidatePath(slugPath(pathPrefix, doc.slug))
      if (pathPrefix) safeRevalidatePath(pathPrefix)
    }
    return doc
  }
}

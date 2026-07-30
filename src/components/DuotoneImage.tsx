import Image from 'next/image'

import type { Media } from '@/payload-types'

import styles from './DuotoneImage.module.css'

type Props = {
  media: Media | number | null | undefined
  sizes?: string
  priority?: boolean
  /** e.g. '4 / 3' — every image is constrained to a framed slot, never full-bleed. */
  aspectRatio?: string
  showCredit?: boolean
}

export function DuotoneImage({
  media,
  sizes = '100vw',
  priority = false,
  aspectRatio = '4 / 3',
  showCredit = true,
}: Props) {
  if (!media || typeof media !== 'object' || !media.url) return null

  return (
    <figure className={styles.frame} style={{ aspectRatio }}>
      <Image
        src={media.url}
        alt={media.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={styles.image}
      />
      <div className={styles.tint} />
      <div className={styles.grain} />
      {showCredit && media.credit ? <figcaption className={styles.caption}>{media.credit}</figcaption> : null}
    </figure>
  )
}

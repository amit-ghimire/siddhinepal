import Image from 'next/image'

import type { Partner, SiteSetting } from '@/payload-types'

import styles from './PartnersAndContact.module.css'

// Slow seamless marquee is added in the animation pass — this renders the
// final, static row. Contact details come from the Site Settings global,
// not hardcoded, unlike the old site.
export function PartnersAndContact({
  partners,
  siteSettings,
}: {
  partners: Partner[]
  siteSettings: SiteSetting
}) {
  return (
    <section className={styles.section}>
      {partners.length ? (
        <>
          <span className="field-label">Partners</span>
          {/* Logos rendered twice back-to-back for a seamless 50%-shift loop.
              Pure CSS — respects prefers-reduced-motion natively, no JS needed. */}
          <div className={styles.logos}>
            <div className={styles.marqueeTrack}>
              {[...partners, ...partners].map((partner, i) => {
                const logo = typeof partner.logo === 'object' ? partner.logo : null
                if (!logo?.url) return null
                return (
                  <Image
                    key={`${partner.id}-${i}`}
                    src={logo.url}
                    alt={partner.name}
                    width={160}
                    height={40}
                    className={styles.logo}
                  />
                )
              })}
            </div>
          </div>
        </>
      ) : null}

      <address className={styles.contact}>
        {siteSettings.address ? <p>{siteSettings.address}</p> : null}
        {siteSettings.email ? <p>{siteSettings.email}</p> : null}
        {siteSettings.phone ? <p>{siteSettings.phone}</p> : null}
      </address>
    </section>
  )
}

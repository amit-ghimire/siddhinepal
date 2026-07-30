import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { FocusAreas } from '@/collections/FocusAreas'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Partners } from '@/collections/Partners'
import { Posts } from '@/collections/Posts'
import { Projects } from '@/collections/Projects'
import { Publications } from '@/collections/Publications'
import { Team } from '@/collections/Team'
import { Users } from '@/collections/Users'
import { Homepage } from '@/globals/Homepage'
import { SiteSettings } from '@/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor(),
  sharp,
  collections: [Users, Media, Projects, Publications, FocusAreas, Team, Posts, Partners, Pages],
  globals: [SiteSettings, Homepage],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
})

import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type SanitizedSearchParams = Promise<{ [key: string]: string | string[] }>

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams: searchParams as SanitizedSearchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, params, searchParams: searchParams as SanitizedSearchParams, importMap })

export default NotFound

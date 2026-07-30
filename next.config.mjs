import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Sharp 0.33+ split platform binaries into @img/* packages. Tracing
  // sharp/** alone yields the wrapper without the binary and produces
  // "'sharp' is required to be installed in standalone mode" at runtime.
  outputFileTracingIncludes: {
    '/**': ['./node_modules/sharp/**/*', './node_modules/@img/**/*'],
  },
}

export default withPayload(nextConfig)

import config from '@payload-config'
import { getPayload } from 'payload'

let client: ReturnType<typeof getPayload> | null = null

// Reuse one Payload instance across requests within this process instead of
// reconnecting per call — cheap on a single-instance Hostinger deployment.
export const getPayloadClient = () => {
  if (!client) {
    client = getPayload({ config })
  }
  return client
}

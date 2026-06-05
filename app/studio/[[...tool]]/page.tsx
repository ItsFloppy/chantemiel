import { metadata as studioMetadata, viewport } from 'next-sanity/studio'
import StudioClient from './StudioClient'

// Keep the embedded Studio out of the search index.
export const metadata = {
  ...studioMetadata,
  robots: { index: false, follow: false },
}

export { viewport }

export default function StudioPage() {
  return <StudioClient />
}

import { Image } from 'tamagui'

import { getImageUrl } from '@/utils'

export function ProductImage({ url }: { url: string }) {
  return (
    <Image
      source={{ uri: getImageUrl(url) }}
      width="$6"
      height="$6"
      alt="Product Image"
    />
  )
}

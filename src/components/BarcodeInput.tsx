import { forwardRef, useState } from 'react'

import { ScanBarcode } from '@tamagui/lucide-icons'
import { Pressable } from 'react-native'
import { Input, XStack } from 'tamagui'

import BarcodeScanner from './BarcodeScanner'

export const BarcodeInput = forwardRef<HTMLInputElement, any>((props, ref) => {
  const [scannerVisible, setScannerVisible] = useState(false)
  return (
    <XStack position="relative" items="center">
      <Input width="100%" {...props} />
      <Pressable
        onPress={() => setScannerVisible(true)}
        style={{
          position: 'absolute',
          right: 10,
        }}
      >
        <ScanBarcode />
      </Pressable>
      <BarcodeScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScanned={(result) => props.onChangeText(result.data)}
      />
    </XStack>
  )
})

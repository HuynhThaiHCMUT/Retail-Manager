import { forwardRef, useState } from 'react'

import { Eye, EyeOff } from '@tamagui/lucide-icons'
import { Pressable } from 'react-native'
import { Input, XStack } from 'tamagui'

export const PasswordInput = forwardRef<HTMLInputElement, any>((props, ref) => {
  const [hidePassword, setHidePassword] = useState(true)
  return (
    <XStack position="relative" items="center">
      <Input width="100%" secureTextEntry={hidePassword} {...props} />
      <Pressable
        onPress={() => setHidePassword(!hidePassword)}
        style={{
          position: 'absolute',
          right: 10,
        }}
      >
        {hidePassword ? <EyeOff /> : <Eye />}
      </Pressable>
    </XStack>
  )
})

import { Plus } from '@tamagui/lucide-icons'
import { Button, ButtonProps } from 'tamagui'

export function FAB(props: ButtonProps) {
  return (
    <Button
      circular
      size="$5"
      icon={<Plus />}
      position="absolute"
      b="$4"
      r="$4"
      elevation="$4"
      {...props}
    />
  )
}

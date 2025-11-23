import { ArrowUpDown } from '@tamagui/lucide-icons'
import { Text } from 'tamagui'

import { Select, SelectProps } from './Select'

interface SortSelectProps extends Omit<SelectProps, 'trigger'> {}

export function SortSelect(props: SortSelectProps) {
  const { options, value, placeholder } = props

  const selectedLabel =
    typeof options[0] === 'string'
      ? ((options as string[]).find((opt) => opt === value) ?? placeholder)
      : ((options as { label: string; value: string }[]).find(
          (opt) => opt.value === value
        )?.label ?? placeholder)

  return (
    <Select
      {...props}
      trigger={
        <>
          <ArrowUpDown size={16} />
          <Text fontSize="$3" ml="$2">
            {selectedLabel}
          </Text>
        </>
      }
    />
  )
}

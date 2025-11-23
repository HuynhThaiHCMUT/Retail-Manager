import { RelativePathString, usePathname, useRouter } from 'expo-router'
import { Button, Spinner, Stack, StackProps, Text } from 'tamagui'

import { handleError } from '@/utils'

interface DataWrapperProps extends StackProps {
  isLoading: boolean
  error: any
  refetch?: () => void
  children: any
}

export const DataWrapper = ({
  isLoading,
  error,
  refetch,
  children,
  ...rest
}: DataWrapperProps) => {
  const router = useRouter()
  const pathname = usePathname()

  if (isLoading) {
    return (
      <Stack
        p="$4"
        width="100%"
        height="100%"
        items="center"
        justify="center"
        gap="$4"
        {...rest}
      >
        <Spinner size="large" color="$color" />
      </Stack>
    )
  }

  if (error) {
    return (
      <Stack
        p="$4"
        width="100%"
        height="100%"
        items="center"
        justify="center"
        gap="$4"
        {...rest}
      >
        <Text fontWeight="bold" mb="$4">
          {handleError(error)}
        </Text>
        {refetch && <Button onPress={refetch}>Thử lại</Button>}
        <Button
          onPress={() =>
            router.replace(
              (pathname + '?refresh=' + Date.now()) as RelativePathString
            )
          }
        >
          Tải lại
        </Button>
      </Stack>
    )
  }

  return (
    <Stack p="$4" flex={1} {...rest}>
      {children}
    </Stack>
  )
}

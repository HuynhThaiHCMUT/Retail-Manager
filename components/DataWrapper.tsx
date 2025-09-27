import handleError from '@/utils/error-handler'
import { Spinner, Stack, Text, Button, StackProps } from 'tamagui'

interface DataWrapperProps extends StackProps {
  isLoading: boolean
  error: any
  refetch?: () => void
  children: any
}

const DataWrapper = ({
  isLoading,
  error,
  refetch,
  children,
  ...rest
}: DataWrapperProps) => {
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
      </Stack>
    )
  }

  return (
    <Stack p="$4" flex={1} {...rest}>
      {children}
    </Stack>
  )
}

export default DataWrapper

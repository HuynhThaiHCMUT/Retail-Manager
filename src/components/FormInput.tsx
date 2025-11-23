import { Control, Controller } from 'react-hook-form'
import { Input, InputProps, Stack, StackProps, Text } from 'tamagui'

interface FormInputProps {
  name: string
  control: Control<any>
  label: string
  placeholder?: string
  defaultValue?: any
  secureTextEntry?: boolean
  errors?: any
  InputComponent?: any
  containerProps?: StackProps
  inputProps?: InputProps
}

export function FormInput({
  name,
  control,
  label,
  placeholder = '',
  defaultValue,
  secureTextEntry = false,
  errors,
  InputComponent = Input,
  containerProps = {},
  inputProps = {},
}: FormInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <Stack gap="$2" {...containerProps}>
          <Text>{label}</Text>
          <InputComponent
            onChangeText={onChange}
            value={value}
            placeholder={placeholder}
            defaultValue={defaultValue}
            secureTextEntry={secureTextEntry}
            {...inputProps}
          />
          {errors?.[name] && <Text color="red">{errors[name].message}</Text>}
        </Stack>
      )}
    />
  )
}

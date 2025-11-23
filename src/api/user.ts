import type { ImagePickerAsset } from 'expo-image-picker'

import {
  AuthDto,
  AuthDtoSchema,
  CreateUserDto,
  SignInDto,
  SignUpDto,
  UpdateUserDto,
  UserDto,
  UserDtoSchema,
} from '@/dto'

import { api } from './base'

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthDto, SignInDto>({
      query: (body) => ({
        url: 'auth/sign-in',
        method: 'POST',
        body,
      }),
      extraOptions: { responseSchema: AuthDtoSchema },
    }),
    signUp: builder.mutation<AuthDto, SignUpDto>({
      query: (body) => ({ url: 'auth/sign-up', method: 'POST', body }),
      extraOptions: { responseSchema: AuthDtoSchema },
    }),
    getUsers: builder.query<UserDto[], void>({
      query: () => 'users',
      providesTags: ['User'],
      extraOptions: { responseSchema: UserDtoSchema },
    }),
    getUser: builder.query<UserDto, string>({
      query: (id) => `users/${id}`,
      providesTags: ['User'],
      extraOptions: { responseSchema: UserDtoSchema },
    }),
    createUser: builder.mutation<UserDto, CreateUserDto>({
      query: (body) => ({ url: 'users', method: 'POST', body }),
      invalidatesTags: ['User'],
      extraOptions: { responseSchema: UserDtoSchema },
    }),
    updateUser: builder.mutation<UserDto, UpdateUserDto>({
      query: (body) => ({ url: `users/${body.id}`, method: 'PUT', body }),
      invalidatesTags: ['User'],
      extraOptions: { responseSchema: UserDtoSchema },
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
    uploadUserImage: builder.mutation<
      string,
      { id: string; file: ImagePickerAsset }
    >({
      query: ({ id, file }) => {
        const formData = new FormData()
        formData.append('file', {
          uri: file.uri,
          name: file.fileName,
          type: file.mimeType,
        } as any)
        return { url: `/users/${id}/picture`, method: 'POST', body: formData }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useSignInMutation,
  useSignUpMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUploadUserImageMutation,
} = usersApi

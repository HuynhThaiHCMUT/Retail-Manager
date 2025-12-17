import { ImagePickerAsset } from 'expo-image-picker'

import {
  CategoryDto,
  CreateProductDto,
  GetProductsQueryDto,
  ProductDto,
  ProductDtoSchema,
  UpdateProductDto,
} from '@/dto'
import { PartialList, partialListSchema } from '@/utils'

import { api } from './base'

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PartialList<ProductDto>, GetProductsQueryDto>({
      query: (params) => ({
        url: 'products',
        params: params,
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        endpointName +
        JSON.stringify({
          name: queryArgs.name,
          sortBy: queryArgs.sortBy,
          priceFrom: queryArgs.priceFrom,
          priceTo: queryArgs.priceTo,
          categories: queryArgs.categories,
        }),
      merge: (currentCache, data, { arg }) => {
        if (arg.offset === 0) {
          currentCache.items = data.items ?? []
        } else if (
          data.items &&
          !currentCache.items.find((item) => item.id === data.items?.[0]?.id)
        ) {
          currentCache.items.push(...(data.items ?? []))
        }
        currentCache.totalCount = data.totalCount
      },
      forceRefetch({ currentArg, previousArg }) {
        if (!previousArg) return true
        const resetChanged =
          currentArg?.limit !== previousArg?.limit ||
          currentArg?.name !== previousArg?.name ||
          currentArg?.sortBy !== previousArg?.sortBy ||
          currentArg?.priceFrom !== previousArg?.priceFrom ||
          currentArg?.priceTo !== previousArg?.priceTo

        const catsEqual =
          JSON.stringify(currentArg?.categories ?? []) ===
          JSON.stringify(previousArg?.categories ?? [])

        const offsetChanged = currentArg?.offset !== previousArg?.offset

        return resetChanged || !catsEqual || offsetChanged
      },
      providesTags: ['Product'],
      extraOptions: {
        responseSchema: partialListSchema(ProductDtoSchema),
      },
    }),
    getProduct: builder.query<ProductDto, string>({
      query: (id) => `products/${id}`,
      providesTags: ['Product'],
      extraOptions: {
        responseSchema: ProductDtoSchema,
      },
    }),
    createProduct: builder.mutation<ProductDto, CreateProductDto>({
      query: (body) => ({
        url: 'products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
      extraOptions: {
        responseSchema: ProductDtoSchema,
      },
    }),
    updateProduct: builder.mutation<ProductDto, UpdateProductDto>({
      query: (body) => ({
        url: `products/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Product'],
      extraOptions: {
        responseSchema: ProductDtoSchema,
      },
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImages: builder.mutation<
      string[],
      { id: string; files: ImagePickerAsset[] }
    >({
      query: ({ id, files }) => {
        const formData = new FormData()

        files.forEach((file, idx) => {
          formData.append('files', {
            uri: file.uri,
            name: file.fileName,
            type: file.mimeType,
          } as any)
        })

        return {
          url: `/products/${id}/pictures`,
          method: 'POST',
          body: formData,
        }
      },
    }),
    getCategories: builder.query<CategoryDto[], void>({
      query: () => 'categories',
      providesTags: ['Product'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
  useGetCategoriesQuery,
} = productsApi

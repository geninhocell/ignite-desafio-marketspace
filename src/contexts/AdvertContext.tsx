import { api } from '@services/api';
import { createContext, ReactNode, useState } from 'react';

type ImageType = {
  uri: string;
  type: string;
  extension: string;
  id?: string;
};

type ProductRequestContextDTO = {
  id?: string;
  name: string;
  description: string;
  price: number;
  is_new: boolean;
  accept_trade: boolean;
  payment_methods: string[];
  images: ImageType[];
};

export type AdvertContextDataProps = {
  productRequest: ProductRequestContextDTO;
  setProductRequest: (product: ProductRequestContextDTO) => void;
  createOrSaveProductIsLoading: boolean;
  createOrSaveProduct: () => Promise<void>;
};

type AdvertContextProviderProps = {
  children: ReactNode;
};

export const AdvertContext = createContext<AdvertContextDataProps>(
  {} as AdvertContextDataProps
);

export function AdvertContextProvider({
  children,
}: AdvertContextProviderProps) {
  const [productRequest, setProductRequest] = useState(
    {} as ProductRequestContextDTO
  );
  const [createOrSaveProductIsLoading, setCreateOrSaveProductIsLoading] =
    useState(false);

  async function createOrSaveProduct() {
    try {
      setCreateOrSaveProductIsLoading(true);

      let productId: string;

      if (productRequest.id) {
        await api.put(`/products/${productRequest.id}`, {
          ...productRequest,
          id: undefined,
        });
        productId = productRequest.id;
      } else {
        const response = await api.post('/products', productRequest);
        productId = response.data.id;
      }

      const imagesFiltered = productRequest.images.filter((item) => !item.id);

      if (imagesFiltered.length > 0) {
        const productImagesForm = new FormData();

        imagesFiltered
          .map((item, index) => {
            return {
              name: `${productRequest.name}-${index}.${item.extension}`.toLowerCase(),
              uri: item.uri,
              type: item.type,
            };
          })
          .forEach((item) => productImagesForm.append('images', item as any));

        productImagesForm.append('product_id', productId);

        await api.post('/products/images', productImagesForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setCreateOrSaveProductIsLoading(false);
    }
  }

  return (
    <AdvertContext.Provider
      value={{
        productRequest,
        setProductRequest,
        createOrSaveProductIsLoading,
        createOrSaveProduct,
      }}>
      {children}
    </AdvertContext.Provider>
  );
}

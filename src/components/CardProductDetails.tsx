import { ProductShowResponseDTO } from '@dtos/ProductShowResponseDTO';
import { api } from '@services/api';
import {
  Box,
  Center,
  Heading,
  HStack,
  Image,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import {
  Bank,
  Barcode,
  CreditCard,
  Money,
  QrCode,
} from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import { Loading } from './Loading';
import { UserPhoto } from './UserPhoto';

const WIDTH = Dimensions.get('window').width;

type Props = {
  product: ProductShowResponseDTO;
};

export function CardProductDetails({ product }: Props) {
  const [payments, setPayments] = useState<string[]>([]);
  const [productFormatted, setProductFormatted] = useState(
    {} as ProductShowResponseDTO
  );
  const [imageIndex, setImageIndex] = useState(0);

  const { colors, sizes } = useTheme();

  const HEIGHT = sizes[72];

  useEffect(() => {
    if (product.id) {
      const productFormat: ProductShowResponseDTO = {
        ...product,
        product_images: product.product_images.map((item) => ({
          ...item,
          path: `${api.defaults.baseURL}/images/${item.path}`,
        })),
        user: {
          ...product.user,
          avatar: `${api.defaults.baseURL}/images/${product.user.avatar}`,
        },
      };

      setProductFormatted(productFormat);
    } else {
      setProductFormatted(product);
    }
    setPayments(product.payment_methods.map((item) => item.key));
  }, [product]);

  return !productFormatted.name ? (
    <Loading />
  ) : (
    <VStack flex={1}>
      <Carousel
        width={WIDTH}
        height={HEIGHT}
        data={productFormatted.product_images}
        scrollAnimationDuration={200}
        onSnapToItem={(index) => setImageIndex(index)}
        renderItem={({ item }) => (
          <Box>
            <Image
              w={WIDTH}
              h={HEIGHT}
              source={{ uri: item.path }}
              alt="imagem do produto"
              resizeMode="cover"
              position="absolute"
            />

            {!productFormatted.is_active && (
              <Center w={WIDTH} h={HEIGHT} bg="rgba(0, 0, 0, 0.4)">
                <Heading color="gray.700" fontSize="sm">
                  ANÚNCIO DESATIVADO
                </Heading>
              </Center>
            )}
          </Box>
        )}
      />

      <HStack space={2} bottom={1.5} px={3}>
        {productFormatted.product_images.map((item, index) => (
          <Box
            key={item.id}
            flexGrow={1}
            h={1}
            bg={imageIndex === index ? 'gray.700' : 'gray.500'}
            rounded="md"
          />
        ))}
      </HStack>

      <VStack pt={5} px={6}>
        {productFormatted?.user?.avatar && (
          <HStack alignItems="center">
            <UserPhoto
              borderWidth={1}
              borderColor="blueLight"
              mr={2}
              size={6}
              alt="foto do vendedor"
              source={{ uri: productFormatted.user.avatar }}
            />

            <Text fontSize="sm" color="gray.100">
              {productFormatted.user.name}
            </Text>
          </HStack>
        )}

        <Box
          mt={6}
          alignSelf="flex-start"
          bg="gray.500"
          px={2}
          py={1}
          rounded="xl">
          <Heading color="gray.200" fontSize="2xs">
            {productFormatted.is_new ? 'NOVO' : 'USADO'}
          </Heading>
        </Box>

        <HStack mt={2} justifyContent="space-between">
          <Heading fontSize="xl" color="gray.100" flexShrink={1}>
            {productFormatted.name}
          </Heading>

          <HStack space={1} alignItems="baseline">
            <Heading fontSize="sm" color="blueLight">
              R$
            </Heading>
            <Heading fontSize="xl" color="blueLight">
              {String(productFormatted.price).replace(
                /(\d)(?=(\d{3})+(?!\d))/g,
                '$1,'
              )}
            </Heading>
          </HStack>
        </HStack>

        <Text mt={2} fontSize="sm" color="gray.200">
          {productFormatted.description}
        </Text>

        <HStack mt={6} space={1} alignItems="center">
          <Heading fontSize="sm" color="gray.200">
            Aceita troca?
          </Heading>

          <Text fontSize="sm" color="gray.200">
            {productFormatted.accept_trade ? 'Sim' : 'Não'}
          </Text>
        </HStack>

        <Heading mt={4} fontSize="sm" color="gray.200">
          Meios de pagamento:
        </Heading>

        <VStack mt={2}>
          {payments.includes('boleto') && (
            <HStack space={2}>
              <Barcode size={sizes[5]} color={colors.gray[100]} />

              <Text fontSize="sm" color="gray.200">
                Boleto
              </Text>
            </HStack>
          )}

          {payments.includes('pix') && (
            <HStack space={2}>
              <QrCode size={sizes[5]} color={colors.gray[100]} />

              <Text fontSize="sm" color="gray.200">
                Pix
              </Text>
            </HStack>
          )}

          {payments.includes('cash') && (
            <HStack space={2}>
              <Money size={sizes[5]} color={colors.gray[100]} />

              <Text fontSize="sm" color="gray.200">
                Dinheiro
              </Text>
            </HStack>
          )}

          {payments.includes('card') && (
            <HStack space={2}>
              <CreditCard size={sizes[5]} color={colors.gray[100]} />

              <Text fontSize="sm" color="gray.200">
                Cartão de crédito
              </Text>
            </HStack>
          )}

          {payments.includes('deposit') && (
            <HStack space={2}>
              <Bank size={sizes[5]} color={colors.gray[100]} />

              <Text fontSize="sm" color="gray.200">
                Depósito bancário
              </Text>
            </HStack>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
}

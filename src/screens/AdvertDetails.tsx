import { Button } from '@components/Button';
import { Loading } from '@components/Loading';
import { UserPhoto } from '@components/UserPhoto';
import { ProductShowResponseDTO } from '@dtos/ProductShowResponseDTO';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  ScrollView,
  Text,
  useTheme,
  useToast,
  VStack,
} from 'native-base';
import {
  ArrowLeft,
  Barcode,
  CreditCard,
  Money,
  QrCode,
  WhatsappLogo,
} from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Dimensions, Linking } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

type RouteParams = {
  advertId: string;
};

const WIDTH = Dimensions.get('window').width;

export function AdvertDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [payments, setPayments] = useState<string[]>([]);
  const [advert, setAdvert] = useState({} as ProductShowResponseDTO);

  const route = useRoute();
  const navigation = useNavigation();
  const { colors, sizes } = useTheme();
  const toast = useToast();

  const { advertId } = route.params as RouteParams;

  const HEIGHT = sizes[72];

  async function handleOpenWhats() {
    try {
      const url = `https://wa.me/55${advert.user.tel}`;

      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        throw new AppError('Não foi possível abrir o whatsapp!');
      }

      await Linking.openURL(url);
    } catch (e) {
      console.error(e);
      const isAppError = e instanceof AppError;

      const title = isAppError
        ? e.message
        : 'Não foi possível abrir o whatsapp. Tente novamente mais tarde!';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red',
      });
    }
  }

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      try {
        const response = await api.get<ProductShowResponseDTO>(
          `/products/${advertId}`
        );

        const productFormat = {
          ...response.data,
          product_images: response.data.product_images.map((item) => ({
            ...item,
            path: `${api.defaults.baseURL}/images/${item.path}`,
          })),
          user: {
            ...response.data.user,
            avatar: `${api.defaults.baseURL}/images/${response.data.user.avatar}`,
          },
        };

        setPayments(response.data.payment_methods.map((item) => item.key));

        setAdvert(productFormat);
      } catch (e) {
        console.error(e);
        const isAppError = e instanceof AppError;

        const title = isAppError
          ? e.message
          : 'Não foi possível abrir o anúncio. Tente novamente mais tarde!';

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red',
        });

        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <VStack flex={1} bg="gray.600">
      <ScrollView pt={6} showsVerticalScrollIndicator={false}>
        <IconButton
          pl={4}
          alignSelf="flex-start"
          icon={<ArrowLeft size={sizes[6]} color={colors.gray[100]} />}
          onPress={navigation.goBack}
        />

        <Carousel
          width={WIDTH}
          height={HEIGHT}
          data={advert.product_images}
          scrollAnimationDuration={200}
          onSnapToItem={(index) => setImageIndex(index)}
          renderItem={({ item }) => (
            <Image
              w={WIDTH}
              h={HEIGHT}
              source={{ uri: item.path }}
              alt="imagem do produto"
              resizeMode="cover"
            />
          )}
        />

        <HStack space={2} bottom={1.5} px={3}>
          <Box
            flexGrow={1}
            h={1}
            bg={imageIndex === 0 ? 'gray.700' : 'gray.500'}
            rounded="md"
          />
          <Box
            flexGrow={1}
            h={1}
            bg={imageIndex === 1 ? 'gray.700' : 'gray.500'}
            rounded="md"
          />
          <Box
            flexGrow={1}
            h={1}
            bg={imageIndex === 2 ? 'gray.700' : 'gray.500'}
            rounded="md"
          />
        </HStack>

        <VStack pt={5} px={6}>
          {advert?.user?.avatar && (
            <HStack alignItems="center">
              <UserPhoto
                borderWidth={1}
                borderColor="blueLight"
                mr={2}
                size={6}
                alt="foto do vendedor"
                source={{ uri: advert.user.avatar }}
              />

              <Text fontSize="sm" color="gray.100">
                {advert.user.name}
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
              {advert.is_new ? 'NOVO' : 'USADO'}
            </Heading>
          </Box>

          <HStack mt={2} justifyContent="space-between">
            <Heading fontSize="xl" color="gray.100">
              {advert.name}
            </Heading>

            <HStack space={1} alignItems="baseline">
              <Heading fontSize="sm" color="blueLight">
                R$
              </Heading>
              <Heading fontSize="xl" color="blueLight">
                {advert.price}
              </Heading>
            </HStack>
          </HStack>

          <Text mt={2} fontSize="sm" color="gray.200">
            {advert.description}
          </Text>

          <HStack mt={6} space={1} alignItems="center">
            <Heading fontSize="sm" color="gray.200">
              Aceita troca?
            </Heading>

            <Text fontSize="sm" color="gray.200">
              {advert.accept_trade ? 'Sim' : 'Não'}
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
                <Barcode size={sizes[5]} color={colors.gray[100]} />

                <Text fontSize="sm" color="gray.200">
                  Depósito bancário
                </Text>
              </HStack>
            )}
          </VStack>
        </VStack>
      </ScrollView>

      <HStack
        bg="gray.700"
        px={6}
        py={4}
        justifyContent="space-between"
        alignItems="center">
        <HStack space={1} alignItems="baseline">
          <Heading fontSize="sm" color="blue">
            R$
          </Heading>
          <Heading fontSize="xl" color="blue">
            {advert.price}
          </Heading>
        </HStack>

        <Button
          leftIcon={<WhatsappLogo color={colors.gray[600]} size={sizes[4]} />}
          bg="blue"
          w="48%"
          title="Entrar em contato"
          onPress={handleOpenWhats}
        />
      </HStack>
    </VStack>
  );
}

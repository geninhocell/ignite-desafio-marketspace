import { Loading } from '@components/Loading';
import { UserPhoto } from '@components/UserPhoto';
import { ProductShowResponseDTO } from '@dtos/ProductShowResponseDTO';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  Box,
  HStack,
  IconButton,
  Image,
  Text,
  useTheme,
  useToast,
  VStack,
} from 'native-base';
import { ArrowLeft } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

type RouteParams = {
  advertId: string;
};

const WIDTH = Dimensions.get('window').width;

export function AdvertDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [advert, setAdvert] = useState({} as ProductShowResponseDTO);

  const route = useRoute();
  const navigation = useNavigation();
  const { colors, sizes } = useTheme();
  const toast = useToast();

  const { advertId } = route.params as RouteParams;

  const HEIGHT = sizes[72];

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
    <VStack flex={1} pt={6}>
      <IconButton
        pl={4}
        alignSelf="flex-start"
        icon={<ArrowLeft size={sizes[6]} color={colors.gray[100]} />}
        onPress={navigation.goBack}
      />

      <Box>
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
      </Box>

      {advert?.user?.avatar && (
        <HStack px={6} pt={5} alignItems="center">
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
    </VStack>
  );
}

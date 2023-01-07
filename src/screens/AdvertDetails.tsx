import { Button } from '@components/Button';
import { CardProductDetails } from '@components/CardProductDetails';
import { Loading } from '@components/Loading';
import { ProductShowResponseDTO } from '@dtos/ProductShowResponseDTO';
import { useAdvert } from '@hooks/useAdvert';
import { useAuth } from '@hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AdvertsNavigatorRoutesProps } from '@routes/AppRoutes/adverts.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  Center,
  Heading,
  HStack,
  IconButton,
  ScrollView,
  Text,
  useTheme,
  useToast,
  VStack,
} from 'native-base';
import {
  ArrowLeft,
  PencilSimpleLine,
  Power,
  Tag,
  TrashSimple,
  WhatsappLogo,
} from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

type RouteParams = {
  advertId?: string;
  owner: boolean;
  preView?: boolean;
};

export function AdvertDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [advert, setAdvert] = useState({} as ProductShowResponseDTO);

  const route = useRoute();
  const navigation = useNavigation<AdvertsNavigatorRoutesProps>();
  const { colors, sizes } = useTheme();
  const toast = useToast();
  const { productRequest, createOrSaveProduct, createOrSaveProductIsLoading } =
    useAdvert();
  const { user } = useAuth();

  const { advertId, owner, preView } = route.params as RouteParams;

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

  async function handleToggleActiveAdvert() {
    try {
      const is_active = !advert.is_active;

      await api.patch(`/products/${advertId}`, {
        is_active,
      });

      setAdvert({ ...advert, is_active });
    } catch (e) {
      console.error(e);
      const isAppError = e instanceof AppError;

      const title = isAppError
        ? e.message
        : 'Não foi possível atualizar o anúncio. Tente novamente mais tarde!';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red',
      });
    }
  }

  async function handleDeleteAdvert() {
    try {
      await api.delete(`/products/${advertId}`);

      navigation.goBack();
    } catch (e) {
      console.error(e);
      const isAppError = e instanceof AppError;

      const title = isAppError
        ? e.message
        : 'Não foi possível atualizar o anúncio. Tente novamente mais tarde!';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red',
      });
    } finally {
      navigation.navigate('Adverts');
    }
  }

  function handleOpenAdvertNew() {
    navigation.navigate('AdvertNew', { advertId });
  }

  async function handleSendAdvert() {
    try {
      await createOrSaveProduct();

      navigation.navigate('Adverts');
    } catch (e) {
      console.error(e);
      const isAppError = e instanceof AppError;

      const title = isAppError
        ? e.message
        : 'Não foi possível publicar anúncio. Tente novamente mais tarde!';

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
        if (advertId) {
          const response = await api.get<ProductShowResponseDTO>(
            `/products/${advertId}`
          );

          setAdvert(response.data);
        }
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

    if (preView) {
      setAdvert({
        accept_trade: productRequest.accept_trade,
        created_at: '',
        description: productRequest.description,
        is_active: true,
        is_new: productRequest.is_new,
        price: productRequest.price,
        name: productRequest.name,
        payment_methods: productRequest.payment_methods.map((item) => ({
          key: item,
          name: '',
        })),
        product_images: productRequest.images.map((item) => ({
          id: item.uri,
          path: item.uri,
        })),
        updated_at: '',
        user_id: '',
        user: {
          avatar: `${api.defaults.baseURL}/images/${user.avatar}`,
          name: user.name,
          tel: '',
        },
        id: '',
      });
    } else {
      fetchProduct();
    }
  }, [advertId]);

  return isLoading ? (
    <Loading />
  ) : (
    <VStack flex={1} bg="gray.600">
      <ScrollView pt={6} showsVerticalScrollIndicator={false}>
        {preView ? (
          <Center bg="blueLight" h={24}>
            <Heading fontSize="md" color="gray.700">
              Pré visualização do anúncio
            </Heading>

            <Text fontSize="sm" color="gray.700">
              É assim que seu produto vai aparecer!
            </Text>
          </Center>
        ) : (
          <HStack justifyContent="space-between">
            <IconButton
              pl={4}
              alignSelf="flex-start"
              icon={<ArrowLeft size={sizes[6]} color={colors.gray[100]} />}
              onPress={navigation.goBack}
            />

            {owner && (
              <IconButton
                pr={4}
                alignSelf="flex-start"
                icon={
                  <PencilSimpleLine size={sizes[6]} color={colors.gray[100]} />
                }
                onPress={handleOpenAdvertNew}
              />
            )}
          </HStack>
        )}

        {advert.name && <CardProductDetails product={advert} />}

        <HStack my={10} />
      </ScrollView>

      {preView ? (
        <HStack space={2} px={6} py={5}>
          <Button
            bg="gray"
            w="48%"
            leftIcon={<ArrowLeft size={sizes[4]} color={colors.gray[200]} />}
            title="Voltar e editar"
            isLoading={createOrSaveProductIsLoading}
            onPress={navigation.goBack}
          />
          <Button
            bg="blue"
            w="48%"
            leftIcon={<Tag size={sizes[4]} color={colors.gray[700]} />}
            title="Publicar"
            isLoading={createOrSaveProductIsLoading}
            onPress={handleSendAdvert}
          />
        </HStack>
      ) : owner ? (
        <VStack p={6} space={2}>
          <Button
            leftIcon={<Power size={sizes[4]} color={colors.gray[700]} />}
            bg={advert.is_active ? 'black' : 'blue'}
            title={advert.is_active ? 'Desativar anúncio' : 'Reativar anúncio'}
            onPress={handleToggleActiveAdvert}
          />

          <Button
            leftIcon={<TrashSimple size={sizes[4]} color={colors.gray[100]} />}
            bg="gray"
            title="Excluir anúncio"
            onPress={handleDeleteAdvert}
          />
        </VStack>
      ) : (
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
      )}
    </VStack>
  );
}

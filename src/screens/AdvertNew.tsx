import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Loading } from '@components/Loading';
import { PaymentMethods } from '@components/PaymentMethods';
import { TextArea } from '@components/TextArea';
import { ProductResponseDTO } from '@dtos/ProductResponseDTO';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AdvertsNavigatorRoutesProps } from '@routes/AppRoutes/adverts.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import * as ImagePicker from 'expo-image-picker';
import {
  Box,
  FlatList,
  HStack,
  IconButton,
  Image,
  Radio,
  ScrollView,
  Switch,
  Text,
  useTheme,
  useToast,
  VStack,
} from 'native-base';
import { ArrowLeft, Plus, X } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';

type FormDataProps = {
  name: string;
  description: string;
  price: string;
};

type ImageType = {
  uri: string;
  type: string;
  extension: string;
  id?: string;
};

type RouteParams = {
  advertId?: string;
};

const signUpSchema = Yup.object({
  name: Yup.string().required('Informe o título.'),
  description: Yup.string().required('Informe a descrição.'),
  price: Yup.string().required('Informe o preço.'),
});

export function AdvertNew() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [acceptTrade, setAcceptTrade] = useState<boolean | undefined>(
    undefined
  );
  const [isNew, setIsNew] = useState('true');
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormDataProps>({
    defaultValues: {},
    resolver: yupResolver(signUpSchema),
  });

  const route = useRoute();
  const navigation = useNavigation<AdvertsNavigatorRoutesProps>();
  const { colors, sizes } = useTheme();
  const toast = useToast();

  const { advertId } = route.params as RouteParams;

  async function handleImageSelect() {
    try {
      if (images.length === 3) {
        throw new AppError('Você já selecionou as 3 imagens!');
      }

      const imageSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (imageSelected.canceled) {
        return;
      }

      const uri = imageSelected.assets[0].uri;
      const type = imageSelected.assets[0].type;
      const fileExtension = uri.split('.').pop();

      if (uri) {
        setImages((prev) => [
          {
            uri,
            type: `${type}/${fileExtension}`,
            extension: `${fileExtension}`.toLowerCase(),
          },
          ...prev,
        ]);
      }
    } catch (e) {
      const isAppError = e instanceof AppError;

      const title = isAppError
        ? e.message
        : 'Não foi possível criar anúncio. Tente novamente mais tarde!';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red',
      });
    }
  }

  async function handleImageRemove(image: ImageType) {
    try {
      if (image.id) {
        await api.delete('/products/images', {
          data: { productImagesIds: [image.id] },
        });
      }

      setImages((prev) => prev.filter((item) => item.uri !== image.uri));
    } catch (e) {
      console.error(e);
      const isAppError = e instanceof AppError;

      const title = isAppError
        ? e.message
        : 'Não foi apagar a imagem. Tente novamente mais tarde!';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red',
      });
    }
  }

  const onSubmit: SubmitHandler<FormDataProps> = async ({
    name,
    description,
    price,
  }) => {
    try {
      setIsLoading(true);

      const data = {
        name,
        description,
        price: Number(price),
        is_new: isNew === 'true',
        accept_trade: !!acceptTrade,
        payment_methods: paymentMethods,
      };

      let productId: string;

      if (advertId) {
        await api.put(`/products/${advertId}`, data);
        productId = advertId;
      } else {
        const response = await api.post('/products', data);
        productId = response.data.id;
      }

      const imagesFiltered = images.filter((item) => !item.id);

      if (imagesFiltered.length > 0) {
        const productImagesForm = new FormData();

        imagesFiltered
          .map((item, index) => {
            return {
              name: `${name}-${index}.${item.extension}`.toLowerCase(),
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

      navigation.goBack();
    } catch (e) {
      console.error(e);
      const isAppError = e instanceof AppError;

      const title = isAppError
        ? e.message
        : 'Não foi possível criar anúncio. Tente novamente mais tarde!';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red',
      });

      setIsLoading(false);
    }
  };

  function handleCancel() {
    navigation.goBack();
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoadingData(true);

        const response = await api.get<ProductResponseDTO>(
          `/products/${advertId}`
        );

        setImages(
          response.data.product_images.map((item) => ({
            extension: '',
            type: '',
            uri: `${api.defaults.baseURL}/images/${item.path}`,
            id: item.id,
          }))
        );

        setValue('name', response.data.name);
        setValue('description', response.data.description);
        setValue('price', String(response.data.price));
        setAcceptTrade(response.data.accept_trade);
        setIsNew(response.data.is_new ? 'true' : 'false');
        setPaymentMethods(
          response.data.payment_methods.map((item) => item.key)
        );
      } catch (e) {
        console.error(e);
        const isAppError = e instanceof AppError;

        const title = isAppError
          ? e.message
          : 'Não foi possível carregar as informações. Tente novamente mais tarde!';

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red',
        });

        setIsLoading(false);
      } finally {
        setIsLoadingData(false);
      }
    }

    if (advertId) {
      fetchProduct();
    }
  }, []);

  return (
    <VStack flex={1}>
      <ScrollView
        bg="gray.600"
        flex={1}
        px={6}
        showsVerticalScrollIndicator={false}>
        <HStack justifyContent="space-between">
          <IconButton
            p={0}
            icon={<ArrowLeft size={sizes[6]} color={colors.gray[100]} />}
            onPress={navigation.goBack}
          />

          <Text fontSize="xl" fontFamily="heading">
            Criar anúncio
          </Text>

          <Box size={6} />
        </HStack>

        {isLoadingData ? (
          <Loading />
        ) : (
          <VStack>
            <Text mt={6} fontFamily="heading" fontSize="md" color="gray.200">
              Imagens
            </Text>

            <Text mt={6} fontFamily="body" fontSize="sm" color="gray.300">
              Escolha até 3 imagens para mostrar o quando o seu produto é
              incrível!
            </Text>

            <FlatList
              mt={4}
              data={images}
              keyExtractor={(item) => item.uri}
              renderItem={({ item }) => (
                <Box size={24} mr={2} overflow="hidden">
                  <Image
                    size={24}
                    rounded="sm"
                    source={{ uri: item.uri }}
                    alt="Imagem do produto"
                    resizeMode="contain"
                    position="absolute"
                  />

                  <IconButton
                    p={0}
                    m={1}
                    alignSelf="flex-end"
                    size={6}
                    rounded="full"
                    bg="gray.200"
                    icon={<X size={sizes[4]} color={colors.gray[700]} />}
                    onPress={() => handleImageRemove(item)}
                  />
                </Box>
              )}
              ListFooterComponent={
                images.length < 3 ? (
                  <Box
                    size={24}
                    rounded="sm"
                    bg="gray.500"
                    alignItems="center"
                    justifyContent="center">
                    <IconButton
                      p={0}
                      icon={<Plus size={sizes[6]} color={colors.gray[400]} />}
                      onPress={handleImageSelect}
                    />
                  </Box>
                ) : null
              }
              horizontal
              showsHorizontalScrollIndicator={false}
            />

            <Text
              mt={8}
              mb={4}
              fontFamily="heading"
              fontSize="md"
              color="gray.200">
              Sobre o produto
            </Text>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  bg="gray.700"
                  placeholder="Título do anúncio"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <TextArea
                  mb={4}
                  h={40}
                  bg="gray.700"
                  placeholder="Descrição do produto"
                  placeholderTextColor="gray.400"
                  onChangeText={onChange}
                  value={value}
                  fontSize="md"
                  color="gray.200"
                  w="full"
                />
              )}
            />

            <Radio.Group
              name="myRadioGroup"
              accessibilityLabel="favorite number"
              value={isNew}
              onChange={(nextValue) => {
                setIsNew(nextValue);
              }}>
              <HStack space={5}>
                <Radio
                  value="true"
                  my={1}
                  _checked={{
                    borderColor: 'blueLight',
                    _icon: { color: 'blueLight' },
                  }}>
                  <Text fontSize="md" color="gray.200">
                    Produto novo
                  </Text>
                </Radio>
                <Radio
                  value="false"
                  my={1}
                  _checked={{
                    borderColor: 'blueLight',
                    _icon: { color: 'blueLight' },
                  }}>
                  <Text fontSize="md" color="gray.200">
                    Produto usado
                  </Text>
                </Radio>
              </HStack>
            </Radio.Group>

            <Text
              mt={8}
              mb={4}
              fontFamily="heading"
              fontSize="md"
              color="gray.200">
              Venda
            </Text>

            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value } }) => (
                <Input
                  bg="gray.700"
                  placeholder="Valor do produto"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.price?.message}
                  leftElement={
                    <Text ml={4} fontSize="md" fontFamily="heading">
                      R$
                    </Text>
                  }
                />
              )}
            />

            <Text mt={4} color="gray.200" fontSize="sm" fontFamily="heading">
              Aceita troca?
            </Text>

            <Switch
              alignSelf="flex-start"
              name="troca"
              isChecked={acceptTrade}
              size="lg"
              onTrackColor="blueLight"
              offTrackColor="gray.500"
              onThumbColor="white"
              offThumbColor="white"
              onToggle={() => setAcceptTrade((prev) => !prev)}
            />

            <PaymentMethods
              onChange={setPaymentMethods}
              values={paymentMethods}
            />
          </VStack>
        )}
      </ScrollView>

      <HStack bg="gray.700" p={6} justifyContent="space-between">
        <Button
          bg="gray"
          w="48%"
          isLoading={isLoading}
          title="Cancelar"
          onPress={handleCancel}
        />
        <Button
          w="48%"
          isLoading={isLoading}
          title={advertId ? 'Atualizar' : 'Avançar'}
          onPress={handleSubmit(onSubmit)}
        />
      </HStack>
    </VStack>
  );
}

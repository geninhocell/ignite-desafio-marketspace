import { Button } from '@components/Button';
import { ButtonSelect } from '@components/ButtonSelect';
import { Input } from '@components/Input';
import { PaymentMethods } from '@components/PaymentMethods';
import { ProductCard } from '@components/ProductCard';
import { UserPhoto } from '@components/UserPhoto';
import { ProductResponseDTO } from '@dtos/ProductResponseDTO';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/AppRoutes/index.routes';
import { api } from '@services/api';
import {
  Box,
  Divider,
  FlatList,
  HStack,
  Pressable,
  Switch,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import {
  ArrowRight,
  MagnifyingGlass,
  Plus,
  Sliders,
  Tag,
  X,
} from 'phosphor-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';

export function Home() {
  const [bottomIndex, setBottomIndex] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [productsFiltered, setProductsFiltered] = useState<
    ProductResponseDTO[]
  >([]);
  const [productIsNew, setProductIsNew] = useState<boolean | undefined>(
    undefined
  );
  const [acceptTrade, setAcceptTrade] = useState<boolean | undefined>(
    undefined
  );
  const [query, setQuery] = useState<string | undefined>(undefined);

  const [myProductsQuantity, setMyProductsQuantity] = useState(0);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { colors, sizes } = useTheme();
  const { user } = useAuth();

  const snapPoints = useMemo(() => ['3%', '80%'], []);

  function handleOpenAdvertNew(id?: string) {
    navigation.navigate('AdvertsRoutes', {
      screen: 'AdvertNew',
      params: { advertId: id },
    });
  }

  function handleOpenAdvertDetails(id: string) {
    navigation.navigate('HomeRoutes', {
      screen: 'AdvertDetails',
      params: { advertId: id },
    });
  }

  function handleToggleBottom() {
    setBottomIndex((prev) => (prev === 1 ? 0 : 1));
  }

  function handleSelectCondition(isNew: boolean) {
    setProductIsNew((prev) => (prev === isNew ? undefined : isNew));
  }

  function handleOpenAdverts() {
    navigation.navigate('AdvertsRoutes', {
      screen: 'Adverts',
    });
  }

  async function fetchProducts(reset?: boolean) {
    const params = reset
      ? {}
      : {
          query,
          is_new: productIsNew,
          accept_trade: acceptTrade,
          payment_methods: paymentMethods,
        };

    const response = await api.get<ProductResponseDTO[]>(`/products`, {
      params,
    });

    setProductsFiltered(response.data);
  }

  async function fetchMyProducts() {
    const response = await api.get<ProductResponseDTO[]>(`/users/products`, {});

    setMyProductsQuantity(
      response.data.filter((item) => item.is_active).length
    );
  }

  function handleApplyFilter() {
    fetchProducts();
  }

  function handleResetFilter() {
    setQuery(undefined);
    setProductIsNew(undefined);
    setAcceptTrade(undefined);
    setPaymentMethods([]);
    fetchProducts(true);
  }

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
      fetchMyProducts();
    }, [])
  );

  return (
    <VStack flex={1}>
      <VStack px={6} pt={6} flex={1}>
        <HStack justifyContent="space-between">
          <HStack>
            <UserPhoto
              source={{ uri: `${api.defaults.baseURL}/images/${user.avatar}` }}
              size={12}
              alt="Foto perfil"
            />
            <VStack ml={2}>
              <Text fontSize="md">Boas vindas,</Text>
              <Text fontSize="md" fontWeight={600} fontFamily="heading">
                {user.name}
              </Text>
            </VStack>
          </HStack>

          <Button
            leftIcon={<Plus size={sizes[6]} color={colors.gray[600]} />}
            w="48%"
            title="Criar anúncio"
            onPress={() => handleOpenAdvertNew()}
          />
        </HStack>

        <Text mt={8} color="gray.300" fontSize="sm">
          Seus produtos anunciados para venda
        </Text>

        <HStack
          mt={3}
          alignItems="center"
          justifyContent="space-between"
          bg="gray.600"
          px={4}
          py={3}
          rounded="sm">
          <HStack alignItems="center" space={4}>
            <Tag color={colors.blue as any} size={sizes[6]} />

            <VStack>
              <Text>{myProductsQuantity}</Text>
              <Text>Anúncios ativos</Text>
            </VStack>
          </HStack>

          <Pressable onPress={handleOpenAdverts}>
            <HStack space={4}>
              <Text
                color="blue"
                fontWeight={600}
                fontFamily="heading"
                fontSize="md">
                Meus anúncios
              </Text>

              <ArrowRight color={colors.blue as any} size={sizes[6]} />
            </HStack>
          </Pressable>
        </HStack>

        <Text mt={8} color="gray.300" fontSize="sm">
          Compre produtos variados
        </Text>

        <Input
          mt={3}
          bg="white"
          value={query}
          placeholder="Buscar anúncio"
          onChangeText={setQuery}
          rightElement={
            <HStack px={4} h={6} alignItems="center">
              <Pressable onPress={handleApplyFilter}>
                <MagnifyingGlass color={colors.gray[200]} size={sizes[6]} />
              </Pressable>

              <Divider orientation="vertical" mx={3} h="full" bg="gray.400" />

              <Pressable onPress={handleToggleBottom}>
                <Sliders color={colors.gray[200]} size={sizes[6]} />
              </Pressable>
            </HStack>
          }
        />

        <FlatList
          pt={4}
          mb={10}
          data={productsFiltered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={() => handleOpenAdvertDetails(item.id)}
            />
          )}
          numColumns={2}
          columnWrapperStyle={{ flex: 1, justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Box py={3} />}
        />
      </VStack>

      <BottomSheet
        ref={bottomSheetRef}
        index={bottomIndex}
        snapPoints={snapPoints}>
        <BottomSheetScrollView>
          <Box flex={1} px={6} pb={6}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text color="gray.100" fontSize="xl" fontFamily="heading">
                Filtrar anúncios
              </Text>

              <Pressable onPress={handleToggleBottom}>
                <X size={sizes[6]} color={colors.gray[400]} />
              </Pressable>
            </HStack>

            <Text mt={6} color="gray.200" fontSize="sm" fontFamily="heading">
              Condição
            </Text>

            <HStack mt={3} space={2}>
              <ButtonSelect
                title="NOVO"
                selected={productIsNew}
                onPress={() => handleSelectCondition(true)}
              />
              <ButtonSelect
                title="USADO"
                selected={
                  productIsNew === undefined ? productIsNew : !productIsNew
                }
                onPress={() => handleSelectCondition(false)}
              />
            </HStack>

            <Text mt={6} color="gray.200" fontSize="sm" fontFamily="heading">
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

            <HStack mt={16} justifyContent="space-between">
              <Button
                bg="gray"
                w="48%"
                title="Resetar filtros"
                onPress={handleResetFilter}
              />
              <Button
                w="48%"
                title="Aplicar filtros"
                onPress={handleApplyFilter}
              />
            </HStack>
          </Box>
        </BottomSheetScrollView>
      </BottomSheet>
    </VStack>
  );
}

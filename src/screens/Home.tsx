import TenisImg from '@assets/tenis.png';
import { Button } from '@components/Button';
import { ButtonSelect } from '@components/ButtonSelect';
import { Input } from '@components/Input';
import { UserPhoto } from '@components/UserPhoto';
import { ProductResponseDTO } from '@dtos/ProductResponseDTO';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import {
  Box,
  Checkbox,
  Divider,
  FlatList,
  HStack,
  Image,
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function Home() {
  const [bottomIndex, setBottomIndex] = useState(0);
  const [switchProduct, setSwitchProduct] = useState(false);
  const [groupValues, setGroupValues] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [productsFiltered, setProductsFiltered] = useState<
    ProductResponseDTO[]
  >([]);

  console.log(groupValues);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const { colors, sizes } = useTheme();
  const { user } = useAuth();

  const snapPoints = useMemo(() => ['3%', '80%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleCheckChanges = useCallback((items: string[]) => {
    console.log('handleSheetChanges', items);
    setGroupValues(items);
  }, []);

  function handleToggleBottom() {
    setBottomIndex((prev) => (prev === 1 ? 0 : 1));
  }

  useEffect(() => {
    async function fetchProducts() {
      const response = await api.get<ProductResponseDTO[]>('/users/products');

      setProducts(response.data);
      setProductsFiltered(response.data);
    }

    fetchProducts();
  }, []);

  return (
    <VStack safeAreaTop flex={1}>
      <VStack px={6} pt={6}>
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
              <Text>4</Text>
              <Text>Anúncios ativos</Text>
            </VStack>
          </HStack>

          <Pressable>
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
          rightElement={
            <HStack px={4} h={6} alignItems="center">
              <Pressable onPress={() => console.log('lupa')}>
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
          mt={4}
          data={productsFiltered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Box alignSelf="flex-start">
              {item.product_images.length > 0 ? (
                <Image
                  w={40}
                  h={24}
                  rounded="md"
                  source={{
                    uri: `${api.defaults.baseURL}/images/${item.product_images[0].path}`,
                  }}
                  resizeMode="contain"
                  alt={item.name}
                />
              ) : (
                <Box bg="gray.600" rounded="md" w={40} h={24} />
              )}

              {item.is_new ? (
                <Text
                  color="white"
                  bg="blueLight"
                  alignSelf="flex-start"
                  px={3}
                  py={1}
                  rounded="full"
                  fontSize="2xs"
                  fontFamily="heading"
                  position="absolute"
                  right={2}
                  top={2}>
                  NOVO
                </Text>
              ) : (
                <Text
                  color="white"
                  bg="gray.200"
                  alignSelf="flex-start"
                  px={3}
                  py={1}
                  rounded="full"
                  fontSize="2xs"
                  fontFamily="heading"
                  position="absolute"
                  right={2}
                  top={2}>
                  USADO
                </Text>
              )}

              <Text color="gray.200" fontSize="sm">
                {item.name}
              </Text>

              <Text
                color="gray.100"
                fontSize="sm"
                fontWeight={600}
                fontFamily="heading">
                R$ {item.price}
              </Text>
            </Box>
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
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
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
              <ButtonSelect title="NOVO" selected />
              <ButtonSelect title="USADO" />
            </HStack>

            <Text mt={6} color="gray.200" fontSize="sm" fontFamily="heading">
              Aceita troca?
            </Text>

            <Switch
              alignSelf="flex-start"
              name="troca"
              isChecked={switchProduct}
              size="lg"
              onTrackColor="blueLight"
              offTrackColor="gray.500"
              onThumbColor="white"
              offThumbColor="white"
              onToggle={() => setSwitchProduct((prev) => !prev)}
            />

            <Text mt={6} color="gray.200" fontSize="sm" fontFamily="heading">
              Meios de pagamento aceitos
            </Text>

            <Checkbox.Group
              onChange={(values) => handleCheckChanges(values || [])}
              value={groupValues}
              accessibilityLabel="choose numbers">
              <Checkbox
                _icon={{ color: 'white' }}
                _checked={{
                  bg: 'blueLight',
                  borderColor: 'blueLight',
                  _pressed: { borderColor: 'blueLight', bg: 'blue' },
                }}
                _text={{ fontSize: 'md' }}
                size="md"
                my={1}
                value="Boleto"
                accessibilityLabel="This is a dummy checkbox">
                Boleto
              </Checkbox>

              <Checkbox
                _icon={{ color: 'white' }}
                _checked={{
                  bg: 'blueLight',
                  borderColor: 'blueLight',
                  _pressed: { borderColor: 'blueLight', bg: 'blue' },
                }}
                _text={{ fontSize: 'md' }}
                size="md"
                my={1}
                value="Pix"
                accessibilityLabel="This is a dummy checkbox">
                Pix
              </Checkbox>

              <Checkbox
                _icon={{ color: 'white' }}
                _checked={{
                  bg: 'blueLight',
                  borderColor: 'blueLight',
                  _pressed: { borderColor: 'blueLight', bg: 'blue' },
                }}
                _text={{ fontSize: 'md' }}
                size="md"
                my={1}
                value="Dinheiro"
                accessibilityLabel="This is a dummy checkbox">
                Dinheiro
              </Checkbox>

              <Checkbox
                _icon={{ color: 'white' }}
                _checked={{
                  bg: 'blueLight',
                  borderColor: 'blueLight',
                  _pressed: { borderColor: 'blueLight', bg: 'blue' },
                }}
                _text={{ fontSize: 'md' }}
                size="md"
                my={1}
                value="Cartão de Crédito"
                accessibilityLabel="This is a dummy checkbox">
                Cartão de Crédito
              </Checkbox>

              <Checkbox
                _icon={{ color: 'white' }}
                _checked={{
                  bg: 'blueLight',
                  borderColor: 'blueLight',
                  _pressed: { borderColor: 'blueLight', bg: 'blue' },
                }}
                _text={{ fontSize: 'md' }}
                size="md"
                my={1}
                value="Depósito Bancário"
                accessibilityLabel="This is a dummy checkbox">
                Depósito Bancário
              </Checkbox>
            </Checkbox.Group>

            <HStack mt={16} justifyContent="space-between">
              <Button bg="gray" w="48%" title="Resetar filtros" />
              <Button w="48%" title="Aplicar filtros" />
            </HStack>
          </Box>
        </BottomSheetScrollView>
      </BottomSheet>
    </VStack>
  );
}

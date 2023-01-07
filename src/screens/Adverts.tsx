import { Loading } from '@components/Loading';
import { ProductCard } from '@components/ProductCard';
import { ProductResponseDTO } from '@dtos/ProductResponseDTO';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AdvertsNavigatorRoutesProps } from '@routes/AppRoutes/adverts.routes';
import { api } from '@services/api';
import {
  Box,
  CheckIcon,
  FlatList,
  HStack,
  IconButton,
  Select,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import { Plus } from 'phosphor-react-native';
import { useCallback, useState } from 'react';

type ActiveTypes = 'todos' | 'ativos' | 'inativos';

export function Adverts() {
  const [isLoading, setIsLoading] = useState(true);
  const [adverts, setAdverts] = useState<ProductResponseDTO[]>([]);
  const [advertsFiltered, setAdvertsFiltered] = useState<ProductResponseDTO[]>(
    []
  );

  const [active, setActive] = useState<ActiveTypes>('todos');

  const navigation = useNavigation<AdvertsNavigatorRoutesProps>();

  const { sizes, colors } = useTheme();

  function handleOpenAdvertNew() {
    navigation.navigate('AdvertNew', { advertId: undefined });
  }

  function handleOpenAdvertDetails(id: string) {
    navigation.navigate('AdvertDetails', { advertId: id, owner: true });
  }

  async function fetchAdverts() {
    setIsLoading(true);
    const response = await api.get('/users/products');

    setAdverts(response.data);
    setAdvertsFiltered(response.data);
    setIsLoading(false);
  }

  function handleSelectAtivo(activeType: ActiveTypes) {
    const ativo = adverts.filter((item) => item.is_active);
    const inativo = adverts.filter((item) => !item.is_active);

    const advertsFilter =
      activeType === 'todos'
        ? adverts
        : activeType === 'ativos'
        ? ativo
        : inativo;

    setAdvertsFiltered(advertsFilter);
    setActive(activeType);
  }

  useFocusEffect(
    useCallback(() => {
      fetchAdverts();
    }, [])
  );

  return (
    <VStack flex={1} px={6}>
      <HStack justifyContent="space-between">
        <Box size={6} />

        <Text fontSize="xl" fontFamily="heading">
          Meus anúncios
        </Text>

        <IconButton
          p={0}
          icon={<Plus size={sizes[6]} color={colors.gray[100]} />}
          onPress={handleOpenAdvertNew}
        />
      </HStack>

      <HStack mt={8} alignItems="center" justifyContent="space-between">
        <Text fontSize="sm">{advertsFiltered.length} anúncios</Text>

        <Select
          selectedValue={active}
          minWidth="111"
          accessibilityLabel="escolha de ativo"
          placeholder="Choose Service"
          _selectedItem={{
            bg: 'blueLight',
            endIcon: <CheckIcon size="5" />,
          }}
          onValueChange={(itemValue) =>
            handleSelectAtivo(itemValue as ActiveTypes)
          }>
          <Select.Item label="Todos" value="todos" />
          <Select.Item label="Ativos" value="ativos" />
          <Select.Item label="Inativos" value="inativos" />
        </Select>
      </HStack>

      <FlatList
        my={5}
        data={advertsFiltered}
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
        ListEmptyComponent={() => (isLoading ? <Loading /> : null)}
        ListFooterComponent={<Box my={24} />}
      />
    </VStack>
  );
}

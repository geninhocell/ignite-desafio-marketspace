import { ProductResponseDTO } from '@dtos/ProductResponseDTO';
import { api } from '@services/api';
import {
  Box,
  HStack,
  Image,
  IPressableProps,
  Pressable,
  Text,
} from 'native-base';

type Props = IPressableProps & {
  item: ProductResponseDTO;
};

export function ProductCard({ item, ...rest }: Props) {
  const isActive = item.is_active === undefined ? true : item.is_active;

  return (
    <Pressable alignSelf="flex-start" {...rest}>
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

      <Text color={isActive ? 'gray.200' : 'gray.400'} fontSize="sm">
        {item.name}
      </Text>

      <HStack space={1} alignItems="flex-end">
        <Text
          color={isActive ? 'gray.100' : 'gray.400'}
          fontSize="xs"
          fontFamily="heading">
          R$
        </Text>
        <Text
          color={isActive ? 'gray.100' : 'gray.400'}
          fontSize="sm"
          fontFamily="heading">
          {item.price}
        </Text>
      </HStack>
    </Pressable>
  );
}

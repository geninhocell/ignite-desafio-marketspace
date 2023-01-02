import {
  Circle,
  HStack,
  Text,
  useTheme,
  IPressableProps,
  Pressable,
} from 'native-base';
import { X } from 'phosphor-react-native';

type Props = IPressableProps & {
  title: string;
  selected?: boolean;
};

export function ButtonSelect({ title, selected = false, ...rest }: Props) {
  const { colors, sizes } = useTheme();

  return (
    <Pressable {...rest}>
      <HStack
        bg={selected ? 'blueLight' : 'gray.500'}
        px={4}
        py={1}
        rounded="full">
        <Text
          color={selected ? 'white' : 'gray.300'}
          fontSize="xs"
          fontFamily="heading">
          {title}
        </Text>

        {selected && (
          <Circle ml={2} bg="gray.600" rounded="full" p={1}>
            <X color={colors.blueLight} size={sizes[2]} weight="bold" />
          </Circle>
        )}
      </HStack>
    </Pressable>
  );
}

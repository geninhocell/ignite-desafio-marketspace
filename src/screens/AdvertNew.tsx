import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { PaymentMethods } from '@components/PaymentMethods';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { AdvertsNavigatorRoutesProps } from '@routes/adverts.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  Box,
  Checkbox,
  HStack,
  IconButton,
  Pressable,
  Radio,
  ScrollView,
  Switch,
  Text,
  TextArea,
  useTheme,
  useToast,
  VStack,
} from 'native-base';
import { ArrowLeft, Plus } from 'phosphor-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

type FormDataProps = {
  name: string;
  description: string;
  price: string;
};

const signUpSchema = Yup.object({
  name: Yup.string().required('Informe o título.'),
  description: Yup.string().required('Informe a descrição.'),
  price: Yup.string().required('Informe o preço.'),
});

export function AdvertNew() {
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTrade, setAcceptTrade] = useState<boolean | undefined>(
    undefined
  );
  const [isNew, setIsNew] = useState('true');
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {},
    resolver: yupResolver(signUpSchema),
  });

  const navigation = useNavigation<AdvertsNavigatorRoutesProps>();
  const { colors, sizes } = useTheme();
  const toast = useToast();

  async function handleCreateAdvert({ name }: FormDataProps) {
    try {
      setIsLoading(true);

      await api.post('/products', { name });

      navigation.navigate('Adverts');
    } catch (e) {
      const isAppError = e instanceof AppError;

      const title = isAppError
        ? e.message
        : 'Não foi possível criar anúncio. Tente novamente mais tarde!';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });

      setIsLoading(false);
    }
  }

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

        <Text mt={6} fontFamily="heading" fontSize="md" color="gray.200">
          Imagens
        </Text>

        <Text mt={6} fontFamily="body" fontSize="sm" color="gray.300">
          Escolha até 3 imagens para mostrar o quando o seu produto é incrível!
        </Text>

        <Pressable
          mt={4}
          size={24}
          bg="gray.500"
          alignItems="center"
          justifyContent="center">
          <IconButton
            p={0}
            icon={<Plus size={sizes[6]} color={colors.gray[400]} />}
          />
        </Pressable>

        <Text mt={8} mb={4} fontFamily="heading" fontSize="md" color="gray.200">
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
              fontSize="md"
              color="gray.200"
              w="full"
              autoCompleteType={undefined}
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

        <Text mt={8} mb={4} fontFamily="heading" fontSize="md" color="gray.200">
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

        <PaymentMethods onChange={setPaymentMethods} values={paymentMethods} />
      </ScrollView>

      <HStack bg="gray.700" p={6} justifyContent="space-between">
        <Button bg="gray" w="48%" title="Cancelar" />
        <Button w="48%" title="Avançar" />
      </HStack>
    </VStack>
  );
}

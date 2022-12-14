import LogoSvg from '@assets/logo.svg';
import MarketspaceSvg from '@assets/marketspace.svg';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { TextLight } from '@components/TextLight';
import { TextRegular } from '@components/TextRegular';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { AppError } from '@utils/AppError';
import {
  Center,
  ScrollView,
  Text,
  useTheme,
  useToast,
  VStack,
} from 'native-base';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

type FormDataProps = {
  email: string;
  password: string;
};

const signUpSchema = Yup.object({
  email: Yup.string().required('Informe o email.').email('Email inválido.'),
  password: Yup.string()
    .required('Informe a senha.')
    .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
});

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(signUpSchema),
  });

  const { colors, sizes } = useTheme();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();

  function handleNewAccount() {
    navigation.navigate('SignUp');
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true);
      // await signIn(email, password);
    } catch (e) {
      const isAppError = e instanceof AppError;

      const title = isAppError
        ? e.message
        : 'Não foi possível entrar. Tente novamente mais tarde!';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });

      setIsLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <Center p={12} bg="gray.600" rounded="2xl">
        <LogoSvg width={sizes[24]} height={sizes[16]} />
        <MarketspaceSvg />

        <TextLight text="Seu espaço de compra e venda" />

        <VStack mt={12} w="full" space={2}>
          <TextRegular textAlign="center" text="Acesse sua conta" />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                returnKeyType="send"
                onSubmitEditing={handleSubmit(handleSignIn)}
                errorMessage={errors.password?.message}
              />
            )}
          />
        </VStack>

        <Button
          isLoading={isLoading}
          title="Entrar"
          bg="blue"
          onPress={handleSubmit(handleSignIn)}
        />
      </Center>

      <Center p={12}>
        <Text color="gray.200" fontSize="sm" fontFamily="body">
          Ainda não tem acesso?
        </Text>

        <Button
          mt={2}
          title="Criar uma conta"
          bg="gray"
          onPress={handleNewAccount}
        />
      </Center>
    </ScrollView>
  );
}

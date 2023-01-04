import DefaultAvatarImg from '@assets/default-avatar.png';
import LogoSvg from '@assets/logo.svg';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { TextBold } from '@components/TextBold';
import { TextRegular } from '@components/TextRegular';
import { UserPhoto } from '@components/UserPhoto';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Center, ScrollView, Text, useTheme, useToast } from 'native-base';
import { PencilSimpleLine } from 'phosphor-react-native';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import * as Yup from 'yup';

type FormDataProps = {
  name: string;
  email: string;
  tel: string;
  password: string;
  password_confirm: string;
};

const signUpSchema = Yup.object({
  name: Yup.string().required('Informe o nome.'),
  email: Yup.string().required('Informe o email.').email('Email inválido.'),
  tel: Yup.string().required('Informe o telefone.'),
  password: Yup.string()
    .required('Informe a senha.')
    .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: Yup.string()
    .required('Confirme a senha.')
    .oneOf([Yup.ref('password'), null], 'A confirmação da senha não confere.'),
});

type PhotoType = {
  uri: string;
  type: string;
  extension: string;
};

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState({} as PhotoType);

  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();
  const { colors, sizes } = useTheme();
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: '',
      email: '',
      tel: '',
      password: '',
      password_confirm: '',
    },
    resolver: yupResolver(signUpSchema),
  });

  function handleGoBack() {
    navigation.goBack();
  }

  const onSubmit: SubmitHandler<FormDataProps> = async ({
    name,
    email,
    tel,
    password,
  }) => {
    try {
      setIsLoading(true);

      const photoFile = {
        name: `${name}.${userPhoto.extension}`.toLowerCase(),
        uri: userPhoto.uri,
        type: userPhoto.type,
      } as any;

      const userForm = new FormData();

      userForm.append('avatar', photoFile);
      userForm.append('name', name);
      userForm.append('email', email);
      userForm.append('tel', tel);
      userForm.append('password', password);

      await api.post('/users', userForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await signIn(email, password);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);

      const isAppError = e instanceof AppError;
      const title = isAppError
        ? e.message
        : 'Não foi possível criar a conta. Tente mais tarde!' + e;

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red',
      });
    }
  };

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      const uri = photoSelected.assets[0].uri;
      const type = photoSelected.assets[0].type;
      const fileExtension = uri.split('.').pop();

      if (uri) {
        const photoInfo = await FileSystem.getInfoAsync(uri);

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          });
        }

        setUserPhoto({
          uri,
          type: `${type}/${fileExtension}`,
          extension: `${fileExtension}`.toLowerCase(),
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      bg="gray.600">
      <Center p={12}>
        <LogoSvg width={sizes[24]} height={sizes[16]} />

        <TextBold color="gray.100" fontSize="xl" text="Boas vindas!" />

        <TextRegular
          textAlign="center"
          text="Crie sua conta e use o espaço para comprar itens variados e vender seus produtos"
        />

        <Center
          m={6}
          borderWidth={3}
          borderColor="blueLight"
          rounded="full"
          bg="gray.500">
          <UserPhoto
            source={
              userPhoto.uri?.length > 0
                ? { uri: userPhoto.uri }
                : DefaultAvatarImg
            }
            size={40}
            alt="foto de avatar do usuário"
          />

          <Center
            position="absolute"
            bottom={0}
            right={0}
            bg="blueLight"
            rounded="full"
            p={2}>
            <TouchableOpacity onPress={handleUserPhotoSelect}>
              <PencilSimpleLine size={sizes[8]} color={colors.gray[700]} />
            </TouchableOpacity>
          </Center>
        </Center>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Nome"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
            />
          )}
        />

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
          name="tel"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Telefone"
              keyboardType="numeric"
              autoCapitalize="none"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.tel?.message}
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
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password_confirm"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Confirmar senha"
              secureTextEntry
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password_confirm?.message}
              returnKeyType="send"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
        />

        <Button
          mt={4}
          title="Criar uma conta"
          bg="black"
          isLoading={isLoading}
          onPress={handleSubmit(onSubmit)}
        />

        <Text mt={12} color="gray.200" fontSize="sm" fontFamily="body">
          Já tem uma conta?
        </Text>

        <Button
          mt={2}
          isLoading={isLoading}
          title="Ir para login"
          bg="gray"
          onPress={handleGoBack}
        />
      </Center>
    </ScrollView>
  );
}

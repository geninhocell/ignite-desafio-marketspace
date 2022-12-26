import { Loading } from '@components/Loading';
import { AuthContextProvider } from '@contexts/AuthContext';
import {
  Karla_400Regular,
  Karla_700Bold,
  Karla_300Light,
  useFonts,
} from '@expo-google-fonts/karla';
import { Routes } from '@routes/index';
import { THEME } from '@theme/index';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';

export default function App() {
  const [fontsLoaded] = useFonts({
    Karla_700Bold,
    Karla_400Regular,
    Karla_300Light,
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar style="auto" />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}

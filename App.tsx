import { Loading } from '@components/Loading';
import {
  Karla_400Regular,
  Karla_700Bold,
  useFonts,
} from '@expo-google-fonts/karla';
import { THEME } from '@theme/index';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import { Text } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    Karla_400Regular,
    Karla_700Bold,
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar style="auto" />
      {fontsLoaded ? (
        <Text>Open up App.js to start working on your app!</Text>
      ) : (
        <Loading />
      )}
    </NativeBaseProvider>
  );
}

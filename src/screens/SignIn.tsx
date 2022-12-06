import LogoSvg from '@assets/logo.svg';
import MarketspaceSvg from '@assets/marketspace.svg';
import { Center, ScrollView, Text, useTheme, VStack } from 'native-base';

export function SignIn() {
  const { colors, sizes } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <Center>
        <LogoSvg width={sizes[24]} height={sizes[16]} />
        <MarketspaceSvg />
      </Center>
    </ScrollView>
  );
}

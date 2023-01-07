import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Home } from '@screens/Home';

export type HomeRoutesType = {
  Home: undefined;
};

export type HomeNavigatorRoutesProps =
  NativeStackNavigationProp<HomeRoutesType>;

const { Navigator, Screen } = createNativeStackNavigator<HomeRoutesType>();

export function HomeRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Screen name="Home" component={Home} />
    </Navigator>
  );
}

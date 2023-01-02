import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { AdvertNew } from '@screens/AdvertNew';
import { Adverts } from '@screens/Adverts';

export type AdvertsRoutesType = {
  Adverts: undefined;
  AdvertNew: undefined;
};

export type AdvertsNavigatorRoutesProps =
  NativeStackNavigationProp<AdvertsRoutesType>;

const { Navigator, Screen } = createNativeStackNavigator<AdvertsRoutesType>();

export function AdvertsRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="Adverts" component={Adverts} />
      <Screen name="AdvertNew" component={AdvertNew} />
    </Navigator>
  );
}

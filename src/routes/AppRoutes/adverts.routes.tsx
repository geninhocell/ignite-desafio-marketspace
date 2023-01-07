import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { AdvertDetails } from '@screens/AdvertDetails';
import { AdvertNew } from '@screens/AdvertNew';
import { Adverts } from '@screens/Adverts';

export type AdvertsRoutesType = {
  Adverts: undefined;
  AdvertNew: { advertId?: string };
  AdvertDetails: { advertId?: string; owner: boolean; preView?: boolean };
};

export type AdvertsNavigatorRoutesProps =
  NativeStackNavigationProp<AdvertsRoutesType>;

const { Navigator, Screen } = createNativeStackNavigator<AdvertsRoutesType>();

export function AdvertsRoutes() {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Adverts">
      <Screen name="Adverts" component={Adverts} />
      <Screen name="AdvertNew" component={AdvertNew} />
      <Screen name="AdvertDetails" component={AdvertDetails} />
    </Navigator>
  );
}

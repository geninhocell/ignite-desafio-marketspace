import HistorySvg from '@assets/history.svg';
import HomeSvg from '@assets/home.svg';
import ProfileSvg from '@assets/profile.svg';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { Adverts } from '@screens/Adverts';
import { Home } from '@screens/Home';
import { useTheme } from 'native-base';
import { Platform } from 'react-native';

type AppRoutesType = {
  Home: undefined;
  Adverts: undefined;
  SignOut: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutesType>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesType>();

export function AppRoutes() {
  const { sizes, colors } = useTheme();

  const iconSize = sizes[6];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.green[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: sizes[10],
          paddingTop: sizes[6],
        },
      }}>
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="Adverts"
        component={Adverts}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
    </Navigator>
  );
}

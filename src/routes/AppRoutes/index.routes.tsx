import { useAuth } from '@hooks/useAuth';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import {
  getFocusedRouteNameFromRoute,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { SignIn } from '@screens/SignIn';
import { useTheme } from 'native-base';
import { Tag, House, SignOut } from 'phosphor-react-native';
import { Platform } from 'react-native';

import { AdvertsRoutes, AdvertsRoutesType } from './adverts.routes';
import { HomeRoutes, HomeRoutesType } from './home.routes';

type AppRoutesType = {
  HomeRoutes: NavigatorScreenParams<HomeRoutesType>;
  AdvertsRoutes: NavigatorScreenParams<AdvertsRoutesType>;
  SignIn: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutesType>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesType>();

export function AppRoutes() {
  const { sizes, colors } = useTheme();
  const { signOut } = useAuth();

  const iconSize = sizes[6];

  const barStyle = {
    backgroundColor: colors.gray[600],
    borderTopWidth: 0,
    height: Platform.OS === 'android' ? 'auto' : 96,
    paddingBottom: sizes[6],
    paddingTop: sizes[6],
  };

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.gray[200],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: barStyle,
      }}>
      <Screen
        name="HomeRoutes"
        component={HomeRoutes}
        options={({ route }) => ({
          tabBarIcon: ({ color }) => <House color={color} size={iconSize} />,
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';

            if (routeName === 'AdvertDetails') {
              return { ...barStyle, display: 'none' };
            }

            return barStyle;
          })(route),
        })}
      />
      <Screen
        name="AdvertsRoutes"
        component={AdvertsRoutes}
        options={({ route }) => ({
          tabBarIcon: ({ color }) => <Tag color={color} size={iconSize} />,
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';

            if (routeName === 'AdvertDetails') {
              return { ...barStyle, display: 'none' };
            }

            return barStyle;
          })(route),
        })}
      />
      <Screen
        name="SignIn"
        component={SignIn}
        options={{
          tabBarIcon: () => (
            <SignOut color={colors.red as any} size={iconSize} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();

            //Any custom code here
            // alert(123);
            signOut();
          },
        }}
      />
    </Navigator>
  );
}

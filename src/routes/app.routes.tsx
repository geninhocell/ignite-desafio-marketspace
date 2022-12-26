import { useAuth } from '@hooks/useAuth';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { Adverts } from '@screens/Adverts';
import { Home } from '@screens/Home';
import { SignIn } from '@screens/SignIn';
import { useTheme } from 'native-base';
import { Tag, House, SignOut } from 'phosphor-react-native';
import { Platform } from 'react-native';

type AppRoutesType = {
  Home: undefined;
  Adverts: undefined;
  SignIn: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutesType>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesType>();

export function AppRoutes() {
  const { sizes, colors } = useTheme();
  const { signOut } = useAuth();

  const iconSize = sizes[6];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.gray[200],
        tabBarInactiveTintColor: colors.gray[400],
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
          tabBarIcon: ({ color }) => <House color={color} size={iconSize} />,
        }}
      />
      <Screen
        name="Adverts"
        component={Adverts}
        options={{
          tabBarIcon: ({ color }) => <Tag color={color} size={iconSize} />,
        }}
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

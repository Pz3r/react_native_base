import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HallsScreen from '../screens';
import HallsDetail from '../screens/hallDetail';
import {
  SECTION_HALLS_HOME_SCREEN,
  NAVIGATION_HALLS_DETAIL,
} from '../../../navigation/constants';

const Stack = createStackNavigator();

export default function HallsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={({navigation, route}) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={SECTION_HALLS_HOME_SCREEN}
        component={HallsScreen}
      />
      <Stack.Screen
        options={({navigation, route}) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_HALLS_DETAIL}
        component={HallsDetail}
      />
    </Stack.Navigator>
  );
}

import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NAVIGATION_HOME_SCREEN} from '../../../navigation/constants';
import HomeScreen from '../screens';

const HomeStack = createStackNavigator();

export default function HomeStackNavigator() {

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_HOME_SCREEN}
        component={HomeScreen} />
    </HomeStack.Navigator>
  )
}
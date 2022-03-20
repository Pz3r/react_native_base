import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { NAVIGATION_MAIN_TABS } from './constants';
import MainTabNavigator from './tab';

const Stack = createStackNavigator();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator 
      animationEnabled={false}
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen 
        name={NAVIGATION_MAIN_TABS} 
        component={MainTabNavigator} />
    </Stack.Navigator>
  )
}
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { NAVIGATION_MAIN_TABS, NAVIGATION_PHOTO_STACK, NAVIGATION_MAP_DETAIL_STACK } from './constants';
import MainTabNavigator from './tab';
import PhotoStackNavigator from '../sections/photo/navigation/stack';
import MapDetailStackNavigator from '../sections/map/navigation/detailStack';

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
      <Stack.Screen
        name={NAVIGATION_PHOTO_STACK}
        component={PhotoStackNavigator} />
      <Stack.Screen
        name={NAVIGATION_MAP_DETAIL_STACK}
        component={MapDetailStackNavigator} />
    </Stack.Navigator>
  )
}
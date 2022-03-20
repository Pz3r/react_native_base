import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { NAVIGATION_HOME_STACK } from './constants';
import HomeStackNavigator from '../sections/home/navigation/stack';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Tab.Screen name={NAVIGATION_HOME_STACK} component={HomeStackNavigator} />
    </Tab.Navigator>
  )
}
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { NAVIGATION_FAQ_STACK, NAVIGATION_HOME_STACK, NAVIGATION_MAKING_STACK, NAVIGATION_MAP_STACK, NAVIGATION_PROFILE_STACK } from './constants';
import HomeStackNavigator from '../sections/home/navigation/stack';
import MakingStackNavigator from '../sections/making/navigation/stack';
import MapStackNavigator from '../sections/map/navigation/stack';
import FaqStackNavigator from '../sections/faq/navigation/stack';
import ProfileStackNavigator from '../sections/profile/navigation/stack';
import AppFooter from '../components/AppFooter/AppFooter';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <AppFooter {...props} />}
      >
      <Tab.Screen name={NAVIGATION_HOME_STACK} component={HomeStackNavigator} />      
      <Tab.Screen name={NAVIGATION_MAP_STACK} component={MapStackNavigator} />
      <Tab.Screen name={NAVIGATION_FAQ_STACK} component={FaqStackNavigator} />
      <Tab.Screen name={NAVIGATION_PROFILE_STACK} component={ProfileStackNavigator} />
    </Tab.Navigator>
  )
}
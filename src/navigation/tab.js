import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AppFooter from '../components/AppFooter'
import { SECTION_ABOUT_STACK, SECTION_GUIDE_STACK, SECTION_HALLS_STACK } from './constants';
import AboutStackNavigator from '../sections/about/navigation/stack';
import GuideStackNavigator from '../sections/guide/navigation/stack';
import HallsStackNavigator from '../sections/halls/navigation/stack';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <AppFooter {...props} />}>
        <Tab.Screen name={SECTION_ABOUT_STACK} component={AboutStackNavigator} />
        <Tab.Screen name={SECTION_GUIDE_STACK} component={GuideStackNavigator} />
    </Tab.Navigator>
  )
}
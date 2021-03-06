import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { NAVIGATION_MAIN_TABS, NAVIGATION_PHOTO_STACK, NAVIGATION_MAP_DETAIL_STACK, NAVIGATION_QUIZ_STACK, NAVIGATION_PRIVACY_NOTICE_STACK, NAVIGATION_PARTY_STACK } from './constants';
import MainTabNavigator from './tab';
import PhotoStackNavigator from '../sections/photo/navigation/stack';
import MapDetailStackNavigator from '../sections/map/navigation/detailStack';
import QuizStackNavigator from '../sections/quiz/navigation/stack';
import PrivacyNoticeStackNavigator from '../sections/privacy/navigation/stack';
import PartyStackNavigator from '../sections/party/navigation/stack';

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
      <Stack.Screen
        name={NAVIGATION_QUIZ_STACK}
        component={QuizStackNavigator} />
      <Stack.Screen
        name={NAVIGATION_PRIVACY_NOTICE_STACK}
        component={PrivacyNoticeStackNavigator} />
      <Stack.Screen
        name={NAVIGATION_PARTY_STACK}
        component={PartyStackNavigator} />
    </Stack.Navigator>
  )
}
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NAVIGATION_PROFILE_HOME_SCREEN } from '../../../navigation/constants';
import PrivacyNoticeScreen from '../screens';

const PrivacyNoticeStack = createStackNavigator();

export default function PrivacyNoticeStackNavigator() {

  return (
    <PrivacyNoticeStack.Navigator>
      <PrivacyNoticeStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_PROFILE_HOME_SCREEN}
        component={PrivacyNoticeScreen} />
    </PrivacyNoticeStack.Navigator>
  )
}
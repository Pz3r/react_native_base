import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NAVIGATION_PROFILE_HOME_SCREEN } from '../../../navigation/constants';
import ProfileHomeScreen from '../screens';

const ProfileStack = createStackNavigator();

export default function ProfileStackNavigator() {

  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_PROFILE_HOME_SCREEN}
        component={ProfileHomeScreen} />
    </ProfileStack.Navigator>
  )
}
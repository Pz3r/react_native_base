import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NAVIGATION_AUTHENTICATION_SCREEN } from '../../../navigation/constants';
import AuthenticationScreen from '../screens';

const AuthenticationStack = createStackNavigator();

export default function AuthenticationStackNavigator() {

  return (
    <AuthenticationStack.Navigator>
      <AuthenticationStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_AUTHENTICATION_SCREEN}
        component={AuthenticationScreen} />
    </AuthenticationStack.Navigator>
  )
}
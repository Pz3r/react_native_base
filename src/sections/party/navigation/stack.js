import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NAVIGATION_PARTY_HOME_SCREEN } from '../../../navigation/constants';
import PartyHomeScreen from '../screens';

const PartyStack = createStackNavigator();

export default function PartyStackNavigator() {

  return (
    <PartyStack.Navigator>
      <PartyStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_PARTY_HOME_SCREEN}
        component={PartyHomeScreen} />
    </PartyStack.Navigator>
  )
}
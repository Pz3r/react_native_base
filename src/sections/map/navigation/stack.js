import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NAVIGATION_MAP_HOME_SCREEN } from '../../../navigation/constants';
import MapHomeScreen from '../screens';

const MapStack = createStackNavigator();

export default function MapStackNavigator() {

  return (
    <MapStack.Navigator>
      <MapStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_MAP_HOME_SCREEN}
        component={MapHomeScreen} />
    </MapStack.Navigator>
  )
}
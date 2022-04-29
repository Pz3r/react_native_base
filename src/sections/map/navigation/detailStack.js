import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NAVIGATION_MAP_DETAIL_SCREEN } from '../../../navigation/constants';
import MapDetailScreen from '../screens/detail';

const MapDetailStack = createStackNavigator();

export default function MapDetailStackNavigator() {

  return (
    <MapDetailStack.Navigator>
      <MapDetailStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_MAP_DETAIL_SCREEN}
        component={MapDetailScreen} />
    </MapDetailStack.Navigator>
  )
}
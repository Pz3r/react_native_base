import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import MainStackNavigator from './stack';
import { NAVIGATION_MAIN_STACK } from './constants';

const Drawer = createDrawerNavigator();

export default function MainDrawerNavigator() {

  return (
    <Drawer.Navigator>
      <Drawer.Screen 
        name={NAVIGATION_MAIN_STACK} 
        component={MainStackNavigator} />
    </Drawer.Navigator>
  )

}
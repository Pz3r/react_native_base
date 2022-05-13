import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import MainStackNavigator from './stack';
import { NAVIGATION_MAIN_STACK } from './constants';
import AppDrawer from '../components/AppDrawer/AppDrawer';

const Drawer = createDrawerNavigator();

export default function MainDrawerNavigator() {

  return (
    <Drawer.Navigator
      drawerContent={(props) => <AppDrawer {...props} />}>
      <Drawer.Screen 
        options={{ headerShown: false }}
        name={NAVIGATION_MAIN_STACK} 
        component={MainStackNavigator} />
    </Drawer.Navigator>
  )

}
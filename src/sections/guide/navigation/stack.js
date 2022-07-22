import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { SECTION_GUIDE_HOME_SCREEN } from '../../../navigation/constants';
import GuideScreen from '../screens';

const Stack = createStackNavigator();

export default function GuideStackNavigator() {

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={SECTION_GUIDE_HOME_SCREEN}
        component={GuideScreen} />
    </Stack.Navigator>
  )
}
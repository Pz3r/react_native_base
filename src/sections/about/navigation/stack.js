import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {
  SECTION_ABOUT_HOME_SCREEN,
  NAVIGATION_TIMELINE,
} from '../../../navigation/constants';
import AboutScreen from '../screens';
import TimelineDetail from '../screens/timelineDetail';

const Stack = createStackNavigator();

export default function AboutStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        tabBar={() => null}
        options={({navigation, route}) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={SECTION_ABOUT_HOME_SCREEN}
        component={AboutScreen}
      />
      <Stack.Screen
        options={({navigation, route}) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_TIMELINE}
        component={TimelineDetail}
      />
    </Stack.Navigator>
  );
}

import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NAVIGATION_MAKING_HOME_SCREEN} from '../../../navigation/constants';
import MakingHomeScreen from '../screens';

const MakingStack = createStackNavigator();

export default function MakingStackNavigator() {

  return (
    <MakingStack.Navigator>
      <MakingStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_MAKING_HOME_SCREEN}
        component={MakingHomeScreen} />
    </MakingStack.Navigator>
  )
}
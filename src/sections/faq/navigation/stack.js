import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NAVIGATION_FAQ_HOME_SCREEN} from '../../../navigation/constants';
import FaqHomeScreen from '../screens';

const FaqStack = createStackNavigator();

export default function FaqStackNavigator() {

  return (
    <FaqStack.Navigator>
      <FaqStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_FAQ_HOME_SCREEN}
        component={FaqHomeScreen} />
    </FaqStack.Navigator>
  )
}
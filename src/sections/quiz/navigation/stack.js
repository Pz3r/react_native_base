import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NAVIGATION_QUIZ_HOME_SCREEN } from '../../../navigation/constants';
import QuizHomeScreen from '../screens';

const QuizStack = createStackNavigator();

export default function QuizStackNavigator() {

  return (
    <QuizStack.Navigator>
      <QuizStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_QUIZ_HOME_SCREEN}
        component={QuizHomeScreen} />
    </QuizStack.Navigator>
  )
}
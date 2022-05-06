import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { NAVIGATION_QUIZ_HOME_SCREEN, NAVIGATION_QUIZ_QUESTION_SCREEN, NAVIGATION_QUIZ_RESULT_SCREEN } from '../../../navigation/constants';
import QuizHomeScreen from '../screens';
import QuizResultScreen from '../screens/result';
import QuizQuestionScreen from '../screens/question';

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
      <QuizStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_QUIZ_QUESTION_SCREEN}
        component={QuizQuestionScreen} /> 
            <QuizStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_QUIZ_RESULT_SCREEN}
        component={QuizResultScreen} />  
    </QuizStack.Navigator>
  )
}
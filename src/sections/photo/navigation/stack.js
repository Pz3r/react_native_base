import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NAVIGATION_PHOTO_ONBOARDING_SCREEN, NAVIGATION_PHOTO_CAMERA_VISION_SCREEN, NAVIGATION_PHOTO_CAMERA_EXPO_SCREEN } from '../../../navigation/constants';
import PhotoOnboardingScreen from '../screens';
import ExpoCameraScreen from '../screens/expo-camera';
import CameraScreen from '../screens/camera';

const PhotoStack = createStackNavigator();

export default function PhotoStackNavigator() {

  return (
    <PhotoStack.Navigator>
      <PhotoStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_PHOTO_ONBOARDING_SCREEN}
        component={PhotoOnboardingScreen} />
      <PhotoStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_PHOTO_CAMERA_VISION_SCREEN}
        component={CameraScreen} />
            <PhotoStack.Screen
        options={({ navigation, route }) => ({
          headerTitle: null,
          headerShown: false,
        })}
        name={NAVIGATION_PHOTO_CAMERA_EXPO_SCREEN}
        component={ExpoCameraScreen} />
    </PhotoStack.Navigator>
  )
}
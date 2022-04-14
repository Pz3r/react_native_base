import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NAVIGATION_PHOTO_ONBOARDING_SCREEN, NAVIGATION_PHOTO_PERMISSIONS_SCREEN, NAVIGATION_PHOTO_PREVIEW_SCREEN, NAVIGATION_PHOTO_CAMERA_SCREEN, NAVIGATION_PHOTO_STAMP_SCREEN } from '../../../navigation/constants';
import PhotoOnboardingScreen from '../screens';
import PhotoPermissionsScreen from '../screens/permissions';
import PhotoCameraScreen from '../screens/camera';
import PhotoPreviewScreen from '../screens/preview';
import PhotoStampScreen from '../screens/stamp';

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
          headerShown: false
        })}
        name={NAVIGATION_PHOTO_PERMISSIONS_SCREEN}
        component={PhotoPermissionsScreen} />
      <PhotoStack.Screen
        options={({ navigation, route }) => ({
        })}
        name={NAVIGATION_PHOTO_CAMERA_SCREEN}
        component={PhotoCameraScreen} />
      <PhotoStack.Screen
        options={({ navigation, route }) => ({
        })}
        name={NAVIGATION_PHOTO_PREVIEW_SCREEN}
        component={PhotoPreviewScreen} />
      <PhotoStack.Screen
        options={({ navigation, route }) => ({
        })}
        name={NAVIGATION_PHOTO_STAMP_SCREEN}
        component={PhotoStampScreen} />  
    </PhotoStack.Navigator>
  )
}
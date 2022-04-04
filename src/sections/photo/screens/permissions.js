import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Linking } from 'react-native';
import { Flex, Text, Button } from 'native-base';
import { Camera } from 'react-native-vision-camera';

import { NAVIGATION_PHOTO_CAMERA_SCREEN } from '../../../navigation/constants';

export default function PhotoPermissionsScreen({ navigation }) {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState('not-determined');

  const requestCameraPermission = useCallback(async () => {
    console.log(`===== Photo:PermissionsScreen:requestCameraPermission =====`);
    const permissionStatus = await Camera.requestMicrophonePermission();
    console.log(`permissionStatus: ${permissionStatus}`);
    if (permissionStatus === 'denied') await Linking.openSettings();
    setCameraPermissionStatus(permissionStatus);
  }, []);

  useEffect(() => {
    console.log(`===== Photo:PermissionsScreen:useEffect ${cameraPermissionStatus} =====`);
    if (cameraPermissionStatus === 'authorized') navigation.replace(NAVIGATION_PHOTO_CAMERA_SCREEN);
  }, [cameraPermissionStatus, navigation]);

  return (
    <Flex flex="1" style={styles.container}>
      <Flex flex="2" alignItems="center" justifyContent="center">
        <Text>Acepta los permisos para usar tu cámara</Text>
      </Flex>
      <Flex flex="1" alignItems="center" justifyContent="center">
        <Button onPress={requestCameraPermission}>Continuar</Button>
      </Flex>
    </Flex>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  }
});
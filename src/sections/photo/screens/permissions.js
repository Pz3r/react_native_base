import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Linking } from 'react-native';
import { Flex, Text, Button } from 'native-base';
import { Camera } from 'react-native-vision-camera';

import { NAVIGATION_HOME_SCREEN, NAVIGATION_HOME_STACK, NAVIGATION_PHOTO_CAMERA_SCREEN } from '../../../navigation/constants';

export default function PhotoPermissionsScreen({ navigation }) {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState('not-determined');

  const requestCameraPermission = useCallback(async () => {
    console.log(`===== Photo:PermissionsScreen:requestCameraPermission =====`);
    const permissionStatus = await Camera.requestMicrophonePermission();
    console.log(`permissionStatus: ${permissionStatus}`);
    if (permissionStatus === 'denied') await Linking.openSettings();
    setCameraPermissionStatus(permissionStatus);
  }, []);

  const cancel = useCallback(() => {
    navigation.navigate(NAVIGATION_HOME_STACK);
  }, []);

  useEffect(() => {
    console.log(`===== Photo:PermissionsScreen:useEffect ${cameraPermissionStatus} =====`);
    if (cameraPermissionStatus === 'authorized') navigation.replace(NAVIGATION_PHOTO_CAMERA_SCREEN);
  }, [cameraPermissionStatus, navigation]);

  return (
    <Flex flex="1" style={styles.container}>
      <Flex flex="1" alignItems="center" justifyContent="flex-end" style={styles.top}>
        <Text>ANTES DE TOMAR TU FOTO CONSIDERA...</Text>
      </Flex>
      <Flex flex="2.5" alignItems="center" justifyContent="center" style={styles.middle}>
        <Text>PLACEHOLDER CARRUSEL</Text>
      </Flex>
      <Flex flex="1" alignItems="center" justifyContent="center" style={styles.bottom}>
        <Flex flex="1" alignItems="center" justifyContent="center">
          <Button onPress={requestCameraPermission}>Tomar foto</Button>
        </Flex>
        <Flex flex="1" alignItems="center" justifyContent="center">
          <Button onPress={cancel}>No quiero tomar la foto</Button>
        </Flex>       
      </Flex>
    </Flex>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#bbb',    
  },
  top: {
    backgroundColor: '#f00',
    paddingHorizontal: 50
  },
  middle: {
    backgroundColor: '#0f0',
  },
  bottom: {
    backgroundColor: '#00f'
  }
});
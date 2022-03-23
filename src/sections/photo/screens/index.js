import React from 'react';
import { StyleSheet } from 'react-native';
import { Flex, Text, Button } from 'native-base';

import { NAVIGATION_PHOTO_CAMERA_VISION_SCREEN, NAVIGATION_PHOTO_CAMERA_EXPO_SCREEN } from '../../../navigation/constants';

function PhotoOnboardingScreen({ navigation }) {

  return (
    <Flex flex="1" style={styles.container}>
      <Flex flex="2" alignItems="center" justifyContent="center">
      <Text>
        PhotoOnboardingScreen
      </Text>
      </Flex>
      <Flex flex="1" alignItems="center" justifyContent="center">
        <Button
          onPress={() => navigation.navigate(NAVIGATION_PHOTO_CAMERA_VISION_SCREEN)}>
          Tomar foto (Vision)
        </Button>
      </Flex>
      <Flex flex="1" alignItems="center" justifyContent="center">
        <Button
          onPress={() => navigation.navigate(NAVIGATION_PHOTO_CAMERA_EXPO_SCREEN)}>
          Tomar foto (Expo)
        </Button>
      </Flex>
    </Flex>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

export default PhotoOnboardingScreen;
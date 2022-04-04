import React from 'react';
import { StyleSheet } from 'react-native';
import { Flex, Text, Button } from 'native-base';

import { NAVIGATION_PHOTO_PERMISSIONS_SCREEN } from '../../../navigation/constants';

function PhotoOnboardingScreen({ navigation }) {

  return (
    <Flex flex="1" style={styles.container}>
      <Flex flex="2" alignItems="center" justifyContent="center">
        <Text> PhotoOnboardingScreen</Text>
        <Text>Paso 1: bla bla</Text>
        <Text>Paso 2: bla bla</Text>
        <Text>Paso 3: bla bla</Text>
      </Flex>
      <Flex flex="1" alignItems="center" justifyContent="center">
        <Button
          onPress={() => navigation.navigate(NAVIGATION_PHOTO_PERMISSIONS_SCREEN)}>
          Continuar
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
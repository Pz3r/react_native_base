import React from 'react';
import { StyleSheet } from 'react-native';
import { Flex, Text } from 'native-base';
import LottieView from 'lottie-react-native';

import Lottie from 'assets/lottie';

function MapHomeScreen({ navigation }) {

  return (
    <Flex flex="1" style={styles.container} alignItems="center" justifyContent="center">
      <LottieView source={Lottie.eleva} autoPlay loop />
    </Flex>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  }
});

export default MapHomeScreen;
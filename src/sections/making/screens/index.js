import React from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import { Flex, Text } from 'native-base';
import Lottie from "assets/lottie";

function MakingHomeScreen({ navigation }) {

  return (
    <Flex flex="1" style={styles.container} alignItems="center" justifyContent="center">
      <LottieView source={Lottie.fondo3} autoPlay loop />
    </Flex>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  }
});

export default MakingHomeScreen;
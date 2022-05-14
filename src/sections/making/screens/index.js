import React, { useState } from 'react';
import LottieView from 'lottie-react-native';
import { Picker, StyleSheet } from 'react-native';
import { Flex, Text } from 'native-base';
import Lottie from 'assets/lottie';

function MakingHomeScreen({ navigation }) {
  const [animation, setAnimation] = useState('confetti')
  const animationList = ['confetti', 'fondo1', 'fondo2', 'fondo3', 'limpia', 'balon', 'cara', 'eleva']

  return (
    <Flex flex="1" style={styles.container} alignItems="center" justifyContent="center">
      <LottieView source={Lottie[animation]} autoPlay loop />
      <Picker
        selectedValue={animation}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => setAnimation(itemValue)}
      >
        { animationList.map(item => (
          <Picker.Item label={item} value={item} />
        ))}
      </Picker>
    </Flex>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EA4B79',
  }
});

export default MakingHomeScreen;
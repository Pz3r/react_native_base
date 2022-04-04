import React from 'react';
import { StyleSheet } from 'react-native';
import { Flex, Text } from 'native-base';

function MakingHomeScreen({ navigation }) {

  return (
    <Flex flex="1" style={styles.container} alignItems="center" justifyContent="center">
      <Text>Making Of Home</Text>
    </Flex>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  }
});

export default MakingHomeScreen;
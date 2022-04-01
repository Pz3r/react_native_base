import React from 'react';
import { StyleSheet } from 'react-native';
import { Flex, Text } from 'native-base';

function ProfileHomeScreen({ navigation }) {

  return (
    <Flex flex="1" style={styles.container} alignItems="center" justifyContent="center">
      <Text>Profile Home</Text>
    </Flex>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  }
});

export default ProfileHomeScreen;
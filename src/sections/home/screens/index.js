import React from 'react';
import { StyleSheet } from 'react-native';
import { Flex, Text } from 'native-base';

function HomeScreen({ navigation }) {

  return (
    <Flex flex="1" style={styles.container}>
      <Flex flex="21" alignItems="center" justifyContent="center">
        <Text>
          HomeScreen
        </Text>
      </Flex>
    </Flex>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
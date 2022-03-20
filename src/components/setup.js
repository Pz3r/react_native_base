import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MainComponent from './main';

function SetupComponent(){
  return (
    <SafeAreaView style={styles.container}>
      <MainComponent />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SetupComponent;
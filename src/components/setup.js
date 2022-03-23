import React from 'react';
import { StyleSheet } from 'react-native';

import MainComponent from './main';

function SetupComponent() {
  return (
    <MainComponent />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SetupComponent;
import React from 'react';
import { StyleSheet } from 'react-native';

import { QuietProvider } from './context/QuietContext';
import MainTabNavigator from './navigation/tab';

function SetupComponent() {
  return (
    <QuietProvider>
      <MainTabNavigator />
    </QuietProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SetupComponent;
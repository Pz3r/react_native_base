import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import { Amplify } from 'aws-amplify';
import i18n from 'i18n-js';

import locales from './src/locales';
import SetupComponent from './src/components/setup';
import store from './src/store/store';
// import awsconfig from './src/aws-exports';

// Setup Amplify
// Amplify.configure(awsconfig);

// Setup internationalization
i18n.translations = locales;
i18n.fallbacks = true;
i18n.defaultLocale = 'es';

export default function App() {

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Provider store={store}>
          <NativeBaseProvider>
            <SetupComponent />
          </NativeBaseProvider>
        </Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import 'react-native-gesture-handler';

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import AppLoading from 'expo-app-loading';
import i18n from 'i18n-js';
import {
  useFonts,
  Arvo_400Regular,
  Arvo_400Regular_Italic,
  Arvo_700Bold,
  Arvo_700Bold_Italic,
} from '@expo-google-fonts/arvo';

import locales from './src/locales'
import SetupComponent from './src/setup';

// Setup internationalization
i18n.translations = locales;
i18n.fallbacks = true;
i18n.defaultLocale = 'en';

export default function App() {
  let [fontsLoaded] = useFonts({
    Arvo_400Regular,
    Arvo_400Regular_Italic,
    Arvo_700Bold,
    Arvo_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <NativeBaseProvider>
            <SetupComponent />
          </NativeBaseProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}

import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View, TouchableOpacity } from 'react-native';
import { Flex, Text, Button, ScrollView, Icon } from 'native-base';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import i18n from 'i18n-js';
import LottieView from 'lottie-react-native';

import IMG from 'assets/img';
import Lottie from 'assets/lottie';

import { SAFE_AREA_PADDING } from '../../../constants/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';

const TAG = 'PartyHomeScreen';
const BACKGROUNDS = [Lottie.fondo3, Lottie.fondo1, Lottie.fondo2]

function PartyHomeScreen({ navigation }) {
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  /*
  return (

    <Flex flex={1} style={{ backgroundColor: '#1d1d1d' }}>
      <LottieView source={Lottie.fondoLoop} />
    </Flex>
  )
  */

  return (

    <Flex flex={1}>
      <LottieView source={BACKGROUNDS[backgroundIndex]} autoPlay loop />
      <TouchableOpacity onPress={() => setBackgroundIndex(backgroundIndex === 2 ? 0 : backgroundIndex + 1)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image style={{ height: '20%', resizeMode: 'contain', opacity: 0.5 }} source={IMG.manitaClick} />
      </TouchableOpacity>
    </Flex>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: SAFE_AREA_PADDING.paddingTop,
  },
  top: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  middle: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  subTitle: {
    fontFamily: 'OperaBlackOblique',
    color: '#00994c',
    fontSize: 30,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  paragraph: {
    color: '#ffffff',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 17
  },
});

export default PartyHomeScreen;
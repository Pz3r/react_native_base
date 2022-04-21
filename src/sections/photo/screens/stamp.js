import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View } from 'react-native';
import { Flex, Text, Button } from 'native-base';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18n-js';

import IMG from 'assets/img';
import Lottie from 'assets/lottie';

import { SAFE_AREA_PADDING } from '../../../constants/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';
import LoaderModal from '../../../components/LoaderModal/LoaderModal';
import { NAVIGATION_PHOTO_FORM_SCREEN } from '../../../navigation/constants';

const STORAGE_PHOTO = 'STORAGE_PHOTO';

const TAG = 'PhotoStampScreen';

function PhotoStampScreen({ navigation }) {
  const [photoBase64, setPhotoBase64] = useState();

  useEffect(async () => {
    console.log(`===== ${TAG}:useEffect =====`);
    try {
      const base64 = await AsyncStorage.getItem(STORAGE_PHOTO);
      setPhotoBase64(base64);
    } catch (e) {
      console.log(`===== ${TAG}:useEffect =====`);
      console.log(e);
    }
  }, []);

  const nextStep = useCallback(() => {
    navigation.navigate(NAVIGATION_PHOTO_FORM_SCREEN);
  }, [navigation]);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <Flex flex="1" style={styles.container} alignItems="center">
        <View style={styles.top}>
          <StepHeader title={i18n.t('photo_stamp_title')} total={4} step={3} />
        </View>
        <View style={styles.previewContainer}>
          <Image style={styles.selfie} source={{ uri: `data:image/jpg;base64,${photoBase64}` }} />
          <Image style={styles.overlay} resizeMode="contain" source={IMG.smPaniniPrueba} />
        </View>
        <Flex flex="1" alignItems="center" justifyContent="center">
            <Button onPress={nextStep} backgroundColor="#c1e645" _text={styles.buttonText}>{i18n.t('button_action_next')}</Button>
          </Flex>
      </Flex>
    </ImageBackground>
  )

}

const styles = StyleSheet.create({
  container: {
    paddingTop: SAFE_AREA_PADDING.paddingTop,
  },
  top: {
    alignItems: 'center'
  },
  middle: {
    //backgroundColor: '#0f0',
  },
  selfie: {
    position: 'absolute',
    width: '76%',
    top: 0,
    aspectRatio: 3 / 4,
  },
  previewContainer: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 137 / 160,
    marginTop: 10
  },
  overlay: {
    position: 'absolute',
    width: '100%',
  },
  bottom: {
    position: 'absolute',
    bottom: 0
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#2a5a40',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
});

export default PhotoStampScreen;
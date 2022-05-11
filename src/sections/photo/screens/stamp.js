import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, Image, ImageBackground, View, TouchableOpacity } from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { Flex, Text, Button } from 'native-base';
import LottieView from 'lottie-react-native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18n-js';

import IMG from 'assets/img';
import Lottie from 'assets/lottie';

import { SAFE_AREA_PADDING } from '../../../constants/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';
import LoaderModal from '../../../components/LoaderModal/LoaderModal';
import { NAVIGATION_PHOTO_FORM_SCREEN } from '../../../navigation/constants';

const STORAGE_PHOTO = 'STORAGE_PHOTO';
const STORAGE_SHIRT = 'STORAGE_SHIRT';

const TAG = 'PhotoStampScreen';

const FRAMES = [
  IMG.smPaniniBlanca,
  IMG.smPaniniNegra,
];

function PhotoStampScreen({ navigation }) {
  const [photoBase64, setPhotoBase64] = useState();
  const [selectedShirt, setSelectedShirt] = useState();
  const viewShotRef = useRef();

  useEffect(async () => {
    console.log(`===== ${TAG}:useEffect =====`);
    try {
      const base64 = await AsyncStorage.getItem(STORAGE_PHOTO);
      const shirt = await AsyncStorage.getItem(STORAGE_SHIRT);
      console.log(`===== ${TAG}:useEffect shirt: ${shirt} =====`);
      setPhotoBase64(base64);
      setSelectedShirt(parseInt(shirt));
    } catch (e) {
      console.log(`===== ${TAG}:useEffect =====`);
      console.log(e);
    }
  }, []);

  const nextStep = useCallback(() => {
    navigation.navigate(NAVIGATION_PHOTO_FORM_SCREEN);
  }, [navigation]);

  const onCapture = useCallback(async () => {
    try {
      const uri = await viewShotRef.current.capture();
      console.log(`===== ${TAG}:onCapture uri: =====`);
      console.log(uri);

      const base64 = await FileSystem.readAsStringAsync(`file://${uri}`, {
        encoding: FileSystem.EncodingType.Base64
      });
      console.log(`===== ${TAG}:onCapture base64: =====`);
      //console.log(base64);

      const shareResponse = await Share.open({
        title: 'Vive Mi Selección',
        url: 'data:image/png;base64,' + base64
      });
      console.log(`===== ${TAG}:onCapture shareResponse: =====`);
      console.log(shareResponse);

    } catch (error) {
      console.log(`===== ${TAG}:onCapture error: =====`);
      console.log(error);
    }
  }, []);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <Flex flex="1" style={styles.container} alignItems="center">
        <View style={styles.top}>
          <StepHeader title={i18n.t('photo_stamp_title')} total={4} step={3} />
        </View>
        <ViewShot ref={viewShotRef} style={styles.previewContainer}>
          <Image style={styles.selfie} source={{ uri: `data:image/jpg;base64,${photoBase64}` }} />
          <Image style={styles.overlay} resizeMode="contain" source={FRAMES[selectedShirt]} />
        </ViewShot>
        <TouchableOpacity onPress={onCapture} style={styles.shareButton}>
          <Text style={styles.shareText}>{i18n.t('button_action_share')}</Text>
          <Image source={IMG.botonCompartir} />
        </TouchableOpacity>
      </Flex>
      <LottieView source={Lottie.confettiVertical} autoPlay loop style={{ position: 'absolute', top: 0 }} />
      <Flex flex="1" alignItems="center" justifyContent="flex-end" style={{ paddingBottom: 20 }}>
        <Button onPress={nextStep} backgroundColor="#c1e645" _text={styles.buttonText}>{i18n.t('button_action_next')}</Button>
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
    marginTop: 10,
    marginBottom: 10
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
  shareButton: {
    alignSelf: 'flex-end',
    paddingEnd: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shareText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  }
});

export default PhotoStampScreen;
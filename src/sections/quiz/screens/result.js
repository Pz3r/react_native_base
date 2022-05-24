import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, Image, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
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
import FANS from '../../../data/fans';
import { NAVIGATION_HOME_SCREEN, NAVIGATION_PHOTO_FORM_SCREEN, NAVIGATION_QUIZ_HOME_SCREEN, NAVIGATION_QUIZ_STACK } from '../../../navigation/constants';

const TAG = 'QuizResultScreen';

const FRAMES = [
  IMG.smPaniniBlanca,
  IMG.smPaniniNegra,
];

const STORAGE_QUIZ_RESULT = 'STORAGE_QUIZ_RESULT';

function QuizResultScreen({ navigation }) {
  const [resultFan, setResultFan] = useState({});
  const viewShotRef = useRef();

  useEffect(async () => {
    console.log(`===== ${TAG}:useEffect =====`);
    try {
      const result = await AsyncStorage.getItem(STORAGE_QUIZ_RESULT);
      console.log(`===== ${TAG}:useEffect result: ${result} =====`);
      switch (result) {
        case 'CLAVADO':
          setResultFan(FANS['CLAVADO'])
          break;
        case 'SABELOTODO':
          setResultFan(FANS['SABELOTODO'])
          break;
        case 'NOSTALGICO':
          setResultFan(FANS['NOSTALGICO'])
          break;
        case 'VILLAMELON':
          setResultFan(FANS['VILLAMELON'])
          break;
      }
    } catch (e) {
      console.log(`===== ${TAG}:useEffect error =====`);
      console.log(e);
    }
  }, []);

  const restartQuiz = useCallback(() => {
    navigation.navigate(NAVIGATION_QUIZ_HOME_SCREEN);
  }, [navigation]);

  const finishQuiz = useCallback(() => {
    navigation.navigate(NAVIGATION_HOME_SCREEN);
  }, [navigation]);

  const onCapture = useCallback(async () => {
    try {
      const uri = await viewShotRef.current.capture();
      console.log(`===== ${TAG}:onCapture uri: =====`);
      console.log(uri);

      const base64 = await FileSystem.readAsStringAsync(`file://${uri}`, {
        encoding: FileSystem.EncodingType.Base64
      });
      //console.log(`===== ${TAG}:onCapture base64: =====`);
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
      <ScrollView contentContainerStyle={styles.container}>
        <ViewShot ref={viewShotRef} style={styles.previewContainer}>
          <Image source={IMG.logoBlanco} />
          <Image style={{ alignSelf: 'center' }} source={resultFan.image} />
          <Text style={styles.subTitle}>{i18n.t('quiz_result_title')}</Text>
          <Text style={styles.title}>{i18n.t(resultFan.title)}</Text>
          <Text style={styles.ratingParagraph}>{i18n.t(resultFan.description)}</Text>
        </ViewShot>
        <TouchableOpacity onPress={onCapture} style={styles.shareButton}>
          <Text style={styles.shareText}>{i18n.t('button_action_share')}</Text>
          <Image source={IMG.botonCompartir} />
        </TouchableOpacity>
        <Flex style={{ width: '100%', paddingTop: 20, paddingBottom: 20 }} flex="1" flexDirection="row" alignItems="flex-end">
          <Flex flex="1" style={{ paddingHorizontal: 20 }}>
            <Button onPress={restartQuiz} backgroundColor="#00994c" _text={styles.buttonText}>{i18n.t('button_action_quiz_restart')}</Button>
          </Flex>
          <Flex flex="1" style={{ paddingHorizontal: 20 }}>
            <Button onPress={finishQuiz} backgroundColor="#00994c" _text={styles.buttonText}>{i18n.t('button_action_quiz_finish')}</Button>
          </Flex>
        </Flex>
      </ScrollView>
    </ImageBackground>
  )

}

const styles = StyleSheet.create({
  container: {
    paddingTop: SAFE_AREA_PADDING.paddingTop,
    paddingHorizontal: 15
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
    width: '100%',
    padding: 20,
    backgroundColor: '#00251f',
    borderRadius: 3,
    justifyContent: 'center',
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
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
  shareButton: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shareText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
  subTitle: {
    fontFamily: 'OperaBlackOblique',
    color: '#00994c',
    fontSize: 25,
    paddingVertical: 10
  },
  title: {
    fontFamily: 'OperaBlackOblique',
    color: '#f63440',
    fontSize: 40,
    lineHeight: 37,
  },
  ratingParagraph: {
    color: '#ffffff',
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 18,
    paddingTop: 10,
  },
});

export default QuizResultScreen;
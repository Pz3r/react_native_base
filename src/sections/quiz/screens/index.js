import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Linking, Image, ImageBackground, View } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import Swiper from 'react-native-swiper'
import { Rating, AirbnbRating } from 'react-native-ratings';
import { Flex, Text, Button } from 'native-base';
import LottieView from 'lottie-react-native';
import i18n from 'i18n-js';

import IMG from 'assets/img';
import Lottie from 'assets/lottie';

import { NAVIGATION_HOME_STACK, NAVIGATION_PHOTO_CAMERA_SCREEN, NAVIGATION_QUIZ_QUESTION_SCREEN } from '../../../navigation/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';
import { SAFE_AREA_PADDING } from '../../../constants/constants';

const TAG = 'QuizHomeScreen';

export default function QuizHomeScreen({ navigation }) {

  const cancel = useCallback(() => {
    navigation.goBack();
  }, []);

  const startQuiz = useCallback(() => {
    navigation.navigate(NAVIGATION_QUIZ_QUESTION_SCREEN, { question: 1 });
  }, []);

  const onFinishRating = useCallback(() => {
    console.log(`===== ${TAG}:onFinishRating =====`);
  }, []);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <Flex style={styles.top}>
        <StepHeader backButtonHandler={cancel} />
      </Flex>
      <Flex flex="1" style={styles.container}>
        <Flex flex="1" alignItems="center" justifyContent="flex-start">
          <Image style={{ marginBottom: 30 }} source={IMG.ball} />
          <Text style={styles.subTitle}>{i18n.t('text_quiz_subtitle')}</Text>
          <Text style={styles.title}>{i18n.t('text_quiz_title')}</Text>
          <Text style={styles.paragraph}>{i18n.t('text_quiz_description')}</Text>
          <Text style={styles.ratingParagraph}>{i18n.t('text_quiz_instructions')}</Text>
          <AirbnbRating
            count={10}          
            defaultRating={5}
            size={20}
            showRating={false}
            selectedColor="#e74a7b"
            onFinishRating={onFinishRating} />
        </Flex>
        <Flex>
          <Button backgroundColor="#c1e645" _text={styles.buttonText} onPress={startQuiz}>{i18n.t('button_action_start_quiz')}</Button>
        </Flex>
      </Flex>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#bbb',   
    alignItems: 'center',
    paddingBottom: 20
  },
  title: {
    fontFamily: 'OperaBlackOblique',
    color: '#e74a7b',
    fontSize: 64,
    lineHeight: 73,
    paddingTop: 10,
    paddingHorizontal: 20,
    textAlign: 'center'
  },
  subTitle: {
    fontFamily: 'OperaBlackOblique',
    color: '#8cbe5d',
    fontSize: 30,
    paddingVertical: 10,
    alignSelf: 'center',
  },
  paragraph: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingVertical: 30,
    textAlign: 'center'
  },
  ratingParagraph: {
    color: '#ffffff',
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 18,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 40,
  },
  top: {
    width: '100%',
    paddingTop: SAFE_AREA_PADDING.paddingTop,
    paddingHorizontal: 20
  },
  middle: {
    //backgroundColor: '#0f0',
  },
  bottom: {
    //backgroundColor: '#00f'
  },
  buttonText: {
    color: '#2a5a40',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
  underlinedButton: {
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
    textDecorationLine: 'underline',
    fontSize: 13,
    lineHeight: 19
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  slideInfoContainer: {
    alignItems: 'center',
    paddingBottom: 40,
    width: '60%'
  },
  slideInfoText: {
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center'
  },
  slideInfoTitle: {
    fontFamily: 'OperaBlackOblique',
    color: '#f7ec13',
    fontSize: 40,
    lineHeight: 37,
    paddingBottom: 20
  }
});
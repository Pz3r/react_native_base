import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Linking, Image, ImageBackground, View } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import Swiper from 'react-native-swiper'
import { Rating, AirbnbRating } from 'react-native-ratings';
import { connect } from 'react-redux';
import { Flex, Text, Button } from 'native-base';
import LottieView from 'lottie-react-native';
import i18n from 'i18n-js';

import IMG from 'assets/img';
import Lottie from 'assets/lottie';

import { NAVIGATION_HOME_STACK, NAVIGATION_PHOTO_CAMERA_SCREEN, NAVIGATION_QUIZ_QUESTION_SCREEN } from '../../../navigation/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';
import { SAFE_AREA_PADDING } from '../../../constants/constants';
import { APP_RESET_QUIZ, APP_SET_ANSWER, APP_SET_RATING } from '../../../store/actions/app';

const TAG = 'QuizHomeScreen';

function QuizHomeScreen({ navigation, resetQuiz, setRating }) {

  useEffect(() => {
    resetQuiz();
  }, []);

  const cancel = useCallback(() => {
    navigation.goBack();
  }, []);

  const startQuiz = useCallback(() => {
    navigation.navigate(NAVIGATION_QUIZ_QUESTION_SCREEN, { question: 0 });
  }, []);

  const onFinishRating = useCallback(async (rating) => {
    console.log(`===== ${TAG}:onFinishRating ${rating} =====`);
    await setRating({ rating });
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
            selectedColor="#f63440"
            onFinishRating={onFinishRating} />
        </Flex>
        <Flex>
          <Button backgroundColor="#00994c" _text={styles.buttonText} onPress={startQuiz}>{i18n.t('button_action_start_quiz')}</Button>
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
    color: '#f63440',
    fontSize: 64,
    lineHeight: 73,
    paddingTop: 10,
    paddingHorizontal: 20,
    textAlign: 'center'
  },
  subTitle: {
    fontFamily: 'OperaBlackOblique',
    color: '#f63440',
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
    color: '#ffffff',
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
    color: '#ffffff',
    fontSize: 40,
    lineHeight: 37,
    paddingBottom: 20
  }
});

export default connect(
  (state, ownProps) => ({ ...state.App, ...ownProps }),
  dispatch => ({
    resetQuiz: () => {
      dispatch({
        type: APP_RESET_QUIZ
      })
    },
    setRating: (payload) => {
      dispatch({
        type: APP_SET_RATING,
        payload
      })
    }
  })
)(QuizHomeScreen);
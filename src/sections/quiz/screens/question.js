import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View, ScrollView, TouchableOpacity } from 'react-native';
import { Flex, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import { Storage } from 'aws-amplify';
import ImageEditor from '@react-native-community/image-editor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';
import LottieView from 'lottie-react-native';
import i18n from 'i18n-js';

import IMG from 'assets/img';
import Lottie from 'assets/lottie';

import { NAVIGATION_PHOTO_STAMP_SCREEN, NAVIGATION_QUIZ_QUESTION_SCREEN, NAVIGATION_QUIZ_RESULT_SCREEN } from '../../../navigation/constants';
import { SAFE_AREA_PADDING } from '../../../constants/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';
import LoaderModal from '../../../components/LoaderModal/LoaderModal';
import QUIZ from '../../../data/quiz';
import { APP_SET_ANSWER } from '../../../store/actions/app';
import { ENDPOINT_POST_DATE_URL, ENDPOINT_POST_QUIZ_API_KEY, ENDPOINT_POST_QUIZ_URL } from '../../../utils/endpoints';

const STORAGE_QUIZ_RESULT = 'STORAGE_QUIZ_RESULT';
const STORAGE_UUID = 'STORAGE_UUID';

const TAG = 'QuizQuestionScreen';

function QuizQuestionScreen({ route, navigation, setAnswer, quiz }) {
  const [questionIndex, setQuestionIndex] = useState();
  const [selectedAnwer, setSelectedAnswer] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataSent, setIsDataSent] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    console.log(`===== ${TAG}:useEffect ${JSON.stringify(route.params)} =====`);
    if (route.params) {
      const index = route.params['question'];
      if (index != undefined || index != null) {
        setQuestionIndex(index);
      }
    }
  }, [route]);

  const getQuizResult = (answers) => {
    console.log(`===== ${TAG}:getQuizResult =====`);
    console.log(JSON.stringify(answers));

    let count = {
      'CLAVADO': 0,
      'SABELOTODO': 0,
      'NOSTALGICO': 0,
      'VILLAMELON': 0
    }

    answers.forEach(answer => {
      switch (answer) {
        case 0:
          count['CLAVADO'] += 1;
          break;
        case 1:
          count['SABELOTODO'] += 1;
          break;
        case 2:
          count['NOSTALGICO'] += 1;
          break;
        case 3:
          count['VILLAMELON'] += 1;
          break;
      }
    });

    console.log(`===== ${TAG}:getQuizResult count:${JSON.stringify(count)} =====`);

    let result = 'CLAVADO';
    let tempCount = 0;
    const keys = Object.keys(count);
    for (let i = 0; i < keys.length; i++) {
      if (count[keys[i]] >= tempCount) {
        tempCount = count[keys[i]];
        result = keys[i];
      }
    }
    console.log(`===== ${TAG}:getQuizResult result:${result} =====`);

    return result;
  }

  const nextQuestion = useCallback(async () => {
    await setAnswer({ questionId: `answer${questionIndex}`, answerIndex: selectedAnwer });
    if ((questionIndex + 1) <= 4) {
      navigation.push(NAVIGATION_QUIZ_QUESTION_SCREEN, { question: questionIndex + 1 });
    } else {
      setIsLoading(true);
      console.log(JSON.stringify(quiz));
      //TODO LÓGICA PARA CALCULAR RESULTADO
      const result = getQuizResult([quiz.answer0, quiz.answer1, quiz.answer2, quiz.answer3]);

      // ALMACENAR RESULTADO EN ASYNC STORAGE

      await AsyncStorage.setItem(STORAGE_QUIZ_RESULT, result);
      const storeId = await AsyncStorage.getItem(STORAGE_UUID);

      // TODO ENVIAR RESULTADOS A SERVIDOR
      try { 
        const response = await fetch(
          ENDPOINT_POST_QUIZ_URL,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'x-api-key': ENDPOINT_POST_QUIZ_API_KEY
            },
            body: JSON.stringify({...quiz, storeId})
          }
        );

        console.log(`===== ${TAG}:sendQuiz response status: ${response.status} =====`);
        setIsDataSent(true);

      } catch (error) {
        console.log(`===== ${TAG}:sendQuiz ERROR =====`);
        console.log(error);
        setIsError(true);
      }
      
      /*
      setTimeout(async () => {
        setIsLoading(false);
        setIsError(false);
        setIsDataSent(false);
        navigation.navigate(NAVIGATION_QUIZ_RESULT_SCREEN);
      }, 3000);
      */

    }
  }, [questionIndex, selectedAnwer]);

  const selectAnswer = useCallback((index) => {
    console.log(`===== ${TAG}:selectAnswer ${index} =====`);
    setSelectedAnswer(index);
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <Flex flex="1" style={styles.container} alignItems="center">
        {questionIndex != undefined && questionIndex != null &&
          <>
            <View style={styles.top}>
              <StepHeader backButtonHandler={goBack} total={5} step={questionIndex + 1} />
            </View>
            <View style={styles.previewContainer}>
              <Text style={styles.subTitle}>{i18n.t(QUIZ[questionIndex].title)}</Text>
              <Text style={styles.paragraph}>{i18n.t(QUIZ[questionIndex].description)}</Text>
              <Flex flexDirection="row" justifyContent="space-between" style={{ paddingHorizontal: 10 }}>
                <Flex flex={1} alignItems="center" justifyContent="center" style={[{ backgroundColor: '#0f2d25', paddingTop: 8, marginEnd: 7, borderRadius: 5, borderWidth: 2 }, { borderColor: selectedAnwer === 0 ? '#f63440' : '#00000000' }]}>
                  <TouchableOpacity onPress={() => selectAnswer(0)}>
                    <Image source={QUIZ[questionIndex].options[0].media} />
                    <View style={{ minHeight: 80, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.answerParagraph}>{i18n.t(QUIZ[questionIndex].options[0].text)}</Text>
                    </View>
                  </TouchableOpacity>
                </Flex>
                <Flex flex={1} alignItems="center" justifyContent="center" style={[{ backgroundColor: '#0f2d25', paddingTop: 8, marginEnd: 7, borderRadius: 5, borderWidth: 2 }, { borderColor: selectedAnwer === 1 ? '#f63440' : '#00000000' }]}>
                  <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => selectAnswer(1)}>
                    <Image source={QUIZ[questionIndex].options[1].media} />
                    <View style={{ minHeight: 80, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.answerParagraph}>{i18n.t(QUIZ[questionIndex].options[1].text)}</Text>
                    </View>
                  </TouchableOpacity>
                </Flex>
              </Flex>
              <Flex flexDirection="row" justifyContent="space-between" style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                <Flex flex={1} alignItems="center" justifyContent="center" style={[{ backgroundColor: '#0f2d25', paddingTop: 8, marginEnd: 7, borderRadius: 5, borderWidth: 2 }, { borderColor: selectedAnwer === 2 ? '#f63440' : '#00000000' }]}>
                  <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => selectAnswer(2)}>
                    <Image source={QUIZ[questionIndex].options[2].media} />
                    <View style={{ minHeight: 80, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.answerParagraph}>{i18n.t(QUIZ[questionIndex].options[2].text)}</Text>
                    </View>
                  </TouchableOpacity>
                </Flex>
                <Flex flex={1} alignItems="center" justifyContent="center" style={[{ backgroundColor: '#0f2d25', paddingTop: 8, marginEnd: 7, borderRadius: 5, borderWidth: 2 }, { borderColor: selectedAnwer === 3 ? '#f63440' : '#00000000' }]}>
                  <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => selectAnswer(3)}>
                    <Image source={QUIZ[questionIndex].options[3].media} />
                    <View style={{ minHeight: 80, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.answerParagraph}>{i18n.t(QUIZ[questionIndex].options[3].text)}</Text>
                    </View>
                  </TouchableOpacity>
                </Flex>
              </Flex>
            </View>
          </>
        }
        <View style={styles.bottom}>
          <Button isDisabled={selectedAnwer < 0} onPress={nextQuestion} width="80%" backgroundColor="#00994c" _text={styles.buttonText}>{i18n.t('button_action_quiz_next')}</Button>
        </View>
        <LoaderModal
          isVisible={isLoading}
          isError={isError}
          isComplete={isDataSent}
          loaderText={i18n.t('text_loader_sending')}
          errorText={i18n.t('text_loader_sending_error')}
          closeHandler={(completed) => {
            setIsLoading(false);
            setIsError(false);
            setIsDataSent(false);
            if (completed) {
              navigation.navigate(NAVIGATION_QUIZ_RESULT_SCREEN);
            }
          }}
        />
      </Flex>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: SAFE_AREA_PADDING.paddingTop,
  },
  top: {
    paddingHorizontal: 50
  },
  middle: {
  },
  selfie: {
    width: '70%',
    aspectRatio: 3 / 4,
  },
  shirt: {
    position: 'absolute',
    width: '70%',
    aspectRatio: 3 / 4,
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    position: 'absolute',
    left: 5
  },
  rightButton: {
    position: 'absolute',
    right: 5
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  bottom: {
    width: '50%',
    alignItems: 'center',
    position: 'absolute',
    bottom: SAFE_AREA_PADDING.paddingBottom,
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
    fontSize: 13,
    lineHeight: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingBottom: 10,
    textAlign: 'center',
  },
  answerParagraph: {
    color: '#ffffff',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
});

export default connect(
  (state, ownProps) => ({ ...state.App, ...ownProps }),
  dispatch => ({
    setAnswer: (payload) => {
      dispatch({
        type: APP_SET_ANSWER,
        payload
      })
    }
  })
)(QuizQuestionScreen);
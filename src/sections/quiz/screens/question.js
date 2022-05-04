import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View, TouchableOpacity } from 'react-native';
import { Flex, Text, Button } from 'native-base';
import Modal from 'react-native-modal';
import { Storage } from 'aws-amplify';
import ImageEditor from '@react-native-community/image-editor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';
import LottieView from 'lottie-react-native';
import i18n from 'i18n-js';

import IMG from 'assets/img';
import Lottie from 'assets/lottie';

import { NAVIGATION_PHOTO_STAMP_SCREEN } from '../../../navigation/constants';
import { SAFE_AREA_PADDING } from '../../../constants/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';
import LoaderModal from '../../../components/LoaderModal/LoaderModal';
import QUIZ from '../../../data/quiz';

const STORAGE_UUID = 'STORAGE_UUID';

const TAG = 'QuizQuestionScreen';

function QuizQuestionScreen({ route, navigation }) {
  const [questionIndex, setQuestionIndex] = useState();
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [selectedAnwer, setSelectedAnswer] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isPhotoSent, setIsPhotoSent] = useState(false);
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

  const confirmStamp = useCallback(async () => {

  }, []);

  const selectAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <Flex flex="1" style={styles.container} alignItems="center">
        {questionIndex != undefined && questionIndex != null &&
          <>
            <View style={styles.top}>
              <StepHeader backButtonHandler={goBack} total={5} step={1} />
            </View>
            <View style={styles.previewContainer}>
              <Text style={styles.subTitle}>{i18n.t(QUIZ[questionIndex].title)}</Text>
              <Text style={styles.paragraph}>{i18n.t(QUIZ[questionIndex].description)}</Text>
              <Flex flexDirection="row" justifyContent="space-between" style={{ paddingHorizontal: 10 }}>
                <Flex flex={1} alignItems="center" justifyContent="center" style={[{ backgroundColor: '#0f2d25', paddingTop: 8, marginEnd: 7, borderRadius: 5, borderWidth: 2 }, { borderColor: selectedAnwer === 0 ? '#e74a7b' : '#00000000' }]}>
                  <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => selectAnswer(0)}>
                    <Image source={QUIZ[questionIndex].options[0].media} />
                    <View style={{ minHeight: 80, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.answerParagraph}>{i18n.t(QUIZ[questionIndex].options[0].text)}</Text>
                    </View>
                  </TouchableOpacity>
                </Flex>
                <Flex flex={1} alignItems="center" justifyContent="center" style={[{ backgroundColor: '#0f2d25', paddingTop: 8, marginEnd: 7, borderRadius: 5, borderWidth: 2 }, { borderColor: selectedAnwer === 1 ? '#e74a7b' : '#00000000' }]}>
                  <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => selectAnswer(1)}>
                    <Image source={QUIZ[questionIndex].options[1].media} />
                    <View style={{ minHeight: 80, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.answerParagraph}>{i18n.t(QUIZ[questionIndex].options[1].text)}</Text>
                    </View>
                  </TouchableOpacity>
                </Flex>
              </Flex>
              <Flex flexDirection="row" justifyContent="space-between" style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                <Flex flex={1} alignItems="center" justifyContent="center" style={[{ backgroundColor: '#0f2d25', paddingTop: 8, marginEnd: 7, borderRadius: 5, borderWidth: 2 }, { borderColor: selectedAnwer === 2 ? '#e74a7b' : '#00000000' }]}>
                  <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => selectAnswer(2)}>
                    <Image source={QUIZ[questionIndex].options[2].media} />
                    <View style={{ minHeight: 80, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.answerParagraph}>{i18n.t(QUIZ[questionIndex].options[2].text)}</Text>
                    </View>
                  </TouchableOpacity>
                </Flex>
                <Flex flex={1} alignItems="center" justifyContent="center" style={[{ backgroundColor: '#0f2d25', paddingTop: 8, marginEnd: 7, borderRadius: 5, borderWidth: 2 }, { borderColor: selectedAnwer === 3 ? '#e74a7b' : '#00000000' }]}>
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
          <Button onPress={confirmStamp} width="80%" backgroundColor="#c1e645" _text={styles.buttonText}>{i18n.t('button_action_ready')}</Button>
        </View>
        <LoaderModal
          isVisible={isLoading}
          isError={isError}
          isComplete={isPhotoSent}
          loaderText={i18n.t('text_loader_sending')}
          errorText={i18n.t('text_loader_sending_error')}
          closeHandler={(completed) => {
            setIsLoading(false);
            setIsError(false);
            setIsPhotoSent(false);
            if (completed) {
              navigation.navigate(NAVIGATION_PHOTO_STAMP_SCREEN);
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
    paddingBottom: 15,
    bottom: SAFE_AREA_PADDING.paddingBottom,
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

export default QuizQuestionScreen;
import React, { useCallback } from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { Flex, Text, Button } from 'native-base';
import i18n from 'i18n-js';

import IMG from 'assets/img';

import { SAFE_AREA_PADDING } from '../../../constants/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';
import VisitForm from '../../../components/VisitForm/VisitForm';
import { NAVIGATION_HOME_STACK } from '../../../navigation/constants';

const TAG = 'PhotoStampScreen';

function PhotoStampScreen({ navigation }) {

  const finishHandler = () => {
    console.log(`===== ${TAG}:finishHandler =====`)
    navigation.navigate(NAVIGATION_HOME_STACK);
  };

  const cancel = useCallback(() => {
    navigation.navigate(NAVIGATION_HOME_STACK);
  }, [navigation]);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <Flex flex="1" style={styles.container}>
        <View style={styles.top}>
          <StepHeader title={i18n.t('photo_form_title')} total={4} step={4} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>{i18n.t('photo_form_subtitle')}</Text>
          <VisitForm finishHandler={finishHandler}/>
        </View>

        <Flex flex="1" alignItems="center" justifyContent="flex-end" style={styles.buttonContainer}>          
          <Button _text={styles.underlinedButton} variant="unstyled" onPress={cancel}>{i18n.t('text_photo_form_skip')}</Button>
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
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
  title: {
    fontFamily: 'OperaBlackOblique',
    color: '#f63440',
    fontSize: 35,
    lineHeight: 37,
    paddingTop: 10
  },
  formContainer: {
    paddingHorizontal: 15,
    paddingVertical: 25
  },
  form: {
    paddingTop: 20
  },
  formInput: {
    paddingVertical: 20
  },
  buttonContainer: {
    paddingVertical: 40
  },
  underlinedButton: {
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
    textDecorationLine: 'underline',
    fontSize: 13,
    lineHeight: 19
  },
});

export default PhotoStampScreen;
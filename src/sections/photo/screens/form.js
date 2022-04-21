import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View } from 'react-native';
import { Flex, Text, Button } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import i18n from 'i18n-js';

import IMG from 'assets/img';

import { SAFE_AREA_PADDING } from '../../../constants/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';
import LoaderModal from '../../../components/LoaderModal/LoaderModal';
import { NAVIGATION_HOME_STACK } from '../../../navigation/constants';

const STORAGE_PHOTO = 'STORAGE_PHOTO';

const TAG = 'PhotoStampScreen';

function PhotoStampScreen({ navigation }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataSent, setIsDataSent] = useState(false);
  const [isError, setIsError] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    console.warn("A date has been picked: ", date);
    setDate(getDateString(date));
    hideDatePicker();
  };

  const handleConfirmTime = (date) => {
    console.warn("A time has been picked: ", date);
    setTime(`${date.getHours()}:${date.getMinutes()}`);
    hideTimePicker();
  };

  const getDateString = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();

    return dd + '/' + mm + '/' + yyyy;
  }

  const cancel = useCallback(() => {
    navigation.navigate(NAVIGATION_HOME_STACK);
  }, [navigation]);

  const sendDateTime = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsDataSent(true);
    }, 3000);
  }, [date, time]);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <Flex flex="1" style={styles.container}>
        <View style={styles.top}>
          <StepHeader title={i18n.t('photo_form_title')} total={4} step={4} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>{i18n.t('photo_form_subtitle')}</Text>
          <View style={styles.form}>
            <View style={styles.formInput}>
              <Button backgroundColor="#0f2d25" onPress={showDatePicker}>{date || i18n.t('button_action_date')}</Button>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
              />
            </View>
            <View style={styles.form}>
              <Button backgroundColor="#0f2d25" onPress={showTimePicker}>{time || i18n.t('button_action_time')}</Button>
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideTimePicker}
              />
            </View>
          </View>
        </View>

        <Flex flex="1" alignItems="center" justifyContent="space-between" style={styles.buttonContainer}>
          <Button onPress={sendDateTime} isDisabled={!date || !time} backgroundColor="#c1e645" _text={styles.buttonText}>{i18n.t('button_action_finish')}</Button>
          <Button _text={styles.underlinedButton} variant="unstyled" onPress={cancel}>{i18n.t('text_photo_form_skip')}</Button>
        </Flex>

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
              navigation.navigate(NAVIGATION_HOME_STACK);
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
  title: {
    fontFamily: 'OperaBlackOblique',
    color: '#e74a7b',
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
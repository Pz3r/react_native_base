import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import i18n from 'i18n-js';

const TAG = 'VisitForm';

import LoaderModal from '../LoaderModal/LoaderModal';

export default function VisitForm({ finishHandler }) {
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataSent, setIsDataSent] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

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

  const handleConfirmDate = (pickedDate) => {
    console.warn("A date has been picked: ", pickedDate);
    setDate(getDateString(pickedDate));
    hideDatePicker();
  };

  const handleConfirmTime = (pickedTime) => {
    console.warn("A time has been picked: ", pickedTime);
    setTime(`${pickedTime.getHours()}:${pickedTime.getMinutes()}`);
    hideTimePicker();
  };

  const getDateString = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();

    return dd + '/' + mm + '/' + yyyy;
  }

  const sendDateTime = useCallback(() => {
    console.log(`===== ${TAG}:sendDateTime ${date} // ${time} =====`);
    setIsLoading(true);
    setTimeout(() => {
      setIsDataSent(true);
    }, 3000);
  }, [date, time]);

  return (
    <>
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
        <View style={styles.formInputBottom}>
          <Button backgroundColor="#0f2d25" onPress={showTimePicker}>{time || i18n.t('button_action_time')}</Button>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={hideTimePicker}
          />
        </View>
        <Button onPress={sendDateTime} isDisabled={!date || !time} backgroundColor="#c1e645" _text={styles.buttonText}>{i18n.t('button_action_finish')}</Button>
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
            finishHandler();
          } 
        }}
      />
    </>
  )

}

const styles = StyleSheet.create({
  form: {
    paddingTop: 20,
    width: '80%',
    alignSelf: 'center'
  },
  formInput: {
    paddingVertical: 20
  },
  formInputBottom: {
    paddingBottom: 40
  },
  buttonText: {
    color: '#2a5a40',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
});
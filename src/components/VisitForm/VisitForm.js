import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import i18n from 'i18n-js';

const TAG = 'VisitForm';

const STORAGE_DATE = 'STORAGE_DATE';
const STORAGE_TIME = 'STORAGE_TIME';
const STORAGE_UUID = 'STORAGE_UUID';

import LoaderModal from '../LoaderModal/LoaderModal';
import { ENDPOINT_POST_DATE_URL } from '../../utils/endpoints';
import getDateTimeToString from '../../context/Beacons/helpers/getDateTimeToString';

export default function VisitForm({ finishHandler, shouldPreload, buttonText }) {
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataSent, setIsDataSent] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  useEffect(async () => {
    console.log(`===== ${TAG}:useEffect =====`);
    if (shouldPreload || true) {
      try {
        const storedDate = await AsyncStorage.getItem(STORAGE_DATE);
        const storedTime = await AsyncStorage.getItem(STORAGE_TIME);
        console.log(`===== ${TAG}:useEffect date: ${storedDate} time: ${storedTime} =====`);
        setDate(storedDate);
        setTime(storedTime);
      } catch (e) {
        console.log(`===== ${TAG}:useEffect =====`);
        console.log(e);
      }
    }
  }, []);

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

  const sendDateTime = useCallback(async () => {
    console.log(`===== ${TAG}:sendDateTime ${date} // ${time} =====`);
    setIsLoading(true);

    try {
      await AsyncStorage.setItem(STORAGE_DATE, date);
      await AsyncStorage.setItem(STORAGE_TIME, time);
      const storeId = await AsyncStorage.getItem(STORAGE_UUID);

      if (date && time) {
        const postDate = date.split('/').reverse().join('');
        const postTime = time.split(':').join('');
        const schedule = `${postDate}${postTime}`;
        console.log(`===== ${TAG}:sendDate schedule: ${schedule} storeId: ${storeId} =====`);

        const response = await fetch(
          ENDPOINT_POST_DATE_URL,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              storeId: storeId,
              schedule: schedule
            })
          }
        );

        await AsyncStorage.setItem('SYNC_FORMATTED_DATE', postDate);
        console.log(`===== ${TAG}:sendDate response status: ${response.status} =====`);
        setIsDataSent(true);

      } else {
        setIsError(true);
      }

      /*
      setTimeout(async () => {
        await AsyncStorage.setItem(STORAGE_DATE, date);
        await AsyncStorage.setItem(STORAGE_TIME, time);
        setIsDataSent(true);
      }, 3000);
  */
    } catch (error) {
      console.log(`===== ${TAG}:sendDateTime ERROR =====`);
      console.log(error);
      setIsError(true);
    }

  }, [date, time]);

  return (
    <>
      <View style={styles.form}>
        <View style={styles.formInput}>
          <Button backgroundColor="#231f20" onPress={showDatePicker}>{date || i18n.t('button_action_date')}</Button>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
          />
        </View>
        <View style={styles.formInputBottom}>
          <Button backgroundColor="#231f20" onPress={showTimePicker}>{time || i18n.t('button_action_time')}</Button>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={hideTimePicker}
          />
        </View>
        <Button onPress={sendDateTime} isDisabled={!date || !time} backgroundColor="#c1e645" _text={styles.buttonText}>{buttonText || i18n.t('button_action_finish')}</Button>
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
    paddingTop: 10,
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
    fontWeight: 'bold',
    fontSize: 13,
    lineHeight: 19,
  },
});
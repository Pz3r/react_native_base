import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Flex } from 'native-base';
import { connect } from 'react-redux';
import i18n from 'i18n-js';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainStackNavigator from '../navigation/stack';
import MainDrawerNavigator from '../navigation/drawer';
import AuthenticationStackNavigator from '../sections/authentication/navigation/stack';
import PartyStackNavigator from '../sections/party/navigation/stack';
import { QuietConsumer, QuietProvider } from '../context/Audioguide';
import { APP_SET_STAMP } from '../store/actions/app';
import Lottie from 'assets/lottie';
import { BeaconsProvider } from '../context/Beacons'

const STORAGE_PHOTO = 'STORAGE_PHOTO';
const STORAGE_SHIRT = 'STORAGE_SHIRT';

const TAG = 'MainComponent';

function MainComponent({
  authenticated,
  setStamp,
  navigation
}) {
  const [isPartyModalVisible, setIsPartyModalVisible] = useState(true);
  const [isPartyMode, setIsPartyMode] = useState(false);

  useEffect(async () => {
    try {
      const base64 = await AsyncStorage.getItem(STORAGE_PHOTO);
      const shirtIndex = await AsyncStorage.getItem(STORAGE_SHIRT);
      console.log(`===== ${TAG}:useEffect setStamp ${base64 ? base64.length : 0} ${shirtIndex} =====`);
      await setStamp({ base64, shirtIndex });
    } catch (e) {
      console.log(`===== ${TAG}:useEffect =====`);
      console.log(e);
    }
  }, []);

  return (
    <BeaconsProvider>
      <QuietProvider>
        <QuietConsumer>
          {context => {
            console.log(`===== ${TAG}:GUIDE INDEX ${context.lastMessage} / ${context.count}`);

            if (((context.count >= 990 && context.count <= 1420) || (context.count >= 1943 && context.count <= 2023)) && isPartyMode) return (<PartyStackNavigator />)

            return (
              <>
                <Modal isVisible={(context.count >= 990 && context.count <= 1420) || (context.count >= 1943 && context.count <= 2023)} style={styles.container}>
                  <View style={styles.innerError}>
                    <LottieView source={Lottie.confettiCenter} autoPlay loop />
                    <Button onPress={() => setIsPartyMode(true)} width="40%" backgroundColor="#00994c" _text={styles.buttonText}>{i18n.t('button_action_party')}</Button>
                  </View>
                </Modal>
                <MainDrawerNavigator />
              </>
            )
          }}
        </QuietConsumer>
      </QuietProvider>
    </BeaconsProvider>
  )

}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
  },
  inner: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 10,
    justifyContent: 'flex-end'
  },
  innerError: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    paddingBottom: 20,
    width: '100%',
    alignItems: 'center'
  },
  textContainer2: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    paddingTop: 40
  },
  infoText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
});

export default connect(
  (state, ownProps) => ({ ...state.User, ...state.App, ...ownProps }),
  dispatch => ({
    setStamp: (payload) => {
      dispatch({
        type: APP_SET_STAMP,
        payload
      })
    }
  })
)(MainComponent);
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainStackNavigator from '../navigation/stack';
import MainDrawerNavigator from '../navigation/drawer';
import AuthenticationStackNavigator from '../sections/authentication/navigation/stack';
import { QuietConsumer, QuietProvider } from '../context/Audioguide';
import { APP_SET_STAMP } from '../store/actions/app';

const STORAGE_PHOTO = 'STORAGE_PHOTO';
const STORAGE_SHIRT = 'STORAGE_SHIRT';

const TAG = 'MainComponent';

function MainComponent({
  authenticated,
  setStamp
}) {

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

  if (!authenticated && false) {
    return (
      <AuthenticationStackNavigator />
    )
  } else {
    return (
      <QuietProvider>
        <QuietConsumer>
          {context => {
            console.log(`===== GUIDE INDEX ${context.lastMessage} / ${context.count}`);
            return (
              <MainDrawerNavigator />
            )
          }}
        </QuietConsumer>
      </QuietProvider>
    )
  }

}

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
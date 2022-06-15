import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Platform, Text } from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import i18n from 'i18n-js';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import MainDrawerNavigator from '../navigation/drawer';
import PartyStackNavigator from '../sections/party/navigation/stack';
import { QuietConsumer, QuietProvider } from '../context/Audioguide';
import { APP_SET_QUIZ_MODE, APP_SET_SHOW_QUIZ, APP_SET_STAMP } from '../store/actions/app';
import Lottie from 'assets/lottie';
import { BeaconsProvider } from '../context/Beacons'
import { NOTIFICATION_ACTION_END, NOTIFICATION_ACTION_PARTY } from '../constants/constants';
import QuizStackNavigator from '../sections/quiz/navigation/stack';

const STORAGE_PHOTO = 'STORAGE_PHOTO';
const STORAGE_SHIRT = 'STORAGE_SHIRT';
const STORAGE_SHOW_QUIZ = 'STORAGE_SHOW_QUIZ';

const TAG = 'MainComponent';

function MainComponent({
  setStamp,
  setQuizMode,
  quizMode,
  setShowQuiz,
}) {
  const [isPartyMode, setIsPartyMode] = useState(false);
  const [isEndMode, setIsEndMode] = useState(false);
  const [isEndModalVisible, setIsEndModalVisible] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(async () => {
    try {
      // LOAD STAMP
      const base64 = await AsyncStorage.getItem(STORAGE_PHOTO);
      const shirtIndex = await AsyncStorage.getItem(STORAGE_SHIRT);
      const showQuizMode = await AsyncStorage.getItem(STORAGE_SHOW_QUIZ);

      console.log(`===== ${TAG}:useEffect setStamp ${base64 ? base64.length : 0} ${shirtIndex} =====`);
      await setStamp({ base64, shirtIndex });
      await setShowQuiz({ mode: showQuizMode });

      // NOTIFICATION LOGIC
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log('===== App:useEffect:addNotificationReceivedListener =====');
        setNotification(notification);
      });

      // WHEN USER OPENS NOTIFICATION
      responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
        console.log('===== App:useEffect:addNotificationResponseReceivedListener =====');
        const action = response.notification.request.content.data.action;
        console.log(action);

        if (action === NOTIFICATION_ACTION_PARTY) {
          setIsPartyMode(true);
        } else if (action === NOTIFICATION_ACTION_END) {
          await AsyncStorage.setItem(STORAGE_SHOW_QUIZ, 'show');
          setShowQuiz({ mode: 'show' });
          setIsEndModalVisible(true);
        }

        /*
        {"actionIdentifier": "expo.modules.notifications.actions.DEFAULT", "notification": {"date": 1655149500.210283, "request": {"content": [Object], "identifier": "613a5e97-c9cc-48a9-b246-88fcc4584cee", "trigger": [Object]}}}
        {"summaryArgumentCount":0,"targetContentIdentifier":null,"threadIdentifier":"","attachments":[],"categoryIdentifier":"","summaryArgument":"","data":{"data":"goes here"},"title":"You've got mail! 📬","subtitle":null,"badge":null,"launchImageName":"","sound":null,"body":"Here is the notification body"}
        */
      });
    } catch (e) {
      console.log(`===== ${TAG}:useEffect =====`);
      console.log(e);
    }

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('===== App:registerForPushNotificationsAsync token granted: =====');
    console.log(token);

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  const answerQuiz = useCallback(() => {
    setIsEndModalVisible(false);
    setIsEndMode(true);
    setQuizMode({ active: true });
  });

  return (
    <BeaconsProvider>
      <QuietProvider>
        <QuietConsumer>
          {context => {
            console.log(`===== ${TAG}:GUIDE INDEX ${context.lastMessage} / ${context.count}`);

            if (((context.count >= 990 && context.count <= 1420) || (context.count >= 1943 && context.count <= 2023)) && isPartyMode) return (<PartyStackNavigator />)
            if (isEndMode && quizMode) return (<QuizStackNavigator />)

            return (
              <>
                <Modal isVisible={(context.count >= 990 && context.count <= 1420) || (context.count >= 1943 && context.count <= 2023)} style={styles.container}>
                  <View style={styles.innerError}>
                    <LottieView source={Lottie.confettiCenter} autoPlay loop />
                    <Button onPress={() => setIsPartyMode(true)} width="40%" backgroundColor="#00994c" _text={styles.buttonText}>{i18n.t('button_action_party')}</Button>
                  </View>
                </Modal>
                <Modal isVisible={isEndModalVisible} style={styles.container}>
                  <View style={styles.innerError}>
                    <Text style={[styles.title, { alignSelf: 'center', textAlign: 'center' }]}>{i18n.t('text_quiz_title')}</Text>
                    <Text style={[styles.paragraph, { color: '#0f2d25' }]}>{i18n.t('text_quiz_description')}</Text>
                    <Button onPress={answerQuiz} width="40%" backgroundColor="#00994c" _text={styles.buttonText}>{i18n.t('button_action_start_quiz')}</Button>
                    <Button _text={styles.underlinedButton} variant="unstyled" onPress={() => setIsEndModalVisible(false)}>Continuar sin contestar quiz</Button>
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
  title: {
    fontFamily: 'OperaBlackOblique',
    color: '#f63440',
    fontSize: 35,
    lineHeight: 37,
    alignSelf: 'flex-start',
    paddingTop: 10,
    paddingBottom: 20,
  },
  paragraph: {
    color: '#ffffff',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 19,
    paddingBottom: 20
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  underlinedButton: {
    color: '#00994c',
    fontFamily: 'Inter-Medium',
    textDecorationLine: 'underline',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 20,
  },
});

export default connect(
  (state, ownProps) => ({ ...state.User, ...state.App, ...ownProps }),
  dispatch => ({
    setQuizMode: (payload) => {
      dispatch({
        type: APP_SET_QUIZ_MODE,
        payload
      })
    },
    setStamp: (payload) => {
      dispatch({
        type: APP_SET_STAMP,
        payload
      })
    },
    setShowQuiz: (payload) => {
      dispatch({
        type: APP_SET_SHOW_QUIZ,
        payload
      })
    },
  })
)(MainComponent);
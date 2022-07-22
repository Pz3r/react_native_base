import React, { useState } from 'react';
import { StyleSheet, View, Platform, ActivityIndicator, Linking, ImageBackground, Pressable } from 'react-native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Modal from 'react-native-modal';
import { Button, Text } from 'native-base';
import i18n from 'i18n-js';
import IMG from 'assets/img';

import { QuietConsummer } from '../../../context/QuietContext';
import { SAFE_AREA_PADDING } from '../../../constants/dimensions';
import Showcase from '../components/Showcase';

const TAG = 'GuideHomeScreen';

function GuideHomeScreen() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const checkForPermission = async () => {
    console.log('===== GUIDE INDEX checkForPermission');
    let permissionToCheck = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
    const permissionResponse = await check(permissionToCheck);
    console.log(JSON.stringify(permissionResponse));

    if (permissionResponse !== RESULTS.GRANTED) {
      console.log('===== GUIDE INDEX IOS NOT GRANTED');
      setShowModal(true);
    } else {
      setPermissionGranted(true);
    }
  }

  return (
    <QuietConsummer>
      {context => {
        if (context.count !== null || context.lastMessage !== null) {
          return (
            <ImageBackground
              source={IMG.appBackground} 
              style={{ flex: 1 }}>
              <View style={styles.animatedContainer}>
                <Showcase timestamp={context.count} isLoop={typeof context.lastMessage === 'string'} message={context.lastMessage} />
              </View>
            </ImageBackground>
          )
        } else if (permissionGranted) {
          if (!context.audioReady) {
            context.initQuiet();
          }
          return (
            <ImageBackground
              source={IMG.appBackground} 
              style={styles.container}>
              <ActivityIndicator style={styles.spinner} size="large" color="#D8A526" />
              <Text style={styles.loadingText}>{i18n.t('guide_sync_loading')}</Text>
            </ImageBackground>
          )
        } else {
          return (
            <ImageBackground
              source={IMG.appBackground} 
              style={styles.container}>
              <Text style={styles.title}>{i18n.t('guide_sync_title')}</Text>
              <Button
                style={styles.button}
                onPress={checkForPermission}>
                <Text style={styles.buttonText}>{i18n.t('guide_request_permissions')}</Text>
              </Button>
              {showModal &&
                <Modal
                  animationIn="fadeInUp"
                  onBackdropPress={() => setShowModal(!showModal)}
                  isVisible={showModal}>
                  <View style={styles.scrollableModal}>
                    <View>
                      <Text style={styles.permissionText}>{i18n.t('guide_settings_permissions')}</Text>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                      <Pressable
                        style={{ padding: 10 }}
                        onPress={() => {
                          setShowModal(false);
                          Linking.openSettings();
                        }}>
                        <Text style={styles.permissionAction}>{i18n.t('guide_settings_open')}</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              }
            </ImageBackground>
          )
        }
      }}
    </QuietConsummer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 35
  },
  animatedContainer: {
    flex: 1,
    paddingTop: SAFE_AREA_PADDING.paddingTop
  },
  scrollableModal: {
    backgroundColor: '#f0e9d9',
    borderRadius: 5,
    padding: 20
  },
  button: {
    width: '50%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#D8A526',
    marginTop: 30
  },
  spinner: {
    alignSelf: 'center',
  },
  title: {
    fontFamily: 'Arvo_700Bold',
    color: '#D8A526',
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center'
  },
  buttonText: {
    fontFamily: 'Arvo_700Bold',
    color: '#000000',
    fontSize: 14,
    lineHeight: 17,
  },
  loadingText: {
    fontFamily: 'Arvo_700Bold',
    color: '#D8A526',
    fontSize: 25,
    lineHeight: 31,
    marginTop: 30
  },
  permissionText: {
    fontFamily: 'Arvo_400Regular',
  },
  permissionAction: {
    fontFamily: 'Arvo_700Bold',
    color: '#D8A526',
    textDecorationLine: 'underline'
  }
});

export default GuideHomeScreen;
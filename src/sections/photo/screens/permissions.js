import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Linking, ImageBackground, View } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import Swiper from 'react-native-swiper'
import { Flex, Text, Button } from 'native-base';
import LottieView from 'lottie-react-native';
import i18n from 'i18n-js';

import IMG from 'assets/img';
import Lottie from 'assets/lottie';

import { NAVIGATION_HOME_STACK, NAVIGATION_PHOTO_CAMERA_SCREEN } from '../../../navigation/constants';

export default function PhotoPermissionsScreen({ navigation }) {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState('not-determined');

  const requestCameraPermission = useCallback(async () => {
    console.log(`===== Photo:PermissionsScreen:requestCameraPermission =====`);
    const permissionStatus = await Camera.requestCameraPermission();
    console.log(`permissionStatus: ${permissionStatus}`);
    if (permissionStatus === 'denied') await Linking.openSettings();
    setCameraPermissionStatus(permissionStatus);
  }, []);

  const cancel = useCallback(() => {
    navigation.goBack();
  }, []);

  useEffect(() => {
    console.log(`===== Photo:PermissionsScreen:useEffect ${cameraPermissionStatus} =====`);
    if (cameraPermissionStatus === 'authorized') navigation.replace(NAVIGATION_PHOTO_CAMERA_SCREEN);
  }, [cameraPermissionStatus, navigation]);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <Flex flex="1" style={styles.container}>
        <Flex flex="1" alignItems="center" justifyContent="flex-end" style={styles.top}>
          <Text style={styles.title}>{i18n.t('photo_permissions_title')}</Text>
        </Flex>
        <Flex flex="3" alignItems="flex-start" justifyContent="flex-start" style={styles.middle}>
          <Swiper style={{ bottom: '15%' }} showsPagination={false} showsButtons={true}>
            <View style={styles.slide}>
              <LottieView source={Lottie.limpia} autoPlay loop />
              <View style={styles.slideInfoContainer}>
                <Text style={styles.slideInfoTitle}>1</Text>
                <Text style={styles.slideInfoText}>{i18n.t('text_photo_onoarding_1')}</Text>
              </View>
            </View>
            <View style={styles.slide}>
              <LottieView source={Lottie.eleva} autoPlay loop />
              <View style={styles.slideInfoContainer}>
                <Text style={styles.slideInfoTitle}>2</Text>
                <Text style={styles.slideInfoText}>{i18n.t('text_photo_onoarding_2')}</Text>
              </View>
            </View>
            <View style={styles.slide}>
              <LottieView source={Lottie.cara} autoPlay loop />
              <View style={styles.slideInfoContainer}>
                <Text style={styles.slideInfoTitle}>3</Text>
                <Text style={styles.slideInfoText}>{i18n.t('text_photo_onoarding_3')}</Text>
              </View>
            </View>
          </Swiper>
        </Flex>
        <Flex flex="1" alignItems="center" justifyContent="center" style={styles.bottom}>
          <Flex flex="1" alignItems="center" justifyContent="center">
            <Button backgroundColor="#00994c" _text={styles.buttonText} onPress={requestCameraPermission}>Tomar foto</Button>
          </Flex>
          <Flex flex="1" alignItems="center" justifyContent="center">
            <Button _text={styles.underlinedButton} variant="unstyled" onPress={cancel}>No quiero tomar la foto</Button>
          </Flex>
        </Flex>
      </Flex>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#bbb',
  },
  top: {
    //backgroundColor: '#f00',
    paddingHorizontal: 50
  },
  middle: {
    //backgroundColor: '#0f0',
  },
  bottom: {
    //backgroundColor: '#00f'
  },
  title: { 
    fontFamily: 'OperaBlackOblique', 
    color: '#f63440',
    fontSize: 35,
    lineHeight: 37
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
  underlinedButton: {
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
    textDecorationLine: 'underline',
    fontSize: 13,
    lineHeight: 19
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //backgroundColor: '#f00'
  },
  slideInfoContainer: {
    alignItems: 'center',
    paddingBottom: 0,
    width: '60%'
  },
  slideInfoText: {
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center'
  },
  slideInfoTitle: {
    fontFamily: 'OperaBlackOblique',
    color: '#ffffff',
    fontSize: 40,
    lineHeight: 37,
    paddingBottom: 20
  }
});
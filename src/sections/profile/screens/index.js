import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, Image, ImageBackground, View, TouchableOpacity } from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { Flex, Text, Button, ScrollView } from 'native-base';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18n-js';

import IMG from 'assets/img';

import { SAFE_AREA_PADDING } from '../../../constants/constants';
import LoaderModal from '../../../components/LoaderModal/LoaderModal';
import { NAVIGATION_PHOTO_FORM_SCREEN, NAVIGATION_PHOTO_STACK, NAVIGATION_PHOTO_PERMISSIONS_SCREEN } from '../../../navigation/constants';
import AppHeader from '../../../components/AppHeader/AppHeader';

const STORAGE_PHOTO = 'STORAGE_PHOTO';
const STORAGE_SHIRT = 'STORAGE_SHIRT';

const TAG = 'ProfileHomeScreen';

const FRAMES = [
  IMG.smPaniniBlanca,
  IMG.smPaniniNegra,
];

function ProfileHomeScreen({ navigation }) {
  const [photoBase64, setPhotoBase64] = useState();
  const [selectedShirt, setSelectedShirt] = useState();
  const viewShotRef = useRef();

  useEffect(async () => {
    console.log(`===== ${TAG}:useEffect =====`);
    try {
      const base64 = await AsyncStorage.getItem(STORAGE_PHOTO);
      const shirt = await AsyncStorage.getItem(STORAGE_SHIRT);
      console.log(`===== ${TAG}:useEffect shirt: ${shirt} =====`);
      setPhotoBase64(base64);
      setSelectedShirt(parseInt(shirt));
    } catch (e) {
      console.log(`===== ${TAG}:useEffect =====`);
      console.log(e);
    }
  }, []);

  const nextStep = useCallback(() => {
    navigation.navigate(NAVIGATION_PHOTO_FORM_SCREEN);
  }, [navigation]);

  const onCapture = useCallback(async () => {
    try {
      const uri = await viewShotRef.current.capture();
      console.log(`===== ${TAG}:onCapture uri: =====`);
      console.log(uri);

      const base64 = await FileSystem.readAsStringAsync(`file://${uri}`, {
        encoding: FileSystem.EncodingType.Base64
      });
      console.log(`===== ${TAG}:onCapture base64: =====`);
      //console.log(base64);

      const shareResponse = await Share.open({
        title: 'Vive Mi Selección',
        url: 'data:image/png;base64,' + base64
      });
      console.log(`===== ${TAG}:onCapture shareResponse: =====`);
      console.log(shareResponse);

    } catch (error) {
      console.log(`===== ${TAG}:onCapture error: =====`);
      console.log(error);
    }
  }, []);

  const onEdit = useCallback(() => {
    navigation.navigate(NAVIGATION_PHOTO_STACK, { screen: NAVIGATION_PHOTO_PERMISSIONS_SCREEN });
  }, []);

  const onDoQuiz = useCallback(() => {
    console.log(`===== ${TAG}:onDoQuiz =====`);
  }, []);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader />
        <Text style={styles.title}>{i18n.t('text_profile_title')}</Text>
        <ViewShot ref={viewShotRef} style={styles.previewContainer}>
          <Image style={styles.selfie} source={{ uri: `data:image/jpg;base64,${photoBase64}` }} />
          <Image style={styles.overlay} resizeMode="contain" source={FRAMES[selectedShirt]} />
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Image source={IMG.botonEditar} />
          </TouchableOpacity>
        </ViewShot>
        <View style={styles.subContainer}>
          <Text style={styles.subTitle}>{i18n.t('text_profile_quiz_title')}</Text>
          <Text style={styles.quizDescription}>{i18n.t('text_profile_quiz_description')}</Text>
          <Button style={styles.button} backgroundColor="#c1e645" _text={styles.buttonText} onPress={onDoQuiz}>{i18n.t('button_action_do_quiz')}</Button>
        </View>
      </ScrollView>
    </ImageBackground>
  )

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
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
  subContainer: {
    width: '76%'
  },
  previewContainer: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 137 / 160,
    marginTop: 10,
    marginBottom: 20,
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
  button: {
    width: '70%',
    alignSelf: 'center',
    marginVertical: 20
  },
  buttonText: {
    color: '#2a5a40',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
  editButton: {
    position: 'absolute',
    top: -15,
    right: -15
  },
  shareButton: {
    position: 'absolute',
    bottom: -10,
    right: -10
  },
  shareText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
  title: {
    fontFamily: 'OperaBlackOblique',
    color: '#e74a7b',
    fontSize: 35,
    lineHeight: 37,
    paddingTop: 10,
    alignSelf: 'flex-start',
    paddingStart: 20
  },
  subTitle: {
    fontFamily: 'OperaBlackOblique',
    color: '#8cbe5d',
    fontSize: 30,
    paddingVertical: 10,
    alignSelf: 'center',
  },
  quizDescription: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center'
  }
});

export default ProfileHomeScreen;
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, Image, ImageBackground, View, TouchableOpacity } from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { Text, Button, ScrollView } from 'native-base';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18n-js';

import IMG from 'assets/img';

import { SAFE_AREA_PADDING } from '../../../constants/constants';
import LoaderModal from '../../../components/LoaderModal/LoaderModal';
import { NAVIGATION_PHOTO_FORM_SCREEN, NAVIGATION_PHOTO_STACK, NAVIGATION_PHOTO_PERMISSIONS_SCREEN, NAVIGATION_QUIZ_STACK, NAVIGATION_QUIZ_HOME_SCREEN } from '../../../navigation/constants';
import AppHeader from '../../../components/AppHeader/AppHeader';
import VisitForm from '../../../components/VisitForm/VisitForm';

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

  const onEdit = useCallback(() => {
    navigation.navigate(NAVIGATION_PHOTO_STACK, { screen: NAVIGATION_PHOTO_PERMISSIONS_SCREEN });
  }, []);

  const onDoQuiz = useCallback(() => {
    console.log(`===== ${TAG}:onDoQuiz =====`);
    navigation.navigate(NAVIGATION_QUIZ_STACK, { screen: NAVIGATION_QUIZ_HOME_SCREEN });
  }, []);

  const finishHandler = () => {
    console.log(`===== ${TAG}:finishHandler =====`);
  };

  const takePhoto = useCallback(() => {
    navigation.navigate(NAVIGATION_PHOTO_STACK, { screen: NAVIGATION_PHOTO_PERMISSIONS_SCREEN });
  }, [navigation]);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader />
        <Text style={styles.title}>{i18n.t('text_profile_title')}</Text>
        {photoBase64 &&
          <ViewShot ref={viewShotRef} style={styles.previewContainer}>
            <Image style={styles.selfie} source={{ uri: `data:image/jpg;base64,${photoBase64}` }} />
            <Image style={styles.overlay} resizeMode="contain" source={FRAMES[selectedShirt]} />
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <Image source={IMG.botonEditar} />
            </TouchableOpacity>
          </ViewShot>
        }
        {!photoBase64 &&
          <View style={styles.showInfoContainer}>
            <Text style={styles.subTitle}>{i18n.t('text_home_participate_title')}</Text>
            <Text style={styles.quizDescription}>{i18n.t('text_home_participate_description')}</Text>
            <Button style={styles.button} backgroundColor="#c1e645" _text={styles.buttonText} onPress={takePhoto}>{i18n.t('button_action_participate')}</Button>
          </View>
        }
        <View style={styles.subContainer}>
          <Text style={styles.subTitle}>{i18n.t('text_profile_quiz_title')}</Text>
          <Text style={styles.quizDescription}>{i18n.t('text_profile_quiz_description')}</Text>
          <Button style={styles.button} backgroundColor="#c1e645" _text={styles.buttonText} onPress={onDoQuiz}>{i18n.t('button_action_do_quiz')}</Button>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>{i18n.t('text_profile_visit_title')}</Text>
            <VisitForm finishHandler={finishHandler} buttonText={i18n.t('button_action_update_visit')} />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  )

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 20
  },
  showInfoContainer: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    width: '100%'
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
    paddingBottom: 30,
    paddingHorizontal: 20,
    width: '100%'
  },
  previewContainer: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 137 / 160,
    marginTop: 10,
    marginBottom: 30,
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
    width: '80%',
    alignSelf: 'center',
    marginVertical: 20
  },
  buttonText: {
    color: '#2a5a40',
    fontFamily: 'Inter-SemiBold',
    fontWeight: 'bold',
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
  },
  formContainer: {
    backgroundColor: '#231f20bb',
    paddingBottom: 20,
    paddingTop: 20,
    marginTop: 20
  },
  formTitle: {
    color: '#8cbe5d',
    fontFamily: 'Inter-ExtraBold',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "700",
    paddingStart: 28,
  }
});

export default ProfileHomeScreen;
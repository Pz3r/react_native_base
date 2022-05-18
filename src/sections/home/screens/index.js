import React, { useState, useEffect, useCallback } from 'react';
import { Platform, Linking, StyleSheet, Image, ImageBackground, View, TouchableOpacity } from 'react-native';
import { Flex, Text, Modal, Button, ScrollView } from 'native-base';
import i18n from 'i18n-js';

import IMG from 'assets/img';

import { NAVIGATION_PHOTO_PERMISSIONS_SCREEN, NAVIGATION_PHOTO_STACK } from '../../../navigation/constants';
import AppHeader from '../../../components/AppHeader/AppHeader';

function HomeScreen({ navigation }) {

  const takePhoto = useCallback(() => {
    navigation.navigate(NAVIGATION_PHOTO_STACK, { screen: NAVIGATION_PHOTO_PERMISSIONS_SCREEN });
  }, [navigation]);

  const activateNotification = useCallback(() => {

  }, []);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader navigation={navigation} />
        <Image source={IMG.smImagenHomeA} />
        <View style={styles.showInfoContainer}>
          <Text style={styles.paragraph}>{i18n.t('text_home_experience_1')}</Text>
          <Text style={styles.paragraph}>{i18n.t('text_home_experience_2')}</Text>
          <Text style={styles.title}>{i18n.t('text_home_participate_title')}</Text>
          <Text style={styles.paragraph}>{i18n.t('text_home_participate_description')}</Text>
          <Button style={styles.button} backgroundColor="#c1e645" _text={styles.buttonText} onPress={takePhoto}>{i18n.t('button_action_participate')}</Button>
          {false &&
            <>
              <Text style={styles.paragraph}>{i18n.t('text_home_notifications_description')}</Text>
              <Button style={styles.button} backgroundColor="#c1e645" _text={styles.buttonText} onPress={activateNotification}>{i18n.t('button_action_activate_notifications')}</Button>
            </>
          }
          <Text style={styles.subTitle}>{i18n.t('text_home_subtitle')}</Text>
        </View>
        <Image source={IMG.smImagenHomeB} />
        <View style={styles.showInfoContainer}>
          <Text style={styles.title}>{i18n.t('text_home_bracelet_title')}</Text>
          <Text style={styles.paragraph}>{i18n.t('text_home_bracelet_description')}</Text>
          <View style={{ paddingVertical: 30 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20 }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                <Image source={IMG.iconoPaso1Recibela} />
                <Text style={styles.numberTitle}>1</Text>
                <Text style={styles.numberText}>{i18n.t('text_home_receive')}</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                <Image source={IMG.iconoPaso2Pontela} />
                <Text style={styles.numberTitle}>2</Text>
                <Text style={styles.numberText}>{i18n.t('text_home_put')}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                <Image source={IMG.iconoPaso3Ofrenda} />
                <Text style={styles.numberTitle}>3</Text>
                <Text style={styles.numberText}>{i18n.t('text_home_offer')}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.title}>{i18n.t('text_home_app_title')}</Text>
          <Text style={styles.paragraph}>{i18n.t('text_home_app_description1')}</Text>
          <Text style={styles.paragraph}>{i18n.t('text_home_app_description2')}</Text>
          <Text style={[styles.paragraph, { paddingBottom: 0 }]}>{i18n.t('text_home_app_description3')}</Text>
          <TouchableOpacity onPress={() => {
            if (Platform.OS === 'ios') {
              Linking.openURL('https://apps.apple.com/mx/app/mi-selecci%C3%B3n-mx/id440860179');
            } else {
              Linking.openURL('https://play.google.com/store/apps/details?id=com.yinzcam.mff.national');
            }
          }}>
            <Image style={{ resizeMode: 'contain', width: 200, alignSelf: 'center' }} source={Platform.OS === 'ios' ? IMG.tiendaAppleBlanco : IMG.tiendaGoogleBlanco} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  )

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  showInfoContainer: {
    paddingTop: 20,
    paddingHorizontal: 20
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  paragraph: {
    color: '#ffffff',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 19,
    paddingBottom: 20
  },
  title: {
    fontFamily: 'OperaBlackOblique',
    color: '#e74a7b',
    fontSize: 35,
    lineHeight: 37,
    alignSelf: 'flex-start',
    paddingTop: 10,
    paddingBottom: 20,
  },
  subTitle: {
    fontFamily: 'OperaBlackOblique',
    color: '#8cbe5d',
    fontSize: 30,
    lineHeight: 34,
    alignSelf: 'center',
    textAlign: 'center',
    paddingBottom: 30,
    paddingHorizontal: 40
  },
  numberTitle: {
    fontFamily: 'OperaBlackOblique',
    color: '#f7ec13',
    fontSize: 30,
    lineHeight: 34,
    alignSelf: 'center',
    textAlign: 'center',
    paddingBottom: 5
  },
  button: {
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 20
  },
  buttonText: {
    color: '#2a5a40',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  numberText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default HomeScreen;
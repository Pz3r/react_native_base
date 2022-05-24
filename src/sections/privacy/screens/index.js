import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View, TouchableOpacity } from 'react-native';
import { Flex, Text, Button, ScrollView } from 'native-base';
import i18n from 'i18n-js';

import IMG from 'assets/img';

import { SAFE_AREA_PADDING } from '../../../constants/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';

const TAG = 'PrivacyNoticeScreen';

function PrivacyNoticeScreen({ navigation }) {

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.top}>
          <StepHeader backButtonHandler={goBack} />
        </View>
        <View style={styles.middle}>
          <Text style={styles.subTitle}>{i18n.t('drawer_item_privacy')}</Text>
          <Text style={styles.paragraph}>{i18n.t(`privacy_notice_text`)}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: SAFE_AREA_PADDING.paddingTop,
  },
  top: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  middle: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  subTitle: {
    fontFamily: 'OperaBlackOblique',
    color: '#00994c',
    fontSize: 30,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  paragraph: {
    color: '#ffffff',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 17
  },
});

export default PrivacyNoticeScreen;
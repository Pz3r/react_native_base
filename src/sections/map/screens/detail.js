import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View, TouchableOpacity } from 'react-native';
import { Flex, Text, Button, ScrollView } from 'native-base';
import i18n from 'i18n-js';

import IMG from 'assets/img';

import { SAFE_AREA_PADDING } from '../../../constants/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';
import PLAN_ITEMS from '../../../data/plan';

const TAG = 'MapDetailScreen';

function MapDetailScreen({ route, navigation }) {
  const [planItem, setPlanItem] = useState();

  useEffect(() => {
    console.log(`===== ${TAG}:useEffect =====`);
    console.log(`${JSON.stringify(route.params)}`);
    if (route.params) {
      const index = parseInt(route.params['index']);
      setPlanItem(PLAN_ITEMS[index]);
    }
  }, [route]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      {planItem && planItem.cover &&
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.top}>
            <StepHeader backButtonHandler={goBack} />
          </View>
          <Image style={{ alignSelf: 'center' }} source={planItem.cover} />
          <View style={styles.infoContainer}>
            <Text style={styles.subTitle}>{i18n.t(planItem.title)}</Text>
            <Text style={styles.paragraph}>{i18n.t(planItem.description)}</Text>
          </View>
        </ScrollView>
      }
      {planItem && !planItem.cover &&
        <>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.subTitle, { fontSize: 40, lineHeight: 42, paddingBottom: 0 }]}>{i18n.t('text_plan_item_placeholder_title')}</Text>
          </View>
          <View style={[styles.top, { position: 'absolute', top: SAFE_AREA_PADDING.paddingTop,}]}>
            <StepHeader backButtonHandler={goBack} />
          </View>
        </>
      }
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#bbb',
    paddingTop: SAFE_AREA_PADDING.paddingTop,
  },
  infoContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  top: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  middle: {
    //backgroundColor: '#0f0',
  },
  selfie: {
    width: '70%',
    aspectRatio: 3 / 4,
  },
  shirt: {
    position: 'absolute',
    width: '70%',
    aspectRatio: 3 / 4,
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20
  },
  leftButton: {
    position: 'absolute',
    left: 5
  },
  rightButton: {
    position: 'absolute',
    right: 5
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  bottom: {
    width: '50%',
    alignItems: 'center',
    position: 'absolute',
    paddingBottom: 15,
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
  subTitle: {
    fontFamily: 'OperaBlackOblique',
    color: '#00994c',
    fontSize: 30,
    lineHeight: 34,
    paddingBottom: 15,
  },
  paragraph: {
    color: '#ffffff',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 19,
    paddingBottom: 20
  },
});

export default MapDetailScreen;
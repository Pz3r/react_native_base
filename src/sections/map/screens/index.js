import React, { useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View } from 'react-native';
import { Flex, Text, ScrollView } from 'native-base';
import i18n from 'i18n-js';

import IMG from 'assets/img';

import { NAVIGATION_MAP_DETAIL_SCREEN, NAVIGATION_MAP_DETAIL_STACK } from '../../../navigation/constants';
import AppHeader from '../../../components/AppHeader/AppHeader';
import PlanItem from '../../../components/PlanItem/PlanItem';
import PLAN_ITEMS from '../../../data/plan';

const TAG = 'MapHomeScreen';

function MapHomeScreen({ navigation }) {

  const planItemHandler = useCallback((index) => {
    console.log(`===== ${TAG}:planItemHandler index:${index} =====`);
    navigation.navigate(NAVIGATION_MAP_DETAIL_STACK, { 
      screen: NAVIGATION_MAP_DETAIL_SCREEN,
      params: { index }
     });
  }, [navigation]);

  const RENDERED_PLAN_ITEMS = PLAN_ITEMS.map((item, index) => (
    <PlanItem key={index} index={index} color={item.color} icon={item.icon} title={item.title} onPressHandler={planItemHandler} />
  ));

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader />
        <Text style={styles.title}>{i18n.t('text_plan_title')}</Text>
        <View style={styles.showInfoContainer}>
          <Image source={IMG.mapa} />
        </View>
        <View style={{ width: '100%', paddingHorizontal: 20, marginVertical: 20 }}>
          { RENDERED_PLAN_ITEMS }
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
  title: {
    fontFamily: 'OperaBlackOblique',
    color: '#e74a7b',
    fontSize: 35,
    lineHeight: 37,
    paddingTop: 10,
    alignSelf: 'flex-start',
    paddingStart: 20
  },
});

export default MapHomeScreen;
import React from 'react';
import {StyleSheet, View, Text, ImageBackground, Image} from 'react-native';
import {ScrollView} from 'native-base';
import i18n from 'i18n-js';

import IMG from 'assets/img';
import {NAVIGATION_TIMELINE} from '../../../navigation/constants';
import Timeline from '../components/Timeline';

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function AboutHomeScreen({navigation}) {
  const showDetail = index => {
    navigation.navigate(NAVIGATION_TIMELINE, {index, hours: HOURS});
  };

  return (
    <View style={styles.main}>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={IMG.appBackground}>
        <ScrollView>
          <Image source={IMG.ktCamW4} style={styles.fullWidthImage} />

          <View style={styles.container}>
            <Text style={styles.title}>{i18n.t('about_title')}</Text>
            <Text style={styles.subTitle}>{i18n.t('about_subtitle')}</Text>
            <Text style={[styles.text, { paddingBottom: 15 }]}>{i18n.t('about_text')}</Text>
            <Text style={[styles.text, { paddingTop: 0 }]}>{i18n.t('about_text_2')}</Text>
            <Image source={IMG.ktDividerLine1} style={styles.fullWidthImage} />
            <Text style={styles.title}>{i18n.t('aobut_amudat_title')}</Text>
            <Text style={styles.subTitle}>
              {i18n.t('aobut_amudat_subtitle')}
            </Text>
            <Text style={styles.text}>{i18n.t('aobut_amudat_text')}</Text>
          </View>

          <Image source={IMG.B21705512} />
          <View style={{paddingHorizontal: 30, paddingBottom: 50}}>
            <Text style={styles.subTitle}>{i18n.t('timeline_title')}</Text>
          </View>

          <Timeline hours={HOURS} showDetail={showDetail} />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'flex-start',
    fontFamily: 'Arvo-Regular',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Arvo_700Bold',
    color: '#D8A526',
    paddingTop: 15,
  },
  subTitle: {
    fontSize: 25,
    fontFamily: 'Arvo_400Regular',
    color: '#D8A526',
    paddingTop: 10,
  },
  text: {
    paddingTop: 15,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.5,
    fontFamily: 'Arvo_400Regular',
    paddingBottom: 50,
  },
  fullWidthImage: {
    width: '100%',
  },
});

export default AboutHomeScreen;

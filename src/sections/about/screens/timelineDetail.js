import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  Image,
  ImageBackground,
} from 'react-native';
import {View} from 'native-base';
import AppBar from './../../../components/AppBar';

import i18n from 'i18n-js';
import IMG from 'assets/img';
import {NAVIGATION_TIMELINE} from '../../../navigation/constants';

export default function TimelineScreen({route, navigation}) {
  const {index, hours} = route.params;
  const hour = hours[index];

  const goBackScreen = () => {
    navigation.goBack();
  };

  const goToIndexScreen = indexScreen => {
    navigation.navigate(NAVIGATION_TIMELINE, {
      index: indexScreen,
      hours,
    });
  };

  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={IMG.appBackground}>
      <View style={styles.container}>
        <AppBar
          goBack={goBackScreen}
          goToIndexScreen={goToIndexScreen}
          index={index}
          lastIndex={hours.length - 1}
        />
        <ScrollView style={styles.container}>
          <Image
            source={IMG[`ktImage${hour}hour`]}
            style={styles.fullWidthImage}
          />
          <View style={styles.info}>
            <Text style={styles.hour}>
              {i18n.t(`timeline_detail_${hour}_hour`)}
            </Text>
            <Text style={styles.title}>
              {i18n.t(`timeline_detail_${hour}_title`)}
            </Text>
            <Text style={styles.text}>
              {i18n.t(`timeline_detail_${hour}_text`)}
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullWidthImage: {
    width: '100%',
  },

  background: {
    flex: 1,
    justifyContent: 'center',
  },
  hour: {
    color: '#959290',
    fontSize: 25,
    paddingBottom: 10,
    fontFamily: 'Arvo_400Regular',
  },
  title: {
    color: '#D8A526',
    fontSize: 35,
    fontFamily: 'Arvo_700Bold',
    paddingBottom: 25,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 0.5,
    paddingBottom: 10,
    fontFamily: 'Arvo_400Regular',
  },
  info: {
    paddingHorizontal: 20,
  },
});

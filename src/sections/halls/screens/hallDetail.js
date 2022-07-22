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
import {NAVIGATION_HALLS_DETAIL} from '../../../navigation/constants';

export default function HallDetailScreen({route, navigation}) {
  const {index, halls} = route.params;
  const hall = halls[index];

  const goBackScreen = () => {
    navigation.goBack();
  };

  const goToIndexScreen = indexScreen => {
    navigation.navigate(NAVIGATION_HALLS_DETAIL, {
      index: indexScreen,
      halls,
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
          lastIndex={halls.length - 1}
        />
        <ScrollView style={styles.container}>
          <Text style={styles.title}>
            {i18n.t(`halls_${hall.toLowerCase()}_title`)}
          </Text>
          <Image source={IMG[`ktHallDetail${hall}`]} style={styles.fullWidth} />
          <Text style={styles.text}>
            {i18n.t(`halls_${hall.toLowerCase()}_text`)}
          </Text>
          <View style={styles.divider}>
            <Image source={IMG.ktDividerLine1} style={styles.fullWidth} />
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
  fullWidth: {
    width: '100%',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#D8A526',
    fontSize: 35,
    fontFamily: 'Arvo_700Bold',
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 0.5,
    fontFamily: 'Arvo_400Regular',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 100,
  },
  divider: {
    height: 30,
    marginHorizontal: 20,
    marginBottom: 30,
  },
});

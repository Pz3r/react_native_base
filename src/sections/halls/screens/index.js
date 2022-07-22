import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import i18n from 'i18n-js';
import IMG from 'assets/img';
import {NAVIGATION_HALLS_DETAIL} from '../../../navigation/constants';

const HALLS = ['Tomb', 'Pharaohs', 'Sphinxes', 'God'];

function HallsHomeScreen({navigation}) {
  const showDetail = index => {
    navigation.navigate(NAVIGATION_HALLS_DETAIL, {index, halls: HALLS});
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={IMG.appBackground}>
        <ScrollView style={styles.scroll}>
          <Text style={styles.title}>{i18n.t('halls_title')}</Text>
          {HALLS.map((hall, index) => (
            <Pressable
              onPress={() => showDetail(index)}
              style={styles.item}
              key={hall}>
              <View style={styles.btn}>
                <ImageBackground
                  resizeMode="cover"
                  style={styles.btnImg}
                  source={IMG[`ktHallBtn${hall}`]}>
                  <Text style={styles.btnLabel}>
                    {i18n.t(`halls_${hall.toLowerCase()}_title`)}
                  </Text>
                </ImageBackground>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  scroll: {
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Arvo_700Bold',
    color: '#D8A526',
    marginTop: 30,
    marginBottom: 20,
  },
  btn: {
    position: 'relative',
    height: 130,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  btnImg: {
    flex: 1,
    borderRadius: 50,
  },
  btnLabel: {
    position: 'absolute',
    color: '#ffffff',
    fontFamily: 'Arvo_700Bold',
    fontSize: 25,
    left: 20,
    bottom: 15,
  },
});

export default HallsHomeScreen;

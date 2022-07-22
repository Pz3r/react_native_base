import React from 'react';
import {StyleSheet, Text, Pressable, Image} from 'react-native';
import {View} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path, Circle} from 'react-native-svg';
import i18n from 'i18n-js';
import IMG from 'assets/img';

const GRADIEN_COLORS = [
  '#121212',
  '#0D4D7D',
  '#423F8F',
  '#4F4A92',
  '#72689B',
  '#85789F',
  '#AD9AA9',
  '#E5C9B6',
  '#D6BCB2',
  '#D7A436',
];

const Timeline = ({hours, showDetail}) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIEN_COLORS} style={styles.linearGradient}>
        <Svg
          width="28"
          height="28"
          viewBox="0 0 18 14"
          style={{left: 5, top: 4}}>
          <Path
            d="M8.99998 8.01519C12.6 8.01519 15.7 10.1253 17.1 13.2403C17.6 12.135 17.9 10.8287 17.9 9.42194C17.9 4.4983 13.9 0.479004 8.99998 0.479004C4.09998 0.479004 0.0999756 4.4983 0.0999756 9.42194C0.0999756 10.7282 0.399975 12.0345 0.899975 13.2403C2.29997 10.1253 5.39998 8.01519 8.99998 8.01519Z"
            fill="white"
          />
        </Svg>

        <Svg
          width="28"
          height="28"
          viewBox="0 0 100 100"
          style={{left: 5, bottom: 5, position: 'absolute'}}>
          <Circle cx="50" cy="50" r="50" fill="white" />
        </Svg>
      </LinearGradient>

      {hours.map((hour, index) => (
        <Pressable
          onPress={() => showDetail(index)}
          style={styles.item}
          key={hour}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Image source={IMG[`ktIlustracion${hour}hour`]} />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.circle}>
              <Text>{hour}</Text>
            </View>
            <View style={styles.line} />
          </View>
          <View style={{paddingLeft: 100}}>
            <Text style={styles.hour}>{i18n.t(`timeline_${hour}_hour`)}</Text>
            <Text style={styles.title}>{i18n.t(`timeline_${hour}_title`)}</Text>
            <Text style={styles.text}>{i18n.t(`timeline_${hour}_text`)}</Text>
            <Text style={styles.button}>{i18n.t('timeline_see_more')}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    fontFamily: 'Arvo-Regular',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 150,
  },
  item: {
    position: 'relative',
    paddingRight: 20,
    paddingBottom: 30,
  },
  button: {
    color: '#D8A526',
    fontFamily: 'Arvo_400Regular',
  },
  circle: {
    height: 30,
    width: 30,
    backgroundColor: '#D8A526',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    backgroundColor: '#D8A526',
    width: '100%',
    height: 2,
  },
  linearGradient: {
    position: 'absolute',
    top: 20,
    left: 65,
    width: 38,
    height: '100%',
    borderRadius: 30,
  },
  hour: {
    color: '#959290',
    fontFamily: 'Arvo_400Regular',
    paddingBottom: 10,
  },
  title: {
    color: '#D8A526',
    fontFamily: 'Arvo_700Bold',
    paddingBottom: 10,
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Arvo_400Regular',
    paddingBottom: 10,
  },
});

export default Timeline;

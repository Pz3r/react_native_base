import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import i18n from 'i18n-js';

import IMG from 'assets/img';

const TAG = 'PlanItem';

export default function PlanItem({ index, color, icon, title, onPressHandler }) {

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPressHandler(index)}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Image source={icon} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{i18n.t(title)}</Text>
      </View>
      <View style={styles.arrowContainer}>
        <Image source={IMG.flechaDerecha} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#133b33',
    flexDirection: 'row',
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    marginBottom: 15
  },
  iconContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 13
  },
  titleText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: 'bold',
  },
  arrowContainer: {
    paddingHorizontal: 13
  }
});

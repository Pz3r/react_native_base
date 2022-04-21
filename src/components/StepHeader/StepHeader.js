import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

import IMG from 'assets/img';

import { CONTENT_SPACING, SAFE_AREA_PADDING } from '../../constants/constants';

export default function StepHeader({ title, backButtonHandler, total, step }) {

  const getStepImage = (total, step) => {
    if (total === 4) {
      switch (step) {
        case 1:
          return IMG.barraProgresoCuatro1;
        case 2:
          return IMG.barraProgresoCuatro2;
        case 3:
          return IMG.barraProgresoCuatro3;
        case 4:
          return IMG.barraProgresoCuatro4;
        default:
          return IMG.barraProgresoCuatro1;
      }
    }
    return IMG.barraProgresoCuatro1;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity disabled={!backButtonHandler} onPress={backButtonHandler} style={styles.backButton}>
        <Image style={!backButtonHandler ? { opacity: 0 } : {}} source={IMG.botonRegresar} />
      </TouchableOpacity>
      <Image source={getStepImage(total, step)} />
      <Text style={styles.title}>{title}</Text>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
  },
  title: {
    fontFamily: 'OperaBlackOblique',
    color: '#e74a7b',
    fontSize: 35,
    lineHeight: 37,
    paddingTop: 10
  },
  backButton: {
    paddingBottom: 10
  }
});
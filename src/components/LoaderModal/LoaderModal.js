import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { Icon, Button } from 'native-base';
import LottieView from 'lottie-react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import i18n from 'i18n-js';

import IMG from 'assets/img';
import Lottie from 'assets/lottie';

export default function LoaderModal({ loaderText, errorText, isVisible, isError, isComplete, closeHandler }) {
  if (isError) {
    return (
      <Modal isVisible={isVisible} style={styles.container}>
        <View style={styles.innerError}>
          <Icon as={Ionicons} name="close-circle-outline" color="danger.500" size={16} />
          <View style={styles.textContainer}>
            <Text style={styles.errorText}>{errorText}</Text>
          </View>
          <Button onPress={closeHandler} width="40%" backgroundColor="#c1e645" _text={styles.buttonText}>{i18n.t('button_action_close')}</Button>
        </View>
      </Modal>
    )
  } else if (isComplete) {
    return (
      <Modal isVisible={isVisible} style={styles.container}>
        <View style={styles.innerError}>
          <Icon as={Ionicons} name="checkmark-circle-outline" color="#c1e645" size={16} />
          <View style={styles.textContainer}>
            <Text style={styles.errorText}>{i18n.t('text_loader_success')}</Text>
          </View>
          <View style={styles.textContainer}>
            <Button onPress={() => closeHandler(true)} width="40%" backgroundColor="#c1e645" _text={styles.buttonText}>{i18n.t('button_action_continue')}</Button>
          </View>
        </View>
      </Modal>
    )
  } else {
    return (
      <Modal isVisible={isVisible} style={styles.container}>
        <View style={styles.inner}>
          <LottieView style={{ flex: 2, width: '30%', alignSelf: 'center', paddingTop: 20 }} source={Lottie.balon2} autoPlay loop />
          <View style={styles.textContainer2}>
            <Text style={styles.infoText}>{loaderText}</Text>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50
  },
  inner: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 10,
    justifyContent: 'flex-end'
  },
  innerError: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    paddingBottom: 20,
    width: '100%',
    alignItems: 'center'
  },
  textContainer2: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    paddingTop: 40
  },
  infoText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
  buttonText: {
    color: '#2a5a40',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
});
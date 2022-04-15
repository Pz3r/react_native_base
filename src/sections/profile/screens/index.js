import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, ImageBackground, View } from 'react-native';
import { Flex, Text, Button } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IMG from 'assets/img';

const STORAGE_UUID = 'STORAGE_UUID';
const STORAGE_PHOTO = 'STORAGE_PHOTO';

const TAG = 'ProfileHomeScreen';
const PHOTO_WIDTH = 414;
const PHOTO_HEIGHT = 552;

function ProfileHomeScreen() {
  const [photoBase64, setPhotoBase64] = useState();

  useEffect(async () => {
    console.log(`===== ${TAG}:useEffect =====`);
    try {
      const base64 = await AsyncStorage.getItem(STORAGE_PHOTO);
      setPhotoBase64(base64);
    } catch (e) {
      console.log(`===== ${TAG}:useEffect =====`);
      console.log(e);
    }    
  }, []);

  if (photoBase64) {
    return (
      <Flex flex="1" style={styles.container}>
        <View style={styles.top}>
          <Text>TÍTULO</Text>
        </View>
        <Flex flex="1" alignItems="center" justifyContent="center" style={styles.middle}>
          <View style={styles.previewContainer}>
            <Image style={styles.selfie} source={{ uri: `data:image/jpg;base64,${photoBase64}` }} />
            <ImageBackground resizeMode="cover" style={styles.overlay} source={IMG.smPaniniPrueba} />
          </View>
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex flex="1" style={styles.container} alignItems="center" justifyContent="center">
      <Text>Profile Home</Text>
    </Flex>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#bbb',
  },
  top: {
    backgroundColor: '#f00',
    alignItems: 'center'
  },
  middle: {
    backgroundColor: '#0f0',
  },
  selfie: {
    position: 'absolute',
    width: '74%',
    aspectRatio: 3 / 4,
    left: '13%',
  },
  previewContainer: {
    width: '90%',
    aspectRatio: 137 / 160,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  bottom: {
    position: 'absolute',
    bottom: 0
  },
});

export default ProfileHomeScreen;
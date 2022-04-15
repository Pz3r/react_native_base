import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View } from 'react-native';
import { Flex, Text, Button } from 'native-base';
import { Storage } from 'aws-amplify';
import ImageEditor from '@react-native-community/image-editor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';

import IMG from 'assets/img';

const STORAGE_UUID = 'STORAGE_UUID';
const STORAGE_PHOTO = 'STORAGE_PHOTO';

const TAG = 'PhotoStampScreen';
const PHOTO_WIDTH = 414;
const PHOTO_HEIGHT = 552;

function PhotoStampScreen({ route }) {
  const [photoPath, setPhotoPath] = useState();
  const [photoWidth, setPhotoWidth] = useState();
  const [photoHeight, setPhotoHeight] = useState();

  useEffect(() => {
    console.log(`===== ${TAG}:useEffect ${JSON.stringify(route.params)} =====`);
    if (route.params) {
      setPhotoPath(route.params['path']);
      setPhotoWidth(route.params['width']);
      setPhotoHeight(route.params['height']);
    }
  }, [route]);

  const getUUID = async () => {
    const storedUuid = await AsyncStorage.getItem(STORAGE_UUID);
    if (storedUuid) {
      return storedUuid;
    } else {
      const newUuid = uuid.v4();
      await AsyncStorage.setItem(STORAGE_UUID, newUuid);
      return newUuid;
    }
  }

  const getProcessedImage = async (photoPath, photoWidth, photoHeight) => {
    // Crop and resize photo
    let diffY = 0;
    let diffX = 0;
    let croppedWidth;
    let croppedHeight;

    if (photoWidth === photoHeight) {
      croppedWidth = photoWidth * .75;
      croppedHeight = photoHeight;
      diffX = (photoWidth - croppedWidth) / 2;

    } else {
      croppedWidth = photoHeight;
      croppedHeight = photoHeight / .75;
      diffY = (photoWidth - croppedHeight) / 2;
    }

    console.log(`====== ${TAG}:getProcessedImage diffX:${diffX} / diffY:${diffY} =====`);
    const croppedUri = await ImageEditor.cropImage(`file://${photoPath}`, {
      offset: { x: diffX, y: diffY },
      size: { width: croppedWidth, height: croppedHeight },
      displaySize: { width: PHOTO_WIDTH, height: PHOTO_HEIGHT }
    });

    return croppedUri;
  }

  const storeProcessedImage = async (imagePath) => {
    const base64 = await FileSystem.readAsStringAsync(imagePath, {
      encoding: FileSystem.EncodingType.Base64
    });
    console.log(`===== ${TAG}:storeProcessedImage base64 =====`);
    console.log(base64);

    // TODO GUARDAR EN ESTADO TAMBIÉN
    await AsyncStorage.setItem(STORAGE_PHOTO, base64);
  }

  const confirmStamp = useCallback(async () => {
    try {
      console.log(`===== ${TAG}:confirmStep file://${photoPath} // height: ${photoHeight} // width: ${photoWidth}=====`)

      // Crop and resize image
      const croppedUri = await getProcessedImage(photoPath, photoWidth, photoHeight);
      console.log(`===== ${TAG}:confirmStep croppedUri: ${croppedUri} =====`);
      
      // Obtrain blob
      const response = await fetch(`${croppedUri}`);
      const blob = await response.blob();

      // Obtain UUID generated from local storage
      const uuid = await getUUID();
      console.log(`===== ${TAG}:confirmStamp uuid:${uuid} =====`);

      // Store in S3 bucket
      const result = await Storage.put(uuid, blob, {
        contentType: 'image/jpeg'
      });
      console.log(`===== ${TAG}:confirmStamp upload result: =====`);
      console.log(JSON.stringify(result));

      // Store processed image
      await storeProcessedImage(croppedUri);

    } catch (err) {
      console.log(`===== ${TAG}:confirmStamp error =====`);
      console.log(err);
    }
  }, [photoPath, photoWidth, photoHeight]);

  return (
    <Flex flex="1" style={styles.container}>
      <View style={styles.top}>
        <Text>TÍTULO</Text>
      </View>
      <Flex flex="1" alignItems="center" justifyContent="center" style={styles.middle}>
        <View style={styles.previewContainer}>
          <Image style={styles.selfie} source={{ uri: `file://${photoPath}` }} />
          <ImageBackground resizeMode="cover" style={styles.overlay} source={IMG.smPaniniPrueba} />
        </View>
      </Flex>
      <Button onPress={confirmStamp}>Listo</Button>
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
    display: 'none'
  },
  bottom: {
    position: 'absolute',
    bottom: 0
  },
});

export default PhotoStampScreen;
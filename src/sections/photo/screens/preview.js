import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View, TouchableOpacity } from 'react-native';
import { Flex, Text, Button } from 'native-base';
import Modal from "react-native-modal";
import { Storage } from 'aws-amplify';
import ImageEditor from '@react-native-community/image-editor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';
import i18n from 'i18n-js';

import IMG from 'assets/img';

import { CONTENT_SPACING, SAFE_AREA_PADDING } from '../../../constants/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';

const STORAGE_UUID = 'STORAGE_UUID';
const STORAGE_PHOTO = 'STORAGE_PHOTO';

const TAG = 'PhotoPreviewScreen';
const PHOTO_WIDTH = 414;
const PHOTO_HEIGHT = 552;

function PhotoPreviewScreen({ route, navigation }) {
  const [photoPath, setPhotoPath] = useState();
  const [photoWidth, setPhotoWidth] = useState();
  const [photoHeight, setPhotoHeight] = useState();
  const [isLoading, setIsLoading] = useState();
  const [isPhotoSent, setIsPhotoSent] = useState(false);
  const [isError, setIsError] = useState(false);

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
      setIsLoading(true);

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
      setIsPhotoSent(true);

    } catch (err) {
      console.log(`===== ${TAG}:confirmStamp error =====`);
      console.log(err);
      setIsError(true);
    }
  }, [photoPath, photoWidth, photoHeight]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <Flex flex="1" style={styles.container} alignItems="center">
        <View style={styles.top}>
          <StepHeader title={i18n.t('photo_preview_title')} backButtonHandler={goBack} total={4} step={2} />
        </View>
        <View style={styles.previewContainer}>
          <Image style={styles.selfie} source={{ uri: `file://${photoPath}` }} />
          <Image style={styles.shirt} resizeMode="cover" source={IMG.smCamisaPrueba} />
          <TouchableOpacity style={styles.leftButton}>
            <Image source={IMG.flechaCamisetasIzquierda} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightButton}>
            <Image source={IMG.flechaCamisetasDerecha} />
          </TouchableOpacity>
        </View>
        <View style={styles.bottom}>
          <Button width="80%" backgroundColor="#c1e645" _text={styles.buttonText}>{i18n.t('button_action_ready')}</Button>
        </View>
        <Modal isVisible={isLoading}>
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Text>{isPhotoSent ? 'Envío completo' : 'Enviando...'}</Text>
            <Button disabled={!isPhotoSent} onPress={() => setIsLoading(false)}>
              Continuar
            </Button>
          </View>
        </Modal>
      </Flex>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#bbb',
    paddingTop: SAFE_AREA_PADDING.paddingTop,
  },
  top: {
    paddingHorizontal: 50
  },
  middle: {
    //backgroundColor: '#0f0',
  },
  selfie: {
    width: '70%',
    aspectRatio: 3 / 4,
  },
  shirt: {
    position: 'absolute',
    width: '70%',
    aspectRatio: 3 / 4,
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20
  },
  leftButton: {
    position: 'absolute',
    left: 5
  },
  rightButton: {
    position: 'absolute',
    right: 5
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  bottom: {
    width: '50%',
    alignItems: 'center',
    position: 'absolute',
    paddingBottom: 15,
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#2a5a40',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
});

export default PhotoPreviewScreen;
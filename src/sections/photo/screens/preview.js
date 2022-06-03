import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View, TouchableOpacity } from 'react-native';
import { Flex, Text, Button, Checkbox } from 'native-base';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { Storage } from 'aws-amplify';
import ImageEditor from '@react-native-community/image-editor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';
import LottieView from 'lottie-react-native';
import i18n from 'i18n-js';

import IMG from 'assets/img';
import Lottie from 'assets/lottie';

import { NAVIGATION_PHOTO_STAMP_SCREEN, NAVIGATION_PRIVACY_NOTICE_STACK } from '../../../navigation/constants';
import { SAFE_AREA_PADDING } from '../../../constants/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';
import LoaderModal from '../../../components/LoaderModal/LoaderModal';
import { APP_SET_STAMP } from '../../../store/actions/app';
import { ENDPOINT_POST_FACE_DETECTION, ENDPOINT_POST_FACE_DETECTION_API_KEY } from '../../../utils/endpoints';

const STORAGE_UUID = 'STORAGE_UUID';
const STORAGE_PHOTO = 'STORAGE_PHOTO';
const STORAGE_SHIRT = 'STORAGE_SHIRT';

const TAG = 'PhotoPreviewScreen';
const PHOTO_WIDTH = 414;
const PHOTO_HEIGHT = 552;

const SHIRT_OPTIONS = [
  IMG.smCamisaBlanca,
  IMG.smCamisaNegra,
];

function PhotoPreviewScreen({ route, navigation, setStamp }) {
  const [photoPath, setPhotoPath] = useState();
  const [photoWidth, setPhotoWidth] = useState();
  const [photoHeight, setPhotoHeight] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isPhotoSent, setIsPhotoSent] = useState(false);
  const [isError, setIsError] = useState(false);
  const [shirtIndex, setShirtIndex] = useState(0);
  const [isTerms, setIsTerms] = useState();
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    console.log(`===== ${TAG}:useEffect ${JSON.stringify(route.params)} =====`);
    if (route.params) {
      setPhotoPath(route.params['path']);
      setPhotoWidth(route.params['width']);
      setPhotoHeight(route.params['height']);
      setIsValidated(route.params['validated']);
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

  const storeProcessedImage = async (base64, shirtIndex) => {
    console.log(`===== ${TAG}:storeProcessedImage shirtIndex base64.length: ${base64.length} =====`);
    console.log(shirtIndex);

    await AsyncStorage.setItem(STORAGE_PHOTO, base64);
    await AsyncStorage.setItem(STORAGE_SHIRT, shirtIndex);
    await setStamp({ base64, shirtIndex });
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

      // Obtain base64
      const base64 = await FileSystem.readAsStringAsync(croppedUri, {
        encoding: FileSystem.EncodingType.Base64
      });

      let isFaceDetected = true;
      if (!isValidated) {
        console.log(`===== ${TAG}:confirmStamp CALLING FACE DETECTION ENDPOINT =====`);
        console.log(`${base64}`);
        const response = await fetch(
          ENDPOINT_POST_FACE_DETECTION,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'x-api-key': ENDPOINT_POST_FACE_DETECTION_API_KEY
            },
            body: JSON.stringify({ file: base64 })
          }
        );

        console.log(`===== ${TAG}:confirmStamp FACE DETECTION response status: ${response.status} =====`);
        const faceDetectionResult = await response.json();
        console.log(`${JSON.stringify(faceDetectionResult)}`);
        if (!faceDetectionResult['FaceDetails'] || faceDetectionResult['FaceDetails'].length < 1) {
          isFaceDetected = false;
        }

      }

      if (isFaceDetected) {
        // Store in S3 bucket
        const result = await Storage.put(uuid, blob, {
          contentType: 'image/jpeg',
          metadata: { shirt: `${shirtIndex}` }
        });
        console.log(`===== ${TAG}:confirmStamp upload result: =====`);
        console.log(JSON.stringify(result));

        // Store processed image
        await storeProcessedImage(base64, `${shirtIndex}`);

        setIsLoading(false);
        setIsError(false);
        setIsPhotoSent(false);
        navigation.navigate(NAVIGATION_PHOTO_STAMP_SCREEN);
      } else {
        console.log(`===== ${TAG}:confirmStamp FACE NOT DETECTED =====`);
        setIsError(true);
      }

    } catch (err) {
      console.log(`===== ${TAG}:confirmStamp error =====`);
      console.log(err);
      setIsError(true);
    }
  }, [photoPath, photoWidth, photoHeight, shirtIndex, isValidated]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const nextShirt = (forward) => {
    if (forward && (shirtIndex + 1) < SHIRT_OPTIONS.length) {
      setShirtIndex(shirtIndex + 1);
    } else if (!forward && (shirtIndex - 1) >= 0) {
      setShirtIndex(shirtIndex - 1);
    }
  }

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <Flex flex="1" style={styles.container} alignItems="center">
        <View style={styles.top}>
          <StepHeader title={i18n.t('photo_preview_title')} backButtonHandler={goBack} total={4} step={2} />
        </View>
        <View style={styles.previewContainer}>
          <Image style={styles.selfie} source={{ uri: `file://${photoPath}` }} />
          <Image style={styles.shirt} resizeMode="contain" source={SHIRT_OPTIONS[shirtIndex]} />
          {shirtIndex > 0 &&
            <TouchableOpacity onPress={() => nextShirt(false)} style={styles.leftButton}>
              <Image source={IMG.flechaCamisetasIzquierda} />
            </TouchableOpacity>
          }
          {shirtIndex < (SHIRT_OPTIONS.length) - 1 &&
            <TouchableOpacity onPress={() => nextShirt(true)} style={styles.rightButton}>
              <Image source={IMG.flechaCamisetasDerecha} />
            </TouchableOpacity>
          }
        </View>
        <View style={styles.bottom}>
          <Flex flexDirection="row" alignItems="center" justifyContent="center">
            <Checkbox value={isTerms} onChange={setIsTerms} accessibilityLabel={i18n.t(`button_accept_terms`)} />
            <Button _text={styles.underlinedButton} variant="unstyled" onPress={() => navigation.navigate(NAVIGATION_PRIVACY_NOTICE_STACK)}>{i18n.t(`button_accept_terms`)}</Button>
          </Flex>
          <Button isDisabled={!isTerms} style={{ marginTop: 20 }} onPress={confirmStamp} width="80%" backgroundColor="#00994c" _text={styles.buttonText}>{i18n.t('button_action_ready')}</Button>
        </View>
        <LoaderModal
          isVisible={isLoading}
          isError={isError}
          isComplete={isPhotoSent}
          loaderText={i18n.t('text_loader_sending')}
          errorText={i18n.t('text_loader_face_error')}
          closeHandler={(completed) => {
            setIsLoading(false);
            setIsError(false);
            setIsPhotoSent(false);
            if (completed) {
              navigation.navigate(NAVIGATION_PHOTO_STAMP_SCREEN);
            } else {
              navigation.goBack();
            }
          }}
        />
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
    width: '70%',
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
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 19,
  },
  underlinedButton: {
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
    textDecorationLine: 'underline',
    fontSize: 13,
    lineHeight: 19,
    paddingStart: 10
  },
});

export default connect(
  (state, ownProps) => ({ ...state.App, ...ownProps }),
  dispatch => ({
    setStamp: (payload) => {
      dispatch({
        type: APP_SET_STAMP,
        payload
      })
    }
  })
)(PhotoPreviewScreen);
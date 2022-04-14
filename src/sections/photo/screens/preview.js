import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View } from 'react-native';
import { Flex, Button } from 'native-base';
import IMG from 'assets/img';

import { NAVIGATION_PHOTO_STAMP_SCREEN } from '../../../navigation/constants';

function PhotoPreviewScreen({ route, navigation }) {
  const [photoPath, setPhotoPath] = useState();

  useEffect(() => {
    console.log(`===== PhotoPreviewScreen:useEffect ${JSON.stringify(route.params)} =====`);
    if (route.params) {
      setPhotoPath(route.params['path']);
    }
  }, [route]);

  const repeatLastStep = useCallback(() => {
    navigation.goBack();
  }, []);

  const ready = useCallback(() => {
    navigation.navigate(NAVIGATION_PHOTO_STAMP_SCREEN, {
      path: photoPath,
    });
  }, []);

  return (
    <Flex flex="1" style={styles.container}>
      <View style={styles.top}>
      </View>
      <Flex flex="1" alignItems="center" justifyContent="center" style={styles.middle}>
        <View style={styles.previewContainer}>
          <Image style={StyleSheet.absoluteFill} source={{ uri: `file://${photoPath}` }} />
          <ImageBackground resizeMode="cover" style={styles.overlay} source={IMG.smCamisaPrueba} />            
        </View>
      </Flex>
      <View>
        <Button onPress={repeatLastStep} style={[styles.button, styles.bottomLeft]}>Repetir foto</Button>
        <Button onPress={ready} style={[styles.button, styles.bottomRight]}>Listo</Button>
      </View>
    </Flex>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#bbb',
  },
  top: {
    backgroundColor: '#f00',
    paddingHorizontal: 50
  },
  middle: {
    backgroundColor: '#0f0',    
  },
  selfie: {
    position: 'absolute',
    width: '70%',
    aspectRatio: 65 / 87,
    left: '15%',
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 65 / 87
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  bottom: {
    backgroundColor: '#00f',
  },
  button: {
    
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 10,
    left: 10
  },
  bottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 10
  }
});

export default PhotoPreviewScreen;
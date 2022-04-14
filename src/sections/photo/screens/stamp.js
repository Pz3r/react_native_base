import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View } from 'react-native';
import { Flex, Text, Button } from 'native-base';
import { Storage } from 'aws-amplify';
import IMG from 'assets/img';
import ImageEditor from '@react-native-community/image-editor';

function PhotoStampScreen({ route, navigation }) {
  const [photoPath, setPhotoPath] = useState();
  const [photoWidth, setPhotoWidth] = useState();
  const [photoHeight, setPhotoHeight] = useState();

  useEffect(() => {
    console.log(`===== PhotoStampScreen:useEffect ${JSON.stringify(route.params)} =====`);
    if (route.params) {
      setPhotoPath(route.params['path']);
      setPhotoWidth(route.params['width']);
      setPhotoHeight(route.params['height']);
    }
  }, [route]);

  const confirmStamp = useCallback(async () => {
    try {
      console.log(`===== file://${photoPath} // ${photoHeight} // ${photoHeight / .75} // ${photoWidth}=====`)
      const diff = (photoWidth - (photoHeight / .75)) / 2;
      console.log(`====== OFFSET DIFF: ${diff} =====`);
      const croppedUri = await ImageEditor.cropImage(`${photoPath}`, {
        offset: { x: 0, y: diff },
        size: { width: photoHeight, height: (photoHeight / .75) },
        displaySize: { width: 414, height: 552 }
      });
      console.log(`===== CROPPED URI: ${croppedUri} =====`);
      const response = await fetch(`${croppedUri}`);
      const blob = await response.blob();
      const result = await Storage.put('testIos2', blob, {
        contentType: 'image/jpeg'
      });
      console.log(`===== UPLOAD RESULT =====`);
      console.log(JSON.stringify(result));
    } catch (err) {
      console.log(`===== UPLOAD ERROR =====`);
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
    //aspectRatio: 65 / 87,
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
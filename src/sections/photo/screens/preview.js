import React, { useEffect, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Flex, Text } from 'native-base';

function PhotoPreviewScreen({ route }) {
  const [photoPath, setPhotoPath] = useState();

  useEffect(() => {
    console.log(`===== PhotoPreviewScreen:useEffect ${JSON.stringify(route.params)} =====`);
    if (route.params) {
      setPhotoPath(route.params['path']);
    }
  }, [route]);

  return (
    <Flex flex="1" style={styles.container}>
      <Flex flex="1">
        <Text>PhotoPreviewScreen</Text>
        <Text>{photoPath}</Text>
      </Flex>

      <Flex flex="3" alignItems="center" justifyContent="center" style={{backgroundColor: '#f00'}}>
        <Image style={StyleSheet.absoluteFill} source={{ uri: `file://${photoPath}` }} />
      </Flex>

      <Flex flex="1"></Flex>
    </Flex>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
});

export default PhotoPreviewScreen;
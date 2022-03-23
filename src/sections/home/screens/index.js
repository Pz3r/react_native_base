import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Flex, Text, Modal, Button } from 'native-base';

import { NAVIGATION_PHOTO_ONBOARDING_SCREEN, NAVIGATION_PHOTO_STACK } from '../../../navigation/constants';

function HomeScreen({ navigation }) {
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPhotoModalOpen(true);
    }, 1000);
  }, []);

  const takePhoto = () => {
    setPhotoModalOpen(false);
    navigation.navigate(NAVIGATION_PHOTO_STACK, { screen: {NAVIGATION_PHOTO_ONBOARDING_SCREEN} });
  }

  return (
    <Flex flex="1" style={styles.container}>
      <Flex flex="1" alignItems="center" justifyContent="center">
        <Text>
          HomeScreen
        </Text>
        <Button onPress={() => takePhoto()}>Tomar foto</Button>
      </Flex>
      <Modal 
        size="lg"
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}>
        <Modal.Content minHeight="30%">
          <Modal.CloseButton />
          <Modal.Header>Participa</Modal.Header>
          <Modal.Body>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button 
                variant="ghost" 
                colorScheme="blueGray" 
                onPress={() => setPhotoModalOpen(false)}>
                Cancelar
              </Button>
              <Button onPress={() => takePhoto()}>
                Continuar
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Flex>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
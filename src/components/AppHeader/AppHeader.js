import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { DrawerActions } from "@react-navigation/native";

import IMG from 'assets/img';

import { SAFE_AREA_PADDING } from '../../constants/constants';

const TAG = 'AppHeader';

export default function AppHeader({ navigation }) {

  const openMenu = useCallback(() => {
    console.log(`===== ${TAG}:openMenu =====`);
    if (navigation) {
      navigation.dispatch(DrawerActions.toggleDrawer())
    }
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
        <Image source={IMG.iconoMenu} />
      </TouchableOpacity>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: SAFE_AREA_PADDING.paddingTop + 10,
    justifyContent: 'flex-start',
    paddingBottom: 20,
    paddingStart: 20
  },
  menuButton: {
    //paddingBottom: 10
  }
});
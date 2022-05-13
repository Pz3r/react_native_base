import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import i18n from 'i18n-js';

import { SAFE_AREA_PADDING } from '../../constants/constants';
import { NAVIGATION_PRIVACY_NOTICE_STACK } from '../../navigation/constants';

const TAG = 'AppDrawer';

export default function AppDrawer(props) {

  return (
    <DrawerContentScrollView backgroundColor="#1d1d1d" contentContainerStyle={styles.container} {...props}>
      <DrawerItem 
        style={styles.drawerItemView} 
        labelStyle={styles.drawerItemText} 
        label={i18n.t('drawer_item_privacy')} 
        onPress={() => props.navigation.navigate(NAVIGATION_PRIVACY_NOTICE_STACK)} />
    </DrawerContentScrollView>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d1d',
    paddingTop: SAFE_AREA_PADDING.paddingTop + 40,
  },
  drawerItemView: {
    //paddingBottom: 10
    borderColor: '#2a5a40',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    paddingHorizontal: 10
  },
  drawerItemText: { 
    color: '#fff',
    fontFamily: 'Inter-Medium',
  }
});
import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import i18n from 'i18n-js';

import { NAVIGATION_HOME_STACK, NAVIGATION_MAP_STACK, NAVIGATION_FAQ_STACK, NAVIGATION_PROFILE_STACK } from '../../navigation/constants';

export default function AppFooterTab({ route, active, imgActive, imgInactive, noText }) {

  console.log(`===== AppFooterTab ${route} =====`)

  const ROUTE_NAME_MAP = {
    [NAVIGATION_HOME_STACK]: { text: i18n.t('section_name_home') },    
    [NAVIGATION_MAP_STACK]: { text: i18n.t('section_name_map') },
    [NAVIGATION_FAQ_STACK]: { text: i18n.t('section_name_faq') },
    [NAVIGATION_PROFILE_STACK]: { text: i18n.t('section_name_profile') },
  }

  if (noText && imgActive && imgInactive) {
    return (
      <View style={[styles.container, { paddingBottom: 5 }]}>
        <Image source={active ? imgActive : imgInactive} />
      </View>
    )
  } else if (imgActive && imgInactive) {
    return (
      <View style={styles.container}>
        <Image source={active ? imgActive : imgInactive} />
        <Text style={active ? styles.textActive : styles.textInactive}>{ROUTE_NAME_MAP[route].text}</Text>
      </View>
    )
  } else return (
    <View style={styles.container}>
      <Text style={active ? styles.textActive : styles.textInactive}>{ROUTE_NAME_MAP[route].text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  textActive: {
    fontSize: 9,
    color: '#EA4B79',
    marginTop: 3
  },
  textInactive: {
    fontSize: 9,
    color: '#636363',
    marginTop: 3
  }
})
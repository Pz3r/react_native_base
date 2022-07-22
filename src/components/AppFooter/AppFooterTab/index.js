import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import i18n from 'i18n-js';

import { SECTION_ABOUT_STACK, SECTION_GUIDE_STACK, SECTION_HALLS_STACK } from '../../../navigation/constants';

export default function AppFooterTab({ route, active, imgActive, imgInactive, noText }) {

  const ROUTE_NAME_MAP = {
    [SECTION_ABOUT_STACK]: { text: i18n.t('section_about_tab_name') },    
    [SECTION_GUIDE_STACK]: { text: i18n.t('section_guide_tab_name') },
    [SECTION_HALLS_STACK]: { text: i18n.t('section_halls_tab_name') },
  }

  if (noText && imgActive && imgInactive) {
    return (
      <View style={[styles.container, { paddingBottom: 5 }]}>
        <Image source={active ? imgActive : imgInactive} />
      </View>
    )
  } else if (imgActive && imgInactive) {
    return (
      <View style={[styles.container, active ? styles.backgroundActive : styles.backgroundInactive]}>
        <Image source={active ? imgActive : imgInactive} />
        <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}>{ROUTE_NAME_MAP[route].text}</Text>
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
  text: {
    fontSize: 9,
    marginTop: 3,
    fontFamily: 'Arvo_700Bold',
  },
  textActive: {
    color: '#D8A526',
  },
  backgroundActive: {
    backgroundColor: 'rgba(216, 165, 38, 0.3)'
  },
  backgroundInactive: {

  },
  textInactive: {
    color: '#90660B',
  }
});
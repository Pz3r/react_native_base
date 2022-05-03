import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NAVIGATION_HOME_STACK, NAVIGATION_MAP_STACK, NAVIGATION_FAQ_STACK, NAVIGATION_PROFILE_STACK } from '../../navigation/constants';

import IMG from 'assets/img';

import AppFooterTab from './AppFooterTab';

export default function AppFooter({ state, navigation }) {

  console.log(JSON.stringify(state.routes));

  const getImageForRoute = (route) => {
    let image = {};
    switch (route.name) {
      case (NAVIGATION_HOME_STACK):
        image.active = IMG.iconoInicioPrendido;
        image.inactive = IMG.iconoInicioApagado;
        break;
      case (NAVIGATION_MAP_STACK):
        image.active = IMG.iconoPlanoPrendido;
        image.inactive = IMG.iconoPlanoApagado;
        break;
      case (NAVIGATION_FAQ_STACK):
        image.active = IMG.iconoFaqsPrendido;
        image.inactive = IMG.iconoFaqsApagado;
        break;
      case (NAVIGATION_PROFILE_STACK):
        image.active = IMG.iconoPerfilPrendido;
        image.inactive = IMG.iconoPerfilApagado;
        break;
    }
    return image;
  }

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }

        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const image = getImageForRoute(route);

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}>

            <AppFooterTab
              imgActive={image.active}
              imgInactive={image.inactive}
              noText={false}
              active={isFocused}
              route={route.name} />

          </TouchableOpacity>
        );
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#1d1d1d',
    flexDirection: 'row',
  },
  bgImage: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f00'
  }
});
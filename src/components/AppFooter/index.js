import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { SECTION_ABOUT_STACK, SECTION_GUIDE_STACK, SECTION_HALLS_STACK } from '../../navigation/constants';
import AppFooterTab from './AppFooterTab';
import IMG from 'assets/img';

export default function AppFooter({ state, navigation }) {

  console.log(JSON.stringify(state.routes));

  const getImageForRoute = (route) => {
    let image = {};
    switch (route.name) {
      case (SECTION_ABOUT_STACK):
        image.active = IMG.iconAboutOn;
        image.inactive = IMG.iconAboutOff;
        break;
      case (SECTION_GUIDE_STACK):
        image.active = IMG.iconGuideOn;
        image.inactive = IMG.iconGuideOff;
        break;
      case (SECTION_HALLS_STACK):
        image.active = IMG.iconHallsOn;
        image.inactive = IMG.iconHallsOff;
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
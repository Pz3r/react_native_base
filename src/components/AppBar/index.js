import React from 'react';
import {StyleSheet, Text, StatusBar, View} from 'react-native';
import {HStack, Button, Box} from 'native-base';
import Svg, {Path} from 'react-native-svg';
import i18n from 'i18n-js';

const AppBar = ({goBack, goToIndexScreen, index, lastIndex}) => {
  return (
    <>
      <StatusBar bg="#3700B3" barStyle="light-content" />
      <HStack
        px="1"
        py="7"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        style={styles.container}>
        <Button onPress={() => goBack()} style={styles.btn} variant="ghost">
          <Svg width="20" height="30" viewBox="0 0 13 25" style={styles.arrow}>
            <Path
              d="M-5.46392e-07 12.5C-5.02265e-07 11.4905 0.408256 10.481 1.20965 9.71661L11.0683 0.313672C11.5068 -0.104557 12.2326 -0.104557 12.6711 0.313672C13.1096 0.731901 13.1096 1.42414 12.6711 1.84237L2.81244 11.2453C2.08665 11.9376 2.08665 13.0624 2.81244 13.7547L12.6711 23.1576C13.1096 23.5759 13.1096 24.2681 12.6711 24.6863C12.2326 25.1046 11.5068 25.1046 11.0683 24.6863L1.20965 15.2834C0.408256 14.519 -5.9052e-07 13.5095 -5.46392e-07 12.5Z"
              fill="#D8A526"
            />
          </Svg>
          <Text style={styles.btnLabel}>{i18n.t('appbar_back_btn')}</Text>
        </Button>
        <View style={styles.btnsGroup}>
          <Button
            style={styles.btn}
            isDisabled={index === 0}
            onPress={() => goToIndexScreen(index - 1)}
            variant="ghost">
            <Svg
              width="34"
              height="30"
              viewBox="0 0 25 13"
              style={styles.arrow}>
              <Path
                d="M12.5 -1.09278e-06C13.5095 -1.00453e-06 14.519 0.408256 15.2834 1.20965L24.6863 11.0683C25.1046 11.5068 25.1046 12.2326 24.6863 12.6711C24.2681 13.1096 23.5759 13.1096 23.1576 12.6711L13.7547 2.81244C13.0624 2.08665 11.9376 2.08665 11.2453 2.81244L1.84237 12.6711C1.42414 13.1096 0.731901 13.1096 0.313673 12.6711C-0.104557 12.2326 -0.104557 11.5068 0.313673 11.0683L9.71661 1.20965C10.481 0.408255 11.4905 -1.18104e-06 12.5 -1.09278e-06Z"
                fill="#D8A526"
              />
            </Svg>
            <Text style={styles.btnLabel}>Previous</Text>
          </Button>
          <Button
            style={styles.btn}
            isDisabled={lastIndex === index}
            onPress={() => goToIndexScreen(index + 1)}
            variant="ghost">
            <Svg
              width="33"
              height="30"
              viewBox="0 0 25 13"
              style={styles.arrow}>
              <Path
                d="M12.5 13C11.4905 13 10.481 12.5917 9.71661 11.7903L0.313672 1.93167C-0.104557 1.49317 -0.104557 0.767374 0.313672 0.328875C0.731901 -0.109625 1.42414 -0.109625 1.84237 0.328875L11.2453 10.1876C11.9376 10.9133 13.0624 10.9133 13.7547 10.1876L23.1576 0.328876C23.5759 -0.109624 24.2681 -0.109624 24.6863 0.328876C25.1046 0.767376 25.1046 1.49317 24.6863 1.93167L15.2834 11.7903C14.519 12.5917 13.5095 13 12.5 13Z"
                fill="#D8A526"
              />
            </Svg>
            <Text style={styles.btnLabel}>Next </Text>
          </Button>
        </View>
      </HStack>
    </>
  );
};

const styles = StyleSheet.create({
  btnsGroup: {
    flexDirection: 'row',
    marginRight: 10,
  },
  btn: {
    width: 80,
    justifyContent: 'center',
  },
  btnLabel: {
    color: '#D8A526',
    paddingTop: 15,
    borderColor: '#ffffff',
    fontSize: 12,
  },
  arrow: {
    left: 5,
    top: 5,
  },
});

export default AppBar;

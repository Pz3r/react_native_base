import React, { useState, useCallback } from 'react';
import { StyleSheet, Image, ImageBackground, View, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import Accordion from 'react-native-collapsible/Accordion';
import ParsedText from 'react-native-parsed-text';
import i18n from 'i18n-js';

import IMG from 'assets/img';

import AppHeader from '../../../components/AppHeader/AppHeader';
import FAQ from '../../../data/faq';

const TAG = 'FaqHomeScreen';

function FaqHomeScreen({ navigation }) {
  const [activeSections, setActiveSections] = useState([0]);

  renderHeader = (item, index, isActive, section) => {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2a5a40'
      }}>
        <Text style={{ flex: 3, fontFamily: 'Inter-SemiBold', fontWeight: 'bold', color: '#ffffff', fontSize: 16, paddingEnd: 10 }}>
          {i18n.t(item.title)}
        </Text>
        {isActive
          ? <Image source={IMG.flechaArriba} />
          : <Image source={IMG.flechaAbajo} />}
      </View>
    );
  };

  renderContent = (item) => {
    return (
      <>
        <ParsedText
          style={{
            color: '#ffffff',
            fontSize: 16,
            fontFamily: 'Inter-Regular',
            paddingTop: 13,
            paddingBottom: 29,
            textAlign: 'left'
          }}>
          {i18n.t(item.content)}
        </ParsedText>
        {item.link &&
          <Pressable
            onPress={() => Linking.openURL('https://' + i18n.t(item.link))}>
            <Text style={styles.link}>{i18n.t(item.link)}</Text>
          </Pressable>
        }
      </>
    );
  };

  updateSections = () => {

  };

  renderSectionTitle = () => {

  };

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <ScrollView
        contentContainerStyle={styles.container}>
        <AppHeader navigation={navigation} />
        <Text style={styles.title}>{i18n.t('text_faq_title')}</Text>
        <View style={{ paddingHorizontal: 20, paddingTop: 34 }}>
          <Accordion
            activeSections={activeSections}
            sections={FAQ}
            touchableComponent={TouchableOpacity}
            renderSectionTitle={renderSectionTitle}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={(sections) => {
              console.log(`===== ${TAG}:FaqHomeScreen =====`);
              console.log(JSON.stringify(sections));
              setActiveSections(sections.includes(undefined) ? [] : sections);
            }}
            renderAsFlatList={false}
            expandMultiple={true}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  )

}

const styles = StyleSheet.create({
  container: {
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'OperaBlackOblique',
    color: '#f63440',
    fontSize: 35,
    lineHeight: 37,
    paddingTop: 10,
    alignSelf: 'flex-start',
    paddingStart: 20
  },
});

export default FaqHomeScreen;
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Pressable, ScrollView, Linking } from 'react-native';
import { Button, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import i18n from 'i18n-js';

import FadeInView from '../../../../components/FadeInView';
import GUIDE from '../../data/guide';

const STANDBY = {
  id: 'standby',
  art: [
    {
      index: 0,
      //image: require('../../assets/img/img_standby_1.png')
    },
    {
      index: 1,
      //image: require('../../assets/img/img_standby_2.png')
    },
    {
      index: 2,
      //image: require('../../assets/img/img_standby_3.png')
    },
    {
      index: 3,
      //image: require('../../assets/img/img_standby_4.png')
    },
  ]
}

export default function Showcase({ timestamp, isLoop, message }) {
  const navigation = useNavigation();
  const [group, setGroup] = useState();

  useEffect(() => {
    console.log(`===== Showcase useEffect timestamp: ${timestamp}/${isLoop}/${message}`)
    if (isLoop) {
      if (message === 'x') {
        setGroup({ id: 'lobby' })
      } else if (message === 'y') {
        setGroup(STANDBY)
      } else if (message === 'z') {
        setGroup({ id: 'logos' })
      }
    } else if (timestamp) {
      for (let i = 0; i < GUIDE.length; i++) {
        if (GUIDE[i].start <= timestamp) {
          setGroup(GUIDE[i]);
        } else {
          break;
        }
      }
    }
  }, [timestamp, message]);

  const render4 = (images, id) => {
    return (
      <FadeInView style={styles.paintingContainer2}>

        <View style={styles.paintingContainer3}>
          <Pressable
            //onPress={() => navigation.navigate(NAVIGATION_DETAIL, { index: images[0].index, hideControls: true })}
            style={{ marginRight: 3 }}>
            <Image
              style={styles.image}
              source={images[0].image} />
          </Pressable>
          <Pressable
            //onPress={() => navigation.navigate(NAVIGATION_DETAIL, { index: images[1].index, hideControls: true })}
            style={{ marginLeft: 3 }}>
            <Image
              style={styles.image}
              source={images[1].image} />
          </Pressable>
        </View>

        <View style={styles.paintingContainer3}>
          <Pressable
            //onPress={() => navigation.navigate(NAVIGATION_DETAIL, { index: images[2].index, hideControls: true })}
            style={{ marginRight: 3 }}>
            <Image
              style={styles.image}
              source={images[2].image} />
          </Pressable>

          <Pressable
            //onPress={() => navigation.navigate(NAVIGATION_DETAIL, { index: images[3].index, hideControls: true })}
            style={{ marginLeft: 3 }}>
            <Image
              style={styles.image}
              source={images[3].image} />
          </Pressable>
        </View>

      </FadeInView>
    )
  };

  const render3 = (images, id) => {
    return (
      <FadeInView style={styles.paintingContainer2}>

        <View style={styles.paintingContainer3}>
          <Pressable
            //onPress={() => navigation.navigate(NAVIGATION_DETAIL, { index: images[0].index, hideControls: true })}
            style={{ marginRight: 3 }}>
            <Image
              style={styles.image}
              source={images[0].image} />
          </Pressable>
          <Pressable
            //onPress={() => navigation.navigate(NAVIGATION_DETAIL, { index: images[1].index, hideControls: true })}
            style={{ marginLeft: 3 }}>
            <Image
              style={styles.image}
              source={images[1].image} />
          </Pressable>
        </View>

        <View style={styles.paintingContainer3}>
          <Pressable
            //onPress={() => navigation.navigate(NAVIGATION_DETAIL, { index: images[2].index, hideControls: true })}
            style={{ marginRight: 3 }}>
            <Image
              style={styles.image}
              source={images[2].image} />
          </Pressable>
        </View>

      </FadeInView>
    )
  };

  const render2 = (images, id) => {
    return (

      <FadeInView style={styles.paintingContainerSpecial}>
        <Pressable
          //onPress={() => navigation.navigate(NAVIGATION_DETAIL, { index: images[0].index, hideControls: true })}
          style={{ marginRight: 3 }}>
          <Image
            style={styles.imageSpecial}
            source={images[0].image} />
        </Pressable>
        <Pressable
          //onPress={() => navigation.navigate(NAVIGATION_DETAIL, { index: images[1].index, hideControls: true })}
          style={{ marginLeft: 3 }}>
          <Image
            style={styles.imageSpecial}
            source={images[1].image} />
        </Pressable>
      </FadeInView>
    )
  };

  const render1 = (images, id) => {
    return (
      <FadeInView
        style={styles.paintingContainer2}>

        <Pressable
          //onPress={() => navigation.navigate(NAVIGATION_DETAIL, { index: images[0].index, hideControls: true })}
          style={{ flex: 1 }}>
          <Image
            style={styles.image}
            source={images[0].image} />
        </Pressable>

      </FadeInView>
    )
  };

  const renderGroup = (locale) => {
    if (group) {
      if (group.art.length === 1) {
        return render1(group.art, group.id);
      } else if (group.art.length === 2) {
        return render2(group.art, group.id);
      } else if (group.art.length === 3) {
        return render3(group.art, group.id);
      } else if (group.art.length === 4) {
        return render4(group.art, group.id);
      }
    }
  }

  if (group && group.art) {
    return (
      <View key={group ? group.id : ''} style={styles.animatedContainer}>
        <Text
          style={styles.title}>
          {i18n.t('guide_title')}
        </Text>
        {renderGroup()}
      </View>
    )
  } else if (group && group.text) {
    return (
      <View key={group ? group.id : ''} style={[styles.animatedContainer, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 42.7 }]}>
        <FadeInView>
          <Text
            style={styles.subtitle}>
            {i18n.t(group.text)}
          </Text>
        </FadeInView>
      </View>
    )
  } else if (group && group.cover) {
    return (
      <ScrollView key={group ? group.id : ''} style={styles.animatedContainer}>
        <FadeInView>
          <Text
            style={{ color: '#959290', fontSize: 20, lineHeight: 58, fontFamily: 'Arvo_400Regular', paddingHorizontal: 24 }}>
            {i18n.t(group.name).toUpperCase()}
          </Text>
          <Text
            style={{ color: '#D8A526', fontSize: 35, lineHeight: 35, fontFamily: 'Arvo_700Bold', paddingHorizontal: 24, paddingBottom: 24 }}>
            {i18n.t(group.title)}
          </Text>
          <Text
            style={{ color: '#ffffff', fontSize: 14, lineHeight: 21, fontFamily: 'Arvo_400Regular', paddingHorizontal: 24 }}>
            {i18n.t(group.description)}
          </Text>
          <Image style={{ width: '100%', marginTop: 15 }} source={group.cover} />
        </FadeInView>
      </ScrollView>
    )
  } else {
    return (
      <View key={group ? group.id : ''} style={styles.animatedContainer}></View>
    )
  }
}

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1
  },
  paintingContainer2: {
    flex: 1,
    paddingTop: 19,
    paddingHorizontal: 13,
    paddingBottom: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paintingContainer3: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 13,
    paddingBottom: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paintingContainerSpecial: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContainer: {
    flex: 1
  },
  cardContainerV: {
    flex: 1,
    marginRight: 7
  },
  cardContainerH: {
    paddingBottom: 7,
    backgroundColor: '#00f'
  },
  image: {
    resizeMode: 'cover',
    height: "100%",
    flex: 1,
    borderRadius: 8
  },
  imageSpecial: {
    resizeMode: 'cover',
  },
  space: {
    height: 5.3
  },
  title: {
    fontFamily: 'Arvo_400Regular',
    color: '#eeeeee',
    fontSize: 16,
    marginHorizontal: 27,
    textAlign: 'center'
  },
  highlightText: {
    fontFamily: 'Arvo_700Bold',
  },
  subtitle: {
    fontFamily: 'Arvo_400Regular',
    fontSize: 16,
    color: '#eeeeee',
    marginBottom: 18.3
  },
  standbyTitle: {
    fontFamily: 'Arvo_400Regular',
    fontSize: 16,
    textAlign: 'center',
    color: '#f0e9d9'
  },
  endTitle: {
    fontFamily: 'Arvo_700Bold',
    fontSize: 26.7,
    textAlign: 'center',
    color: '#f0e9d9'
  },
  endLine: {
    height: 2,
    backgroundColor: '#e4624d',
    width: 120,
    alignSelf: 'center',
    marginVertical: 37
  },
  endText: {
    fontFamily: 'Arvo_400Regular',
    fontSize: 16,
    textAlign: 'center',
    color: '#f0e9d9'
  },
  endButton: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#e4624d',
    marginTop: 40
  },
  endButtonText: {
    color: '#eeeeee',
    fontFamily: 'Jost_700Bold',
    fontSize: 16,
    textAlign: 'center',
  },
  rateButton: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  separateText: {
    fontSize: 13.3,
    color: '#eeeeee',
    fontFamily: 'Arvo_400Regular',
    marginTop: 20
  },
  rateText: {
    fontSize: 13.3,
    color: '#eeeeee',
    fontFamily: 'Arvo_400Regular',
    textDecorationLine: 'underline'
  },
});
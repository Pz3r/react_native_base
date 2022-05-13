import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  DeviceEventEmitter,
  PermissionsAndroid
} from 'react-native';
import Kontakt from 'react-native-kontaktio';

const {
  connect,
  configure,
  disconnect,
  isConnected,
  startScanning,
  stopScanning,
  restartScanning,
  isScanning,
  // setBeaconRegion,
  setBeaconRegions,
  getBeaconRegions,
  setEddystoneNamespace,
  IBEACON,
  EDDYSTONE,
  SECURE_PROFILE,
  // Configurations
  scanMode,
  scanPeriod,
  activityCheckConfiguration,
  forceScanConfiguration,
  monitoringEnabled,
  monitoringSyncInterval,
} = Kontakt;

const region1 = {
  identifier: 'Test beacons 1',
  uuid: 'B0702880-A295-A8AB-F734-031A98A512D3',
  major: 1,
  // no minor provided: will detect all minors
};

const region2 = {
  identifier: 'Test beacons 2',
  uuid: 'B0702880-A295-A8AB-F734-031A98A512D3',
  major: 2,
  // no minor provided: will detect all minors
};
const isAndroid = Platform.OS === 'android';

/**
 * Android Marshmallow (6.0) and above need to ask the user to grant certain permissions.
 * This function does just that.
 */
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Location Permission',
        message:
          'This example app needs to access your location in order to use bluetooth beacons.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      // permission denied
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};
const BEACONS_API_KEY = 'iGBmFNpEMuMJNJCQCxQCxIvKOniojBIz'

const beaconSetup = async () => {
  if (isAndroid) {
    // Android
    const granted = await requestLocationPermission();
    if (granted) {
      await connect(BEACONS_API_KEY, [IBEACON,SECURE_PROFILE])
        .catch((error) => console.log('error connect', error));

      await configure({
        monitoringEnabled: monitoringEnabled.TRUE,
      })
      await startScanning()
        .then(() => console.log('scanning statrted'))
        .catch((err) => console.log('startScanning', err));
    } else {
      Alert.alert(
        'Permission error',
        'Location permission not granted. Cannot scan for beacons',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  } else {
    // iOS
    console.log('IOS');
    await init();
    await startDiscovery();
  }
};


const MinimalExample = () => {
  const [beacons, setBecons] = useState([]);
  useEffect(() => {
    beaconSetup()
    DeviceEventEmitter.addListener(
      'profileDidUpdate',
      ({
        profile,
        region,
      }) => {
          setBecons(profile.map(i => i.uniqueId))
        console.log('profileDidUpdate', profile[0].uniqueId);
      }
    );

    DeviceEventEmitter.addListener(
      'profileDidDisappear',
      ({
        profile,
        region,
      }) => {
        const beaconIndex = beacons.indexOf(profile.uniqueId)
        console.log('beaconIndex', beaconIndex);
        console.log('profileDidDisappear', profile.uniqueId)

        setBecons(beacons.filter(o => o !== profile.uniqueId))

      }
    );

    return () => {
      disconnect()
      DeviceEventEmitter.removeAllListeners();
    }
  }, [])

  return (
    <View style={styles.container}>
      {
        beacons.map(item => (
          <View>
            <Text>{ item }</Text>
          </View>
        ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20, // statusbarHeight
  },
  beacon: {
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    borderRadius: 10,
  },
});

export default MinimalExample
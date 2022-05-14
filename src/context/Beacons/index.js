import React, { useContext, createContext, useEffect } from "react"
import { Alert, PermissionsAndroid, DeviceEventEmitter, NativeEventEmitter } from 'react-native'
import Kontakt, { KontaktModule } from 'react-native-kontaktio'

const {
  init,
  connect,
  configure,
  startScanning,
  startDiscovery,
  disconnect,
  IBEACON,
  SECURE_PROFILE,
  // Configurations
  monitoringEnabled,
  requestAlwaysAuthorization,
} = Kontakt
// import discovery from "./discovery"
export const BeaconsContext = createContext()
export const useBeacons = () => useContext(BeaconsContext)

const isAndroid = Platform.OS === 'android'
const kontaktEmitter = new NativeEventEmitter(KontaktModule)
const BEACONS_API_KEY = 'iGBmFNpEMuMJNJCQCxQCxIvKOniojBIz';
const accessBeacons = ['11o104Vd', '11o404yC', '11oB00Zo', '11oD00Zq']
const exitBeacons = ['11oG00Zt', '11oo04xx', '11ou04y2', '11oz04y7']

console.log('[BEACONS_API_KEY]', BEACONS_API_KEY);

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
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true
    } else {
      // permission denied
      return false
    }
  } catch (err) {
    console.warn(err)
    return false
  }
}

const _requestAlwaysAuthorization = () => {
  requestAlwaysAuthorization()
    .then(() => console.log('[IOS Kontakt] requested always authorization'))
    .catch((error) => console.log('[requestAlwaysAuthorization]', error));
};

const beaconSetup = async () => {
  if (isAndroid) {
    // Android
    const granted = await requestLocationPermission()
    if (granted) {
      await connect(BEACONS_API_KEY, [IBEACON,SECURE_PROFILE])
        .catch((error) => console.log('error connect', error))

      await configure({
        monitoringEnabled: monitoringEnabled.TRUE,
      })
      await startScanning()
        .then(() => console.log('scanning statrted'))
        .catch((err) => console.log('startScanning', err))
    } else {
      Alert.alert(
        'Permission error',
        'Location permission not granted. Cannot scan for beacons',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      )
    }
  } else {
    // iOS
    console.log('[IOS Kontakt] beaconSetup')
    await init(BEACONS_API_KEY)
      .then(() => configure({ dropEmptyRanges: true, connectNearbyBeacons: true }))
      .then(() => _requestAlwaysAuthorization())
      .then(() => console.log('[IOS Kontakt] Successfully initialized beacon ranging, monitoring and scanning'))
      .catch((error) => console.log('[IOS Kontakt] error', error))

    await startDiscovery({ interval: 1000 })
      .then(() => console.log('[IOS Kontakt] started discovery'))
      .catch((error) => console.log('[IOS Kontakt] startDiscovery error', error));
  }
}

const deviceDetected = (beacons) => {
  // Access beacons
  const accessBeaconsFound = beacons.filter(o => accessBeacons.includes(o.name)).length
  if(accessBeaconsFound > 0) {
    console.log('Update user schedule');
  }
  // Exit beacons
  const exitBeaconsFound = beacons.filter(o => exitBeacons.includes(o.name)).length
  if(exitBeaconsFound > 0) {
    console.log('show push notification');
  }
}

export const BeaconsProvider = ({ children }) => {
  useEffect(() => {
    beaconSetup()

    // Android
    DeviceEventEmitter.addListener(
      'profileDidUpdate',
      ({ profile }) => {
        console.log('[Android Kontakt] profileDidUpdate', profile.map(i => i.uniqueId))
        deviceDetected(profile)
      }
    )

    // IOS
    const discoverSubscription = kontaktEmitter.addListener(
      'didDiscoverDevices',
      ({ beacons }) => {
        console.log('[IOS Kontakt] didDiscoverDevices', beacons.map(o => o.name))
        deviceDetected(beacons)
      }
    )


    return () => {
      if (isAndroid) {
        disconnect()
      }

      DeviceEventEmitter.removeAllListeners()
      discoverSubscription.remove()
    }
  }, [])

  return (
    <BeaconsContext.Provider>{children}</BeaconsContext.Provider>
  )
}
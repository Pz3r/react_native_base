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
  // monitoring
  startMonitoringForRegion,
  stopMonitoringForRegion,
} = Kontakt
// import discovery from "./discovery"
export const BeaconsContext = createContext()
export const useBeacons = () => useContext(BeaconsContext)

const BEACONS_API_KEY = 'iGBmFNpEMuMJNJCQCxQCxIvKOniojBIz'
const isAndroid = Platform.OS === 'android'
const kontaktEmitter = new NativeEventEmitter(KontaktModule)

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

    await startDiscovery()
      .then(() => console.log('[IOS Kontakt] started discovery'))
      .catch((error) => console.log('[IOS Kontakt] startDiscovery error', error));
  }
}

export const BeaconsProvider = ({ children }) => {
  const discovery = { test: 'test' }
  useEffect(() => {
    beaconSetup()

    // Android
    DeviceEventEmitter.addListener('beaconsDidUpdate',({ beacons }) => {
        console.log('[Android Kontakt] beaconsDidUpdate', beacons)
      }
    )

    DeviceEventEmitter.addListener('profileDidAppear',({ profile }) => {
        console.log('[Android Kontakt] profileDidAppear', profile.uniqueId)
      }
    )

    DeviceEventEmitter.addListener('profileDidDisappear',({ profile }) => {
        console.log('[Android Kontakt] profileDidDisappear', profile.uniqueId)
      }
    )

    // IOS
    const discoverSubscription = kontaktEmitter.addListener(
      'didDiscoverDevices',
      ({ beacons }) => {
        console.log('[IOS Kontakt] didDiscoverDevices', beacons.map(o => o.name))
      }
    )

    const discoverFailSubscription = kontaktEmitter.addListener(
      'discoveryDidFail',
      ({ error }) => console.log('[IOS Kontakt] discoveryDidFail', error)
    )

    return () => {
      if (isAndroid) {
        disconnect()
      }

      DeviceEventEmitter.removeAllListeners()
      discoverSubscription.remove()
      discoverFailSubscription.remove()
    }
  }, [])

  return (
    <BeaconsContext.Provider value={ discovery }>{children}</BeaconsContext.Provider>
  )
}
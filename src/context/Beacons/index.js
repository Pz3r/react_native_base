import React, { useContext, createContext, useEffect } from "react"
import { Alert, PermissionsAndroid, DeviceEventEmitter, NativeEventEmitter } from 'react-native'
import Kontakt, { KontaktModule } from 'react-native-kontaktio'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINT_POST_DATE_URL } from "../../utils/endpoints"
import getCurrentDatetimeAsString from './helpers/getCurrentDatetimeAsString'
import schedulePushNotification from "./helpers/schedulePushNotification";

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

export const BeaconsContext = createContext()
export const useBeacons = () => useContext(BeaconsContext)


const isAndroid = Platform.OS === 'android'
const kontaktEmitter = new NativeEventEmitter(KontaktModule)
const BEACONS_API_KEY = 'iGBmFNpEMuMJNJCQCxQCxIvKOniojBIz'
const accessBeacons = ['11oz04y7', '11oD00Zq', '11ou04y2', '11oo04xx']
const exitBeacons = ['11oB00Zo', '11o404yC', '11o104Vd', '11oG00Zt']
const STORAGE_UUID = 'STORAGE_UUID';

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
    .catch((error) => console.log('[requestAlwaysAuthorization]', error))
}

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
      .catch((error) => console.log('[IOS Kontakt] startDiscovery error', error))
  }
}

const storeOne = async () => {
  const now = getCurrentDatetimeAsString()
  const storedDate = await AsyncStorage.getItem('SYNC_FORMATTED_DATE');

  if (storedDate !== now.date) {
    const storeId = await AsyncStorage.getItem(STORAGE_UUID)
    const schedule = now.date + now.time;

    if (storeId && schedule) {
      const headers = { Accept: 'application/json', 'Content-Type': 'application/json' }
      const body = JSON.stringify({ storeId, schedule, eventType: 'beacon' })

      fetch(ENDPOINT_POST_DATE_URL, { method: 'POST', headers, body })
        .then(async (response) => {
          console.log(`[ BeaconsProvider ] response ${response.status}`)
          await AsyncStorage.setItem('SYNC_FORMATTED_DATE', now.date)
          await AsyncStorage.setItem('SYNC_FORMATTED_TIME', now.time)
        }).catch((error) => {
          console.log(`[ BeaconsProvider ] QuietProvider error ${error}`)
        })
    } else {
      console.log(`[ BeaconsProvider ] NO SEND (INNER) storeId: ${storeId} schedule: ${schedule}`)
    }
  } else {
    console.log(`[ BeaconsProvider ] NO SEND (OUTTER) storedDate: ${storedDate} formattedDate: ${now.date}`)
  }
}

const deviceDetected = (beacons) => {
  // Access beacons
  const accessBeaconsFound = beacons.filter(o => accessBeacons.includes(o.name)).length
  if(accessBeaconsFound > 0) {
    storeOne()
    console.log('Update user schedule')
  }
  // Exit beacons
  const exitBeaconsFound = beacons.filter(o => exitBeacons.includes(o.name)).length
  if(exitBeaconsFound > 0) {
    console.log('show push notification')
    schedulePushNotification()
  }
}

export const BeaconsProvider = ({ children }) => {
  useEffect(() => {
    beaconSetup()

    // setInterval(() => {
    //   schedulePushNotification()
    // }, 1000);

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
    <BeaconsContext.Provider value={{}}>{children}</BeaconsContext.Provider>
  )
}
import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  NativeEventEmitter,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import Kontakt, {KontaktModule} from 'react-native-kontaktio';
const {
  init,
  configure,
  // authorization
  getAuthorizationStatus,
  requestWhenInUseAuthorization,
  requestAlwaysAuthorization,
  // discovery
  startDiscovery,
  stopDiscovery,
  restartDiscovery,
  // ranging
  startRangingBeaconsInRegion,
  stopRangingBeaconsInRegion,
  stopRangingBeaconsInAllRegions,
  getRangedRegions,
  // monitoring
  startMonitoringForRegion,
  stopMonitoringForRegion,
  stopMonitoringForAllRegions,
  getMonitoredRegions,
} = Kontakt;

const kontaktEmitter = new NativeEventEmitter(KontaktModule);
const BEACONS_API_KEY = 'iGBmFNpEMuMJNJCQCxQCxIvKOniojBIz'
const isAndroid = Platform.OS === 'android';
const region1 = {
  identifier: 'Test beacons 1',
  uuid: 'B0702880-A295-A8AB-F734-031A98A512DE',
  major: 1,
  // no minor provided: will detect all minors
};

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


/* --- Authorization --- */

const _getAuthorizationStatus = () => {
  getAuthorizationStatus()
    .then((authorizationStatus) => {
      Alert.alert(`Authorization status: ${authorizationStatus}`);
      console.log(`Authorization status: ${authorizationStatus}`);
    })
    .catch((error) => console.log('[getAuthorizationStatus]', error));
};

const _requestAlwaysAuthorization = () => {
  requestAlwaysAuthorization()
    .then(() => console.log('requested always authorization'))
    .catch((error) => console.log('[requestAlwaysAuthorization]', error));
};

const _requestWhenInUseAuthorization = () => {
  requestWhenInUseAuthorization()
    .then(() => console.log('requested when in use authorization'))
    .catch((error) => console.log('[requestWhenInUseAuthorization]', error));
};

const beaconSetup = async (setBeaconsArr) => {
  if (isAndroid) {
    // Android
    const granted = await requestLocationPermission();
    if (granted) {
      await connect();
      await startScanning();
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
    init(BEACONS_API_KEY)
      .then(() => configure({ dropEmptyRanges: true, invalidationAge: 5000, connectNearbyBeacons: true }))
      .then(() => _requestAlwaysAuthorization())
      .then(() => console.log('Successfully initialized beacon ranging, monitoring and scanning'))
      .catch((error) => console.log('error', error));
    await startDiscovery();
  }

  // Add beacon listener
  if (isAndroid) {
    DeviceEventEmitter.addListener('beaconsDidUpdate', ({beacons, region}) => {
      console.log('beaconsDidUpdate', beacons, region);
    });
  } else {

  }
};

/**
 * Helper function used to identify equal regions
 */
const _isIdenticalRegion = (r1, r2) => r1.identifier === r2.identifier;


export default Beacons = () => {
  const [discoveredBeacons, setDiscoveredBeacons] = useState([])
  const [authorizationStatus, setAuthorizationStatus] = useState('')
  const [monitoredRegionsCloseBy, setMonitoredRegionsCloseBy] = useState([])
  const [rangedBeacons, setRangedBeacons] = useState([])
  const [scanning, setScanning] = useState(false)
  const [ranging, setRanging] = useState(false)
  const [monitoring, setMonitoring] =  useState(false)
  const [rangedRegions, setRangedRegions] =  useState([])
  const [monitoredRegions, setMonitoredRegions] =  useState([])

  useEffect(() => {
    beaconSetup();

     // Monitoring events
    const startMonitoringSubscription = kontaktEmitter.addListener(
      'didStartMonitoringForRegion',
      ({ region }) => {
        console.log('didStartMonitoringForRegion', region);
      }
    );

    const monitoringFailSubscription = kontaktEmitter.addListener(
      'monitoringDidFailForRegion',
      ({ region, error }) =>
        console.log('monitoringDidFailForRegion', region, error)
    );

    const regionEnterSubscription = kontaktEmitter.addListener(
      'didEnterRegion',
      ({ region }) => {
        console.log('didEnterRegion', region);
        setMonitoredRegionsCloseBy(monitoredRegionsCloseBy.concat(region))
      }
    );

    const regionExitSubscription = kontaktEmitter.addListener(
      'didExitRegion',
      ({ region }) => {
        console.log('didExitRegion', region);
        const index = monitoredRegionsCloseBy.findIndex((region) =>
          _isIdenticalRegion(exitRegion, region)
        );

        setMonitoredRegionsCloseBy(
          monitoredRegionsCloseBy.reduce((result, val, ind) => {
            if (ind === index) return result;
            else {
              result.push(val);
              return result;
            }
          }, [])
        );
      }
    );

    // Ranging event
    const regionRangeSubscription = kontaktEmitter.addListener(
      'didRangeBeacons',
      ({ beacons, region }) => {
        console.log('didRangeBeacons', beacons, region);
        setRangedBeacons(beacons)
      }
    );

    const regionRangeFailSubscription = kontaktEmitter.addListener(
      'rangingDidFailForRegion',
      ({ region, error }) =>
        console.log('rangingDidFailForRegion', region, error)
    );

    // Authorization event
    const authorizationSubscription = kontaktEmitter.addListener(
      'authorizationStatusDidChange',
      ({ status }) => {
        console.log('authorizationStatusDidChange', status);
        setAuthorizationStatus(status)
      }
    );

    // Discovery event
    const discoverSubscription = kontaktEmitter.addListener(
      'didDiscoverDevices',
      ({ beacons }) => {
        console.log('didDiscoverDevices', beacons);
        setDiscoveredBeacons(beacons)
      }
    );

    const discoverFailSubscription = kontaktEmitter.addListener(
      'discoveryDidFail',
      ({ error }) => console.log('discoveryDidFail', error)
    );

    return () => {
      startMonitoringSubscription.remove();
      monitoringFailSubscription.remove();
      regionEnterSubscription.remove();
      regionExitSubscription.remove();
      regionRangeSubscription.remove();
      regionRangeFailSubscription.remove();
      authorizationSubscription.remove();
      discoverSubscription.remove();
      discoverFailSubscription.remove();
    }
  }, []);

  /* --- Discovering beacons --- */

  const _startDiscovery = () => {
    startDiscovery({ interval: 1000 })
      .then(() => {
        // this.setState({ scanning: true, discoveredBeacons: [] })
        setScanning(true)
        setDiscoveredBeacons([])
      })
      .then(() => console.log('started discovery'))
      .catch((error) => console.log('[startDiscovery]', error));
  };

  const _stopDiscovery = () => {
    stopDiscovery()
      .then(() => {
        // this.setState({ scanning: false, discoveredBeacons: [] })
        setScanning(false)
        setDiscoveredBeacons([])
      })
      .then(() => console.log('stopped discovery'))
      .catch((error) => console.log('[stopDiscovery]', error));
  };

  _restartDiscovery = () => {
    restartDiscovery()
      .then(() => {
        // this.setState({ scanning: true, discoveredBeacons: [] })
        setScanning(true)
        setDiscoveredBeacons([])
      })
      .then(() => console.log('restarted discovery'))
      .catch((error) => console.log('[restartDiscovery]', error));
  };

  /* --- Ranging beacons --- */

  const _startRanging = () => {
    startRangingBeaconsInRegion(region1)
      .then(() => {
        // this.setState({ ranging: true, rangedBeacons: [] })
        setRanging(true)
        setRangedBeacons([])
      })
      .then(() => console.log('started ranging'))
      .catch((error) => console.log('[startRanging]', error));
  };

  const _stopRanging = () => {
    stopRangingBeaconsInRegion(region1)
      .then(() => {
        // this.setState({ ranging: false, rangedBeacons: [] })
        setRanging(false)
        setRangedBeacons([])
      })
      .then(() => console.log('stopped ranging'))
      .catch((error) => console.log('[stopRanging]', error));
  };

  const _stopAllRanging = () => {
    stopRangingBeaconsInAllRegions()
      .then(() => {
        // this.setState({ ranging: false, rangedBeacons: [] })
        setRanging(false)
        setRangedBeacons([])
      })
      .then(() => console.log('stopped ranging in all regions'))
      .catch((error) => console.log('[stopAllRanging]', error));
  };

  /* --- Monitoring beacons --- */

  const _startMonitoring = () => {
    startMonitoringForRegion(region1)
      .then(() => {
        // this.setState({ monitoring: true })
        setMonitoring(true)
      })
      .then(() => console.log('started monitoring'))
      .catch((error) => console.log('[startMonitoring]', error));
  };

  const _stopMonitoring = () => {
    stopMonitoringForRegion(region1)
      .then(() => {
        // this.setState({ monitoring: false })
        setMonitoring(false)
      })
      .then(() => console.log('stopped monitoring'))
      .catch((error) => console.log('[stopRanging]', error));
  };

  const _stopAllMonitoring = () => {
    stopMonitoringForAllRegions()
      .then(() => {
        // this.setState({ monitoring: false })
        setMonitoring(false)
      })
      .then(() => console.log('stopped monitoring in all regions'))
      .catch((error) => console.log('[stopAllMonitoring]', error));
  };

  /* --- Regions --- */

  const _getRangedRegions = () => {
    getRangedRegions()
      .then((regions) => {
        // this.setState({ rangedRegions: regions })
        setRangedRegions(regions)
      })
      .then(() => console.log('got ranged regions'))
      .catch((error) => console.log('[getRangedRegions]', error));
  };

  const _getMonitoredRegions = () => {
    getMonitoredRegions()
      .then((regions) => {
        // this.setState({ monitoredRegions: regions })
        setMonitoredRegions(regions)
      })
      .then(() => console.log('got monitored regions'))
      .catch((error) => console.log('[getMonitoredRegions]', error));
  };



  const _renderDiscoveredBeacons = () => {
    const colors = ['#F7C376', '#EFF7B7', '#F4CDED', '#A2C8F9', '#AAF7AF'];

    return discoveredBeacons
      .sort((a, b) => a.rssi - b.rssi)
      .map((beacon, index) => (
          <View
            key={index}
            style={[
              styles.beacon,
              { backgroundColor: colors[beacon.minor ? beacon.minor - 1 : 0] },
            ]}
          >
            <Text style={{ fontWeight: 'bold' }}>{beacon.uniqueId}</Text>
            <Text>
              Battery Power: {beacon.batteryLevel}, TxPower:{' '}
              {beacon.transmissionPower}
            </Text>
            <Text>
              Model: {beacon.model}, RSSI: {beacon.rssi}
            </Text>
            <Text>
              FirmwareVersion: {beacon.firmwareVersion}, Name: {beacon.name}
            </Text>
            <Text>
              Locked: {beacon.locked ? 'Yes' : 'No'}, Shuffled:{' '}
              {beacon.shuffled ? 'Yes' : 'No'}
            </Text>
            <Text>updatedAt: {beacon.updatedAt}</Text>
          </View>
        ),
        this
      );
  };

  const _renderRangedBeacons = () => {
    const colors = ['#F7C376', '#EFF7B7', '#F4CDED', '#A2C8F9', '#AAF7AF'];

    return rangedBeacons
      .sort((a, b) => parseInt(a.accuracy) - parseInt(b.accuracy))
      .map(
        (beacon, index) => (
          <View
            key={index}
            style={[
              styles.beacon,
              { backgroundColor: colors[beacon.minor - 1] },
            ]}
          >
            <Text style={{ fontWeight: 'bold' }}>{beacon.uuid}</Text>
            <Text>
              Major: {beacon.major}, Minor: {beacon.minor}
            </Text>
            <Text>
              RSSI: {beacon.rssi}, Proximity: {beacon.proximity}
            </Text>
            <Text>Distance: {beacon.accuracy}</Text>
          </View>
        ),
        // this
      );
  };

  const _renderMonitoredRegions = () => {
    const colors = ['#F7C376', '#EFF7B7', '#F4CDED', '#A2C8F9', '#AAF7AF'];

    return monitoredRegionsCloseBy.map(
      (region, index) => (
        <View
          key={index}
          style={[
            styles.beacon,
            { backgroundColor: colors[region.major ? region.major - 1 : 0] },
          ]}
        >
          <Text style={{ fontWeight: 'bold' }}>{region.identifier}</Text>
          <Text>UUID: {region.uuid}</Text>
          <Text>
            Major: {region.major}, Minor: {region.minor}
          </Text>
        </View>
      ),
      // this
    );
  };

  const _renderRegions = () => {
    return (
      <View>
        <Text style={{ color: '#ABE88D' }}>
          {rangedRegions !== []
            ? rangedRegions.reduce(
                (result, region) =>
                  result + region.identifier + ', ',
                ''
              )
            : 'No ranged regions'}
        </Text>
        <Text style={{ color: '#F48661' }}>
          {monitoredRegions !== []
            ? monitoredRegions.reduce(
                (result, region) =>
                  result + region.identifier + ', ',
                ''
              )
            : 'No monitored regions'}
        </Text>
      </View>
    );
  };

  const _renderEmpty = () => {
    let text = '';
    if (!scanning && !ranging && !monitoring)
      text = 'Start scanning to listen for beacon signals!';
    if (scanning && !discoveredBeacons.length)
      text = 'No beacons discovered yet...';
    if (ranging && !rangedBeacons.length) text = 'No beacons ranged yet...';
    if (monitoring && !monitoredRegionsCloseBy.length)
      text = 'No monitored regions in your proximity...';
    return text ? (
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
      </View>
    ) : null;
  };

  const _renderAuthorizationStatusText = () => {
    return authorizationStatus ? (
      <View style={styles.textContainer}>
        <Text style={[styles.text, { color: 'red' }]}>
          {authorizationStatus}
        </Text>
      </View>
    ) : null;
  };

  const _renderButton = (text, onPress, backgroundColor) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {_renderButton(
          'Start discovery',
          _startDiscovery,
          '#84e2f9'
        )}
        {_renderButton('Stop', _stopDiscovery, '#84e2f9')}
        {_renderButton('Restart', _restartDiscovery, '#84e2f9')}
      </View>
      <View style={styles.buttonContainer}>
        {_renderButton('Start ranging', _startRanging, '#ABE88D')}
        {_renderButton('Stop', _stopRanging, '#ABE88D')}
        {_renderButton('Stop all', _stopAllRanging, '#ABE88D')}
      </View>
      <View style={styles.buttonContainer}>
        {_renderButton(
          'Start monitoring',
          _startMonitoring,
          '#F48661'
        )}
        {_renderButton('Stop', _stopMonitoring, '#F48661')}
        {_renderButton('Stop all', _stopAllMonitoring, '#F48661')}
      </View>
      <View style={styles.buttonContainer}>
        {_renderButton(
          'Get Status',
          _getAuthorizationStatus,
          '#F4ED5A'
        )}
        {_renderAuthorizationStatusText()}
      </View>
      <View style={styles.buttonContainer}>
        {_renderButton(
          'Ranged regions',
          _getRangedRegions,
          '#ABE88D'
        )}
        {_renderButton(
          'Monitored regions',
          _getMonitoredRegions,
          '#F48661'
        )}
      </View>
      {_renderRegions()}
      <ScrollView>
        {_renderEmpty()}
        {scanning &&
          !!discoveredBeacons.length &&
          _renderDiscoveredBeacons()}
        {ranging && !!rangedBeacons.length && _renderRangedBeacons()}
        {monitoring &&
          !!monitoredRegionsCloseBy.length &&
          _renderMonitoredRegions()}
      </ScrollView>
    </View>
  )
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
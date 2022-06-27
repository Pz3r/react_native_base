import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { NOTIFICATION_ACTION_END } from '../../../constants/constants';
import getCurrentDatetimeAsString from './getCurrentDatetimeAsString'

export default schedulePushNotification = async () => {
  const SHOW_DURATION = 2050;
  const storedNotificationDate = await AsyncStorage.getItem('NOTIFICATION_DATE');
  const { monthDay } = getCurrentDatetimeAsString()
  console.log('==== getCurrentDatetimeAsString ====')

  if (storedNotificationDate !== monthDay) {
    console.log('==== Schedule Notification ====')
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Quiz Futbolero',
        body: 'Contesta en rápido quiz y descubre qué tipo de fan futbolero eres',
        data: { action: NOTIFICATION_ACTION_END },
      },
      trigger: { seconds: SHOW_DURATION },
    });
    await AsyncStorage.setItem('NOTIFICATION_DATE', monthDay);
  }
}
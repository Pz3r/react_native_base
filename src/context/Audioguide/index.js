import React, { createContext, useEffect, useState, useRef } from 'react';
import Quiet from 'react-native-quiet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SYNC_OFFSET = 4;
const SYNC_CATCHUP = 5;
const SHOW_DURATION = 3000;

const { Provider, Consumer } = createContext('audio');

const QuietProvider = (props) => {
  const [audioReady, setAudioReady] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [lastReceived, setLastReceived] = useState(null);
  const [currentStation, setCurrentStation] = useState(null);
  const [count, setCount] = useState(null);

  const listenerRef = useRef();
  const timerRef = useRef();

  const onMessageReceived = (msg) => {
    console.log(`QuietProvider - Receiving message: ${JSON.stringify(msg)}`);
    if (msg.toLowerCase() === 'x' || msg.toLowerCase() === 'y' || msg.toLowerCase() === 'z') {
      setCurrentStation(msg);
      setLastMessage(msg);
      setLastReceived(new Date().toLocaleTimeString());
    } else {
      const timestamp = parseInt(msg.split(',')[0], 16) + SYNC_OFFSET;

      if (lastMessage === null) {
        // LOCALLY STORE FIRST MESSAGE AND TIMESTAMP
        (async () => {
          await AsyncStorage.setItem('FIRST_SYNC_VALUE', timestamp.toString());
          await AsyncStorage.setItem('FIRST_SYNC_TIMESTAMP', Date.now().toString());
        })();
      }

      setLastMessage(timestamp);

      if (!timerRef.current) {
        console.log(`Initializing timer at ${timestamp}`);
        timerRef.current = setInterval(() => {
          setCount((count) => {
            const newCount = count === null ? timestamp : count + 1;
            return newCount;
          });
        }, 1000);
      }
    }
  };

  useEffect(() => {
    // CATCHUP WITH VENUE AUDIO
    console.log(`===== QuietProvider useEffect lastMessage: ${lastMessage} count: ${count}`);
    if (lastMessage !== null && count !== null && typeof lastMessage === 'number') {
      if (Math.abs(lastMessage - count) >= SYNC_CATCHUP) {
        console.log(`===== QuietProvider VENUE AIDIO CATCHUP`);
        clearInterval(timerRef.current);
        timerRef.current = null;
        setCount(null);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    console.log(`===== QuietProvider useEffect COUNT changed: ${count}`);
    (async () => {
      const firstSyncValue = await AsyncStorage.getItem('FIRST_SYNC_VALUE');
      const firstSyncTimestamp = await AsyncStorage.getItem('FIRST_SYNC_TIMESTAMP');
      console.log(`===== QuietProvider useEffect COUNT changed LOCAL STORAGE: ${firstSyncValue} at ${firstSyncTimestamp}`);

      //TODO CATCHUP LOCAL
      if (firstSyncValue && firstSyncTimestamp) {
        const value = parseInt(firstSyncValue);
        const timestamp = parseInt(firstSyncTimestamp);
        const diff = Math.round(Math.abs(Date.now() - timestamp) / 1000);
        const currentCount = diff + value;
        console.log(`===== QuietProvider INIT DIFF: ${diff}`);

        if (count && Math.abs(currentCount - count) >= SYNC_CATCHUP) {
          console.log(`===== QuietProvider useEffect COUNT SYNC with diff: ${count} / ${currentCount}`);
          if (currentCount < SHOW_DURATION) {
            setCount(currentCount);
          }
        }
      }

    })();
  }, [count]);

  useEffect(() => {
    Quiet.start('ultrasonic-fsk-fast')
      .then(() => {
        console.log(`QuietProvider - Initialization success`);
        setAudioReady(true);
        listenerRef.current = Quiet.addListener(onMessageReceived);

        // INIT TIMER LOCALLY
        (async () => {
          const firstSyncValue = await AsyncStorage.getItem('FIRST_SYNC_VALUE');
          const firstSyncTimestamp = await AsyncStorage.getItem('FIRST_SYNC_TIMESTAMP');
          console.log(`===== QuietProvider INIT LOCAL STORAGE: ${firstSyncValue} at ${firstSyncTimestamp}`);

          if (firstSyncValue && firstSyncTimestamp) {
            const value = parseInt(firstSyncValue);
            const timestamp = parseInt(firstSyncTimestamp);
            const diff = Math.round(Math.abs(Date.now() - timestamp) / 1000);
            const currentCount = diff + value;
            console.log(`===== QuietProvider INIT DIFF: ${diff}`);

            // ONLY INITIALIZE LOCALLY WITHIN A REASONABLE TIMEFRAME (IS THE SHOW STILL GOING?)

            if (!timerRef.current && currentCount < SHOW_DURATION) {
              console.log(`===== QuietProvider INIT initializing timer at ${currentCount}`);
              timerRef.current = setInterval(() => {
                setCount((count) => {
                  console.log(`===== QuietProvider INIT setting count ${count} with ${currentCount}`);
                  const newCount = count === null ? (currentCount) : count + 1;
                  return newCount;
                });
              }, 1000);
            }
          }
        })();

      })
      .catch(error => {
        console.log(`QuietProvider - Initialization error: ${JSON.stringify(error)}`);
      })
    return () => {
      if (listenerRef.current) {
        listenerRef.current.remove();
        clearInterval(timerRef.current);
      }
    }

    /*
    timerRef.current = setInterval(() => {
      setCount((count) => count + 1);
      setLastMessage(count);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    */

  }, []);

  const initQuiet = () => {
    Quiet.start('ultrasonic-fsk-fast')
      .then(() => {
        console.log(`QuietProvider - Initialization success`);
        setAudioReady(true);
        listenerRef.current = Quiet.addListener(onMessageReceived);
      })
      .catch(error => {
        console.log(`QuietProvider - Initialization error: ${JSON.stringify(error)}`);
      })
  }

  return (
    <Provider value={{ audioReady, lastMessage, count, initQuiet, currentStation, lastReceived }}>{props.children}</Provider>
  )
};

const QuietConsumer = ({ children }) => (
  <Consumer>{children}</Consumer>
);

export { QuietProvider, QuietConsumer }
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'native-base';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, TapGestureHandler } from 'react-native-gesture-handler';
import Reanimated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedProps, useSharedValue, runOnJS } from 'react-native-reanimated';
import {
  Camera,
  frameRateIncluded,
  sortFormats,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { scanFaces, Face } from 'vision-camera-face-detector';

import { CONTENT_SPACING, MAX_ZOOM_FACTOR, SAFE_AREA_PADDING } from '../../../constants/constants';
import { useIsForeground } from '../../../hooks/useIsForeground';
import { examplePlugin } from '../../../frame-processors/example-plugin';
import { CaptureButton } from '../../../components/CaptureButton/CaptureButton';


const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const SCALE_FULL_ZOOM = 3;
const BUTTON_SIZE = 40;

function CameraScreen({ navigation }) {
  const camera = useRef(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const [faces, setFaces] = useState();
  const zoom = useSharedValue(0);
  const isPressingButton = useSharedValue(false);

  // check if camera page is active
  const isFocused = useIsFocused();
  const isActive = isFocused;

  const [cameraPosition, setCameraPosition] = useState('front');
  const [enableHdr, setEnableHdr] = useState(false);
  const [flash, setFlash] = useState('off');
  const [enableNightMode, setEnableNightMode] = useState(false);

  // camera format settings
  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  const formats = useMemo(() => {
    if (device?.formats == null) return [];
    return device.formats.sort(sortFormats);
  }, [device?.formats]);

  //Memos
  const [is60Fps, setIs60Fps] = useState(true);
  const fps = useMemo(() => {
    if (!is60Fps) return 30;

    if (enableNightMode && !device?.supportsLowLightBoost) {
      // User has enabled Night Mode, but Night Mode is not natively supported, so we simulate it by lowering the frame rate.
      return 30;
    }

    const supportsHdrAt60Fps = formats.some((f) => f.supportsVideoHDR && f.frameRateRanges.some((r) => frameRateIncluded(r, 60)));
    if (enableHdr && !supportsHdrAt60Fps) {
      // User has enabled HDR, but HDR is not supported at 60 FPS.
      return 30;
    }

    const supports60Fps = formats.some((f) => f.frameRateRanges.some((r) => frameRateIncluded(r, 60)));
    if (!supports60Fps) {
      // 60 FPS is not supported by any format.
      return 30;
    }
    // If nothing blocks us from using it, we default to 60 FPS.
    return 60;
  }, [device?.supportsLowLightBoost, enableHdr, enableNightMode, formats, is60Fps]);

  const supportsCameraFlipping = useMemo(() => devices.back != null && devices.front != null, [devices.back, devices.front]);
  const supportsFlash = device?.hasFlash ?? false;
  const supportsHdr = useMemo(() => formats.some((f) => f.supportsVideoHDR || f.supportsPhotoHDR), [formats]);
  const supports60Fps = useMemo(() => formats.some((f) => f.frameRateRanges.some((rate) => frameRateIncluded(rate, 60))), [formats]);
  const canToggleNightMode = enableNightMode
    ? true // it's enabled so you have to be able to turn it off again
    : (device?.supportsLowLightBoost ?? false) || fps > 30; // either we have native support, or we can lower the FPS

  const format = useMemo(() => {
    let result = formats;
    if (enableHdr) {
      // We only filter by HDR capable formats if HDR is set to true.
      // Otherwise we ignore the `supportsVideoHDR` property and accept formats which support HDR `true` or `false`
      result = result.filter((f) => f.supportsVideoHDR || f.supportsPhotoHDR);
    }

    // find the first format that includes the given FPS
    return result.find((f) => f.frameRateRanges.some((r) => frameRateIncluded(r, fps)));
  }, [formats, fps, enableHdr]);
  // END Memos

  // Animated Zoom
  // This just maps the zoom factor to a percentage value.
  // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, 20);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  // Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton],
  );
  // Camera callbacks
  const onError = useCallback((error) => {
    console.error(error);
  }, []);
  const onInitialized = useCallback(() => {
    console.log('===== Camera initialized! =====');
    setIsCameraInitialized(true);
    setCameraPosition('front');
  }, []);
  const onMediaCaptured = useCallback(
    (media, type) => {
      console.log(`===== Media captured! ${JSON.stringify(media)}`);
      /*
      navigation.navigate('MediaPage', {
        path: media.path,
        type: type,
      });
      */
    },
    [navigation],
  );
  const onFlipCameraPressed = useCallback(() => {
    console.log(`===== onFlipCameraPressed =====`);
    setCameraPosition((p) => (p === 'back' ? 'front' : 'back'));
  }, []);
  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === 'off' ? 'on' : 'off'));
  }, []);
  // END Callbacks

  // Tap Gesture
  const onDoubleTap = useCallback(() => {
    console.log(`===== onDoubleTap =====`);
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);
  // END Tap Gesture

  // Effects
  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  useEffect(() => {
    //Camera.getMicrophonePermissionStatus().then((status) => setHasMicrophonePermission(status === 'authorized'));
  }, []);

  useEffect(() => {
    console.log(`===== Faces: =====`);
    console.log(faces);
  }, [faces]);
  // END Effects

  // Pinch to Zoom Gesture
  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(event.scale, [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolate.CLAMP);
      zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP);
    },
  });
  // END Pinch to Zoom Gesture

  if (device != null && format != null) {
    console.log(
      `Re-rendering camera page with ${isActive ? 'active' : 'inactive'} camera. ` +
      `Device: "${device.name}" (${format.photoWidth}x${format.photoHeight} @ ${fps}fps)`,
    );
  } else {
    console.log('re-rendering camera page without active camera');
  }

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    //const values = examplePlugin(frame);
    const scannedFaces = scanFaces(frame);
    console.log(`===== Return Values: ${JSON.stringify(scannedFaces)}`);
    runOnJS(setFaces)(scannedFaces);
  }, []);

  const onFrameProcessorSuggestionAvailable = useCallback((suggestion) => {
    console.log(`===== Suggestion available! ${suggestion.type}: Can do ${suggestion.suggestedFrameProcessorFps} FPS`);
  }, []);

  return (
    <View style={styles.container}>
      {device != null && (
        <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
          <Reanimated.View style={StyleSheet.absoluteFill}>
            <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={1}>
              <ReanimatedCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                fps={fps}
                hdr={enableHdr}
                lowLightBoost={device.supportsLowLightBoost && enableNightMode}
                isActive={isActive}
                onInitialized={onInitialized}
                onError={onError}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                photo={true}
                video={false}
                audio={false}
                frameProcessor={device.supportsParallelVideoProcessing ? frameProcessor : undefined}
                orientation="portrait"
                frameProcessorFps={1}
                onFrameProcessorPerformanceSuggestionAvailable={onFrameProcessorSuggestionAvailable}
              />
            </TapGestureHandler>
          </Reanimated.View>
        </PinchGestureHandler>
      )}
      {device && !device.supportsParallelVideoProcessing &&
        <Text style={styles.infoText}>Live face detection NOT supported</Text>
      }
      {device && device.supportsParallelVideoProcessing &&
        <Text style={styles.infoText}>Faces: {faces && device && device.supportsParallelVideoProcessing ? faces.length : 0}</Text>
      }
      <CaptureButton
        style={styles.captureButton}
        camera={camera}
        onMediaCaptured={onMediaCaptured}
        cameraZoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        flash={supportsFlash ? flash : 'off'}
        enabled={isCameraInitialized && isActive}
        setIsPressingButton={setIsPressingButton}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  infoText: {
    position: 'absolute',
    alignSelf: 'center',
    top: SAFE_AREA_PADDING.paddingTop,
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  text: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CameraScreen;
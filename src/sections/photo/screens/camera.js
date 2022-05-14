import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Flex } from 'native-base';
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
import i18n from 'i18n-js';

import IMG from 'assets/img';

import { CONTENT_SPACING, SAFE_AREA_PADDING } from '../../../constants/constants';
import { CaptureButton } from '../../../components/CaptureButton/CaptureButton';
import { NAVIGATION_PHOTO_PREVIEW_SCREEN } from '../../../navigation/constants';
import StepHeader from '../../../components/StepHeader/StepHeader';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const SCALE_FULL_ZOOM = 3;
const BUTTON_SIZE = 40;

function PhotoCameraScreen({ navigation }) {
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
    (path, width, height, type) => {
      console.log(`====== Media captured! ${path}//${width}//${height}//${type} =====`);

      navigation.navigate(NAVIGATION_PHOTO_PREVIEW_SCREEN, {
        path,
        width,
        height,
        type,
        validated: device ? device.supportsParallelVideoProcessing : false
      });

      /*
      if (device && !device.supportsParallelVideoProcessing) {
        // TODO face check Rekognition
        navigation.navigate(NAVIGATION_PHOTO_PREVIEW_SCREEN, {
          path,
          width,
          height,
          type
        });
      } else {
        navigation.navigate(NAVIGATION_PHOTO_PREVIEW_SCREEN, {
          path,
          width,
          height,
          type
        });
      }
      */
    },
    [navigation, device],
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

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <ImageBackground resizeMode="cover" style={styles.background} source={IMG.appFondo}>
      <Flex flex="1" style={styles.container} alignItems="center">
        <View style={styles.top}>
          <StepHeader title={i18n.t('photo_camera_title')} backButtonHandler={goBack} total={4} step={1} />
        </View>
        <View style={styles.cameraContainer}>
          {device != null && (
            <>
              <Camera
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
                photo={true}
                video={false}
                audio={false}
                frameProcessor={device.supportsParallelVideoProcessing ? frameProcessor : undefined}
                orientation="portrait"
                frameProcessorFps={1}
                onFrameProcessorPerformanceSuggestionAvailable={onFrameProcessorSuggestionAvailable}
              />
              <ImageBackground resizeMode="cover" style={styles.overlay} source={IMG.smCamisaBlanca} />
            </>
          )}
        </View>
        {device && !device.supportsParallelVideoProcessing && false &&
          <Text style={styles.infoText}>Live face detection NOT supported</Text>
        }
        {device && device.supportsParallelVideoProcessing && false &&
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
          enabled={(faces && device && device.supportsParallelVideoProcessing && faces.length < 1) ? false : true}
          setIsPressingButton={setIsPressingButton}
        />
      </Flex>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#bbb',
    paddingTop: SAFE_AREA_PADDING.paddingTop,
  },
  top: {
    paddingHorizontal: 50
  },
  middle: {
    //backgroundColor: '#0f0',
  },
  cameraContainer: {
    width: '100%',
    //aspectRatio: 65 / 87
    aspectRatio: 3 / 4,
    position: 'absolute',
    bottom: 0
  },
  bottom: {
    backgroundColor: '#00f',
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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    //display: 'none'
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
  background: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default PhotoCameraScreen;
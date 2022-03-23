import { Frame } from 'react-native-vision-camera';

let _WORKLET;

export function examplePluginSwift(frame) {
  'worklet';
  if (!_WORKLET) throw new Error('examplePluginSwift must be called from a frame processor!');

  //return __example_plugin_swift(frame, 'hello!', 'parameter2', true, 42, { test: 0, second: 'test' }, ['another test', 5]);
}

export function examplePlugin(frame) {
  'worklet';
  if (!_WORKLET) throw new Error('examplePlugin must be called from a frame processor!');

  //return __example_plugin(frame, 'hello!', 'parameter2', true, 42, { test: 0, second: 'test' }, ['another test', 5]);
}
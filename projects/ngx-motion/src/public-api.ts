/*
 * Public API Surface of ngx-motion
 */

// ? TODO:  export * from 'motion'; ??
export {
  animate,
  animateMini,
  scroll,
  inView,
  MotionValue,
  delay,
  frame,
  mix,
  spring,
  stagger,
  transform,
  cubicBezier,
  easeIn,
  easeOut,
  easeInOut,
  backIn,
  backOut,
  backInOut,
  circIn,
  circOut,
  circInOut,
  anticipate,
  steps,
  reverseEasing,
  mirrorEasing,
} from 'motion';
export { MotionService } from './lib/motion.service';
export { MotionDirective } from './lib/motion.directive';
export {
  type AnimationPlaybackControls,
  type AnimationSequence,
  type SequenceOptions,
  type ScrollAnimationOptions,
  type InViewAnimationOptions,
  type DynamicAnimationOptions,
} from './lib/types/animate.model';
export {
  type OnScroll,
  type OnStart,
  type DOMKeyframesDefinition,
} from './lib/types/motion.model';

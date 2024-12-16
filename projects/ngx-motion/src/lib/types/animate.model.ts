import { CSSStyleDeclarationWithTransform } from './css.model';
import {
  ContainerTargetOffset,
  DOMKeyframesDefinition,
  ProgressTimeline,
  SVGPathProperties,
  UnresolvedValueKeyframe,
} from './motion.model';
import { SVGAttributes } from './svg.model';


export interface ValueAnimationTransition<V = any>
  extends Transition,
    AnimationPlaybackLifecycles<V> {}
export type StyleTransitions = {
  [K in keyof CSSStyleDeclarationWithTransform]?: Transition;
};
export type SVGPathTransitions = {
  [K in keyof SVGPathProperties]: Transition;
};
export type SVGTransitions = {
  [K in keyof SVGAttributes]: Transition;
};
export type VariableTransitions = {
  [key: `--${string}`]: Transition;
};

export interface AnimationPlaybackLifecycles<V> {
  onUpdate?: (latest: V) => void;
  onPlay?: () => void;
  onComplete?: () => void;
  onRepeat?: () => void;
  onStop?: () => void;
}

export type DynamicOption<T> = (i: number, total: number) => T;
export type AnimationOptionsWithValueOverrides<V = any> = StyleTransitions &
  SVGPathTransitions &
  SVGTransitions &
  VariableTransitions &
  ValueAnimationTransition<V>;

export interface DynamicAnimationOptions
  extends Omit<AnimationOptionsWithValueOverrides, 'delay'> {
  delay?: number | DynamicOption<number>;
  [key: number]: Transition; // Index signature for compatibility
}

export interface AnimationPlaybackControls {
  time: number;
  speed: number;
  startTime: number | null;
  state?: AnimationPlayState;

  /*
   * The duration is the duration of time calculated for the active part
   * of the animation without delay or repeat,
   * which may be added as an extra prop at a later date.
   */
  duration: number;

  stop: () => void;
  play: () => void;
  pause: () => void;
  complete: () => void;
  cancel: () => void;
  then: (onResolve: VoidFunction, onReject?: VoidFunction) => Promise<void>;
  attachTimeline?: (
    timeline: ProgressTimeline,
    fallback?: (animation: AnimationPlaybackControls) => VoidFunction
  ) => VoidFunction;
  flatten: () => void;
}

export interface Transition {
  // Transition options
  delay?: number;
  elapsed?: number;
  driver?: Driver;
  type?: AnimationGeneratorType;
  duration?: number;
  autoplay?: boolean;
  startTime?: number;

  // Spring options
  // Duration is overridden by spring's own if `type: "spring"` is used
  stiffness?: number;
  damping?: number;
  mass?: number;
  visualDuration?: number; // Overrides duration if set
  bounce?: number;

  // Inertia options
  bounceStiffness?: number;
  bounceDamping?: number;
  min?: number;
  max?: number;
  power?: number;
  timeConstant?: number;
  modifyTarget?: (v: number) => number;

  // Keyframe options
  ease?: Easing | Easing[];
  times?: number[];

  // AnimationPlaybackOptions
  repeat?: number;
  repeatType?: RepeatType;
  repeatDelay?: number;

  // Inherited velocity
  velocity?: number;
  restSpeed?: number;
  restDelta?: number;
}

export type AnimationGeneratorType =
  | GeneratorFactory
  | 'decay'
  | 'spring'
  | 'keyframes'
  | 'tween'
  | 'inertia';

export type GeneratorFactory = (
  options: ValueAnimationOptions<any>
) => KeyframeGenerator<any>;

export type RepeatType = 'loop' | 'reverse' | 'mirror';

////
/**
 * An update function. It accepts a timestamp used to advance the animation.
 */
type Update = (timestamp: number) => void;

/**
 * Drivers accept a update function and call it at an interval. This interval
 * could be a synchronous loop, a setInterval, or tied to the device's framerate.
 */
export type Driver = (update: Update) => DriverControls;
export interface DriverControls {
  start: () => void;
  stop: () => void;
  now: () => number;
}

export type EasingFunction = (v: number) => number;
export type EasingModifier = (easing: EasingFunction) => EasingFunction;
export type BezierDefinition = readonly [number, number, number, number];
export type EasingDefinition =
  | BezierDefinition
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'circIn'
  | 'circOut'
  | 'circInOut'
  | 'backIn'
  | 'backOut'
  | 'backInOut'
  | 'anticipate';

/**
 * The easing function to use. Set as one of:
 *
 * - The name of an in-built easing function.
 * - An array of four numbers to define a cubic bezier curve.
 * - An easing function, that accepts and returns a progress value between `0` and `1`.
 *
 * @public
 */
export type Easing = EasingDefinition | EasingFunction;

export interface AnimationState<V> {
  value: V;
  done: boolean;
}
export interface KeyframeGenerator<V> {
  calculatedDuration: null | number;
  next: (t: number) => AnimationState<V>;
  toString: () => string;
}

export interface ValueAnimationOptions<V = any> {
  keyframes: V[];
  name?: string;
  from?: V;
  isGenerator?: boolean;
  delay?: number;
  elapsed?: number;
  driver?: Driver;
  type?: AnimationGeneratorType;
  duration?: number;
  autoplay?: boolean;
  startTime?: number;
  repeat?: number;
  repeatType?: RepeatType;
  repeatDelay?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
  restSpeed?: number;
  restDelta?: number;
  bounce?: number;
  power?: number;
  timeConstant?: number;
  modifyTarget?: (v: number) => number;
  bounceStiffness?: number;
  bounceDamping?: number;
  min?: number;
  max?: number;
  ease?: Easing | Easing[];
  times?: number[];
}

export interface AnimationPlaybackOptions {
  repeat?: number;
  repeatType?: RepeatType;
  repeatDelay?: number;
}

export interface SequenceOptions extends AnimationPlaybackOptions {
  delay?: number;
  duration?: number;
  defaultTransition?: Transition;
}
export type SequenceTime =
  | number
  | '<'
  | `+${number}`
  | `-${number}`
  | `${string}`;
export type GenericKeyframesTarget<V> = V[] | Array<null | V>;
export type ObjectTarget<O> = {
  [K in keyof O]?: O[K] | GenericKeyframesTarget<O[K]>;
};
export type ObjectSegment<O extends {} = {}> = [O, ObjectTarget<O>];
export type SequenceLabel = string;
export interface SequenceLabelWithTime {
  name: SequenceLabel;
  at: SequenceTime;
}
export type MotionValue = any; // TODO
export type MotionValueSegment = [
  MotionValue,
  UnresolvedValueKeyframe | UnresolvedValueKeyframe[]
];
export type MotionValueSegmentWithTransition = [
  MotionValue,
  UnresolvedValueKeyframe | UnresolvedValueKeyframe[],
  Transition & At
];
export type DOMSegment = [ElementOrSelector, DOMKeyframesDefinition];
export type DOMSegmentWithTransition = [
  ElementOrSelector,
  DOMKeyframesDefinition,
  DynamicAnimationOptions & At
];
export type ObjectSegmentWithTransition<O extends {} = {}> = [
  O,
  ObjectTarget<O>,
  DynamicAnimationOptions & At
];
export type Segment =
  | ObjectSegment
  | ObjectSegmentWithTransition
  | SequenceLabel
  | SequenceLabelWithTime
  | MotionValueSegment
  | MotionValueSegmentWithTransition
  | DOMSegment
  | DOMSegmentWithTransition;
export type AnimationSequence = Segment[];

export interface SequenceOptions extends AnimationPlaybackOptions {
  delay?: number;
  duration?: number;
  defaultTransition?: Transition;
}

export interface At {
  at?: SequenceTime;
}
export type ElementOrSelector =
  | Element
  | Element[]
  | NodeListOf<Element>
  | string;

export interface ScrollAnimationOptions {
  container?: HTMLElement;
  target?: HTMLElement;
  axis?: 'x' | 'y';
  offset?: [ContainerTargetOffset, ContainerTargetOffset];
}

type MarginValue = `${number}${'px' | '%'}`;
type MarginType =
  | MarginValue
  | `${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;

export interface InViewOptions {
  root?: Element | Document;
  margin?: MarginType;
  amount?: 'some' | 'all' | number;
}

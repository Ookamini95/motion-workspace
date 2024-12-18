import { Injectable } from '@angular/core';
import { animate, scroll, inView } from 'motion';
import {
  AnimationPlaybackControls,
  AnimationSequence,
  DynamicAnimationOptions,
  ElementOrSelector,
  InViewAnimationOptions,
  ObjectTarget,
  ScrollAnimationOptions,
  SequenceOptions,
  ValueAnimationTransition,
} from './types/animate.model';
import { DOMKeyframesDefinition, HexColor } from './types/motion.model';

@Injectable({ providedIn: 'root' })
export class MotionService {
  animateSequence(
    sequence: AnimationSequence,
    sequenceOptions?: SequenceOptions
  ): AnimationPlaybackControls {
    return animate(sequence, sequenceOptions);
  }
  scrollableSequence(
    sequence: AnimationSequence,
    sequenceOptions?: SequenceOptions,
    scrollOptions?: ScrollAnimationOptions
  ): VoidFunction {
    return scroll(
      this.animateSequence(sequence, sequenceOptions),
      scrollOptions
    );
  }
  inViewSequence(
    sequence: AnimationSequence,
    target: ElementOrSelector,
    sequenceOptions?: SequenceOptions,
    InViewAnimationOptions?: InViewAnimationOptions
  ): VoidFunction {
    let animation: AnimationPlaybackControls | undefined;
    const inViewHandler = () => {
      animation = animate(sequence, sequenceOptions);
      return () => animation?.stop();
    };
    return inView(target, inViewHandler, InViewAnimationOptions);
  }

  // TODO test for threeJS
  animateObject<T extends Object>(
    obj: T,
    keyframes: ObjectTarget<T>,
    animationOptions?: DynamicAnimationOptions
  ) {
    return animate(obj, keyframes, animationOptions);
  }
  // Scroll-based animation for objects
  scrollableObject<T extends Object>(
    obj: T,
    keyframes: ObjectTarget<T>,
    animationOptions?: DynamicAnimationOptions,
    scrollOptions?: ScrollAnimationOptions
  ): VoidFunction {
    const animation = this.animateObject(obj, keyframes, animationOptions);
    return scroll(animation, scrollOptions);
  }
  // InView animation for objects
  inViewObject<T extends Object>(
    obj: T,
    keyframes: ObjectTarget<T>,
    target: ElementOrSelector,
    animationOptions?: DynamicAnimationOptions,
    InViewAnimationOptions?: InViewAnimationOptions
  ): VoidFunction {
    let animation: AnimationPlaybackControls | undefined;
    const inViewHandler = () => {
      animation = this.animateObject(obj, keyframes, animationOptions);
      return () => animation?.stop();
    };
    return inView(target, inViewHandler, InViewAnimationOptions);
  }

  animateValues(
    from: number | HexColor | DOMKeyframesDefinition,
    to: number | HexColor | DOMKeyframesDefinition,
    options: ValueAnimationTransition = {}
  ): AnimationPlaybackControls {
    return animate(from, to, options);
  }
  // other...
}

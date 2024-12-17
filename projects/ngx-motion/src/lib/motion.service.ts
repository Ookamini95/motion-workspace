import { Injectable } from '@angular/core';
import { animate } from 'motion';
import {
  AnimationPlaybackControls,
  GenericKeyframesTarget,
  ObjectTarget,
  ValueAnimationTransition,
} from './types/animate.model';

@Injectable({ providedIn: 'root' })
export class MotionService {
  fromToAnimate(
    from: number | string ,
    to: number | string,
    options: ValueAnimationTransition = {}
  ): AnimationPlaybackControls {
    const animation = animate(from, to, options);
    return animation;
  }

  // OBJECT ANIMATED (SAFE AND UNSAFE for stuff like threeJS)
  // animateSafeObject(from:)
  // other...
}

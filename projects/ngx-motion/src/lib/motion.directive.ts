import {
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { animate, inView, scroll } from 'motion';
import {
  DOMKeyframesDefinition,
  OnScroll,
  OnStart,
} from './types/motion.model';
import {
  AnimationPlaybackControls,
  AnimationSequence,
  DynamicAnimationOptions,
  InViewOptions,
  ScrollAnimationOptions,
  SequenceOptions,
} from './types/animate.model';
import { GeometricIdentityTransform } from './utils/motion.constants';

@Directive({
  selector: '[Motion]',
})
export class MotionDirective {
  #MotionElement: Element = inject(ElementRef).nativeElement;

  // Motion animations
  MotionAnimate = input<DOMKeyframesDefinition | AnimationSequence>();
  MotionAnimation = model<AnimationPlaybackControls>();
  #MotionAnimateEffect = effect(() => {
    let animation: AnimationPlaybackControls | undefined;
    const animateOptions = this.MotionAnimate();
    if (animateOptions) {
      if (Array.isArray(animateOptions))
        animation = animate(animateOptions, this.MotionSequence());
      else
        animation = animate(
          this.#MotionElement,
          animateOptions,
          this.MotionTransition()
        );

      this.MotionAnimation.set(animation);
    }
    return () => animation?.stop();
  });

  MotionScroll = input<DOMKeyframesDefinition | AnimationSequence | OnScroll>();
  MotionScrollOptions = input<ScrollAnimationOptions>();
  #MotionScrollEffect = effect(() => {
    let animation: AnimationPlaybackControls | undefined;
    let scrollAnimation: VoidFunction | undefined;
    const scrollAnimationOptions = this.MotionScroll();
    if (scrollAnimationOptions) {
      if (typeof scrollAnimationOptions === 'function') {
        scrollAnimation = scroll(scrollAnimationOptions);
      } else if (Array.isArray(scrollAnimationOptions)) {
        animation = animate(scrollAnimationOptions, this.MotionSequence());
        scrollAnimation = scroll(animation, this.MotionScrollOptions());
      } else {
        animation = animate(
          this.#MotionElement,
          scrollAnimationOptions,
          this.MotionTransition()
        );
        scrollAnimation = scroll(animation, this.MotionScrollOptions());
      }
      this.MotionAnimation.set(animation);
    }
    return () => {
      if (scrollAnimation) return scrollAnimation();
    };
  });

  MotionView = input<DOMKeyframesDefinition | AnimationSequence | OnStart>();
  MotionViewOptions = input<InViewOptions>();
  #MotionViewEffect = effect(() => {
    let animation: AnimationPlaybackControls | undefined;
    let viewAnimation: VoidFunction | undefined;
    const viewAnimationOptions = this.MotionView();
    if (viewAnimationOptions) {
      if (typeof viewAnimationOptions === 'function') {
        viewAnimation = inView(this.#MotionElement, viewAnimationOptions);
      } else if (Array.isArray(viewAnimationOptions)) {
        const inViewHandler = () => {
          animation = animate(viewAnimationOptions, this.MotionSequence());
          return () => animation?.stop();
        };
        viewAnimation = inView(
          this.#MotionElement,
          inViewHandler,
          this.MotionViewOptions()
        );
      } else {
        const inViewHandler = () => {
          animation = animate(
            this.#MotionElement,
            viewAnimationOptions,
            this.MotionTransition()
          );
          return () => animation?.stop();
        };
        viewAnimation = inView(
          this.#MotionElement,
          inViewHandler,
          this.MotionViewOptions()
        );
      }
      this.MotionAnimation.set(animation);
    }
    return () => {
      if (viewAnimation) return viewAnimation();
    };
  });

  // Motion animation options
  MotionTransition = input<DynamicAnimationOptions>();
  MotionSequence = input<SequenceOptions>();

  // Angular fills missing APIs: hover, variants...
  // TODO when released use motion APIs

  MotionInitial = input<DOMKeyframesDefinition>(); // Needed when non standard animations are applied in order to correctly revert them (e.g. pathlenght)
  // Hover
  #MotionHoverAnimation = signal<AnimationPlaybackControls | undefined>(
    undefined
  );
  MotionHover = input<DOMKeyframesDefinition>();
  @HostListener('mouseenter') onMouseEnter() {
    let animation: AnimationPlaybackControls | undefined;
    const hoverAnimationOptions = this.MotionHover();
    if (hoverAnimationOptions) {
      animation = animate(
        this.#MotionElement,
        hoverAnimationOptions,
        this.MotionTransition()
      );
      this.MotionAnimation.set(animation);
      this.#MotionHoverAnimation.set(animation);
    }
  }
  @HostListener('mouseleave') onMouseLeave() {
    let animation: AnimationPlaybackControls | undefined;
    const active = this.MotionHover();
    if (active) {
      animation = animate(
        this.#MotionElement,
        this.MotionInitial() ?? GeometricIdentityTransform,
        {
          ...this.MotionTransition(),
          duration: this.#MotionHoverAnimation()?.time,
        }
      );
      this.MotionAnimation.set(animation);
    }
  }

  testAnimation() {
    const sequence: AnimationSequence = [
      [this.#MotionElement, { opacity: 1, x: 100 }, { duration: 1 }],
      [this.#MotionElement, { opacity: 0.5, x: 200 }, { duration: 1 }],
      [this.#MotionElement, { opacity: 1, x: -100 }, { duration: 1 }],
    ];
    const animation = scroll(animate(sequence));
    // this.#MotionElement,
    // this.MotionAnimate() ?? { scale: 3 },
    // this.MotionTransition() ?? { duration: 2 }
    // this.MotionAnimation.set(animation);
  }
}

/*



WAAPI always expects a unit type for various animatable values, which can be easy to forget.


.finished Promise

As a newer part of the WAAPI spec, the animation.finished Promise isn't supported in every browser. Motion will polyfill it in those browsers:
const animation = animate("#box", { opacity: 0 })

// Async
await animation

// Promise
animation.then(() => {})

*/

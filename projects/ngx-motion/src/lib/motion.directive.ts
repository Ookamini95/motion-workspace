import {
  computed,
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
  DynamicOption,
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
  #MotionChildren: Element[] = inject(ElementRef).nativeElement.children;
  get #children() {
    return Array.from(this.#MotionChildren)
  }

  // Motion animations
  MotionAnimate = input<DOMKeyframesDefinition | AnimationSequence>();
  MotionAnimation = model<AnimationPlaybackControls>();
  #MotionAnimateEffect = effect(() => {
    let animation: AnimationPlaybackControls | undefined;
    const animateOptions = this.MotionAnimate();

    if (animateOptions) {
      if (Array.isArray(animateOptions))
        animation = animate(animateOptions, this.MotionSequence());
      else {
        const children = this.#children;
        const stagger = this.#MotionStagger();
        if (children.length && stagger) {
          animation = animate(
            children,
            animateOptions,
            this.MotionTransition()
          );
        } else {
          animation = animate(
            this.#MotionElement,
            animateOptions,
            this.MotionTransition()
          );
        }
      }

      this.MotionAnimation.set(animation);
    }
    return () => animation?.stop();
  });

  // Motion Scroll
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
        const children = Array.from(this.#MotionChildren);
        const stagger = this.#MotionStagger();
        if (children.length && stagger) {
          animation = animate(
            children,
            scrollAnimationOptions,
            this.MotionTransition()
          );
        }
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

  // Motion in View
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
          const children = Array.from(this.#MotionChildren);
          const stagger = this.#MotionStagger();
          if (children.length && stagger) {
            animation = animate(
              children,
              viewAnimationOptions,
              this.MotionTransition()
            );
          } else {
            animation = animate(
              this.#MotionElement,
              viewAnimationOptions,
              this.MotionTransition()
            );
          }
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

  // Derived options
  #MotionStagger = computed<DynamicOption<number> | undefined>(() => {
    const transition = this.MotionTransition();
    return transition?.delay && typeof transition.delay === 'function'
      ? transition.delay
      : undefined;
  });

  // Angular fills missing APIs: hover, variants...
  // TODO when released use motion APIs

  MotionInitial = input<DOMKeyframesDefinition>(); // Needed when non standard animations are applied in order to correctly revert them (e.g. pathlenght)

  // Motion Tap
  MotionTap = input<DOMKeyframesDefinition>();
  #MotionTapAnimation = signal<AnimationPlaybackControls | undefined>(
    undefined
  );
  @HostListener('mousedown')
  @HostListener('touchstart')
  onTouchStart() {
    let animation: AnimationPlaybackControls | undefined;
    const tapAnimationOptions = this.MotionTap();
    if (tapAnimationOptions) {
      animation = animate(
        this.#MotionElement,
        tapAnimationOptions,
        this.MotionTransition()
      );
      this.MotionAnimation.set(animation);
      this.#MotionTapAnimation.set(animation);
    }
  }
  @HostListener('mouseup')
  @HostListener('touchend')
  // @HostListener('mouseleave') TODO find fix: work-around > call this from hover:onMouseLeave
  onTouchEnd() {
    let animation: AnimationPlaybackControls | undefined;
    const active = this.MotionTap();
    if (active) {
      animation = animate(
        this.#MotionElement,
        this.MotionInitial() ?? GeometricIdentityTransform,
        {
          ...this.MotionTransition(),
          duration: this.#MotionTapAnimation()?.time,
        }
      );
      this.MotionAnimation.set(animation);
    }
  }
  // Hover
  #MotionHoverAnimation = signal<AnimationPlaybackControls | undefined>(
    undefined
  ); // Used internally to extract timing for hover
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

    this.onTouchEnd(); // TODO temp workaround for HostListener overlap https://github.com/angular/angular/issues/26729
  }

  // TODO Drag
  // TODO Variants

  #makeAnimation() {

  }

  testAnimation() {
    // const sequence: AnimationSequence = [
    //   [this.#MotionElement, { opacity: 1, x: 100 }, { duration: 1 }],
    //   [this.#MotionElement, { opacity: 0.5, x: 200 }, { duration: 1 }],
    //   [this.#MotionElement, { opacity: 1, x: -100 }, { duration: 1 }],
    // ];
    // const animation = scroll(animate(sequence));
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

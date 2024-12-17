import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicAnimationOptions } from '../../../ngx-motion/src/lib/types/animate.model';
import { DOMKeyframesDefinition } from '../../../ngx-motion/src/lib/types/motion.model';
import { MotionDirective } from '../../../ngx-motion/src/lib/motion.directive';
import { MotionService } from '../../../ngx-motion/src/lib/motion.service';
import { MotionValue, motionValue, stagger } from 'motion';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MotionDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  motionservice = inject(MotionService);

  #value = signal(0);
  get value() {
    return Math.round(this.#value());
  }

  #color = signal('#ffff');
  get color() {
    return this.#color();
  }

  someTest() {
    const animation = this.motionservice.fromToAnimate(0, 60, {
      duration: 3,
      ease: 'easeInOut',
      onUpdate: (latest) => {
        this.#value.set(latest);
      },
    });

    const staggy = stagger(0.5);
    console.log(staggy(1, 10));
    console.log(staggy(2, 10));
    console.log(staggy(3, 10));
    console.log(staggy(6, 5));

    animation.then(() => {
      console.log('finished ');
    });
    const animationColor = this.motionservice.fromToAnimate(
      '#ffffff',
      '#000000',
      {
        duration: 3,
        ease: 'easeOut',
        onUpdate: (latest) => {
          this.#color.set(latest);
          // console.log('laty ', latest);
        },
      }
    );
  }

  title = 'showcase';
  testObj = {
    title: 'wow',
  };
  testAnimationObj: DOMKeyframesDefinition = {
    x: 100,
    scale: 0.9,
    // backgroundColor: 'red',
  };
  testAnimationObj2: DOMKeyframesDefinition = {
    scale: 1,
  };

  testTransitionObj: DynamicAnimationOptions = {
    duration: 0.3,
    // type: "spring",
    // bounce: 0.4,
    delay: stagger(0.1),
  };
}

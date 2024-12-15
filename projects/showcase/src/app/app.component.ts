import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicAnimationOptions } from '../../../ngx-motion/src/lib/types/animate.model';
import { DOMKeyframesDefinition } from '../../../ngx-motion/src/lib/types/motion.model';
import { MotionDirective } from '../../../ngx-motion/src/lib/motion.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MotionDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'showcase';
  testObj = {
    title: 'wow',
  };
  testAnimationObj: DOMKeyframesDefinition = {
    scale: 3,
    backgroundColor: "red",
  };
  testAnimationObj2: DOMKeyframesDefinition = {
    scale: 1,
  };

  testTransitionObj: DynamicAnimationOptions = {
    duration: 2,
  };
}

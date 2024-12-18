# NgxMotion


## How to use 
(TODO: write a better how to use)

##### Motion Directive
The [Motion] directive can be used directly upon the element you wish to animate:

```html
<div
  Motion
  [MotionTransition]="{ duration: 0.5 }"
  [MotionInitial]="{ scale: 1 }" **
  [MotionHover]="{ scale: 1.2 }"
  [MotionTap]="{ scale: 0.8 }"
>
  Hover and Tap on me!
</div>
```
 ** Slightly differs from react counterpart: used to reset state after revertable animations (i.e. hover and tap). If only geometric transforms are applied (translations, rotations, scale and skews) reset is handled automatically by using defaults.


### Key Features

1. **Basic Animation** [MotionAnimate] handles basic *DOMKeyframesDefinition* animations that are triggered on load.
   
2. **Transitions** *DynamicAnimationOptions* are supported by the [MotionTransition] input and used by all animations if available.

3. **Hover Effects** [MotionHover] is polyfilled by using Angular APIs. For non geometric transforms (eg. color) please provide an initial state as [MotionInitial].

4. **Tap Animations** [MotionTap] is polyfilled by using Angular APIs. For non geometric transforms (eg. color) please provide an initial state as [MotionInitial].

5. **Scroll Animations** [MotionScroll] supports both DOMKeyframesDefinition and OnScroll callback and takes in [MotionScrollOptions] for the ScrollAnimationOptions.

6. **In-View Animations** [MotionView] supports both *DOMKeyframesDefinition* and OnScroll callback and takes in [MotionViewOptions] for the *InViewAnimationOptions*.

7. **Model Animation** *AnimationPlaybackControls* of the latest animation are provided by the [MotionAnimation] model.

##### Motion Service

Allows to animate *AnimationSequence*s of elements, and threeJS objects(TODO)


### TODO

- Add support for drag gestures.
- Implement variants for reusable animations.


## Try it out

By editing the showcase project :)




## Building

To build the library, run:

```bash
ng build ngx-motion
```

This command will compile the project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:
   ```bash
   cd dist/ngx-motion
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

## Running unit tests (TODO)

## Running end-to-end tests (TODO)


## License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { SVGAttributes } from './svg.model';
import { CSSStyleDeclarationWithTransform } from './css.model';
import { Easing, EasingFunction } from 'motion';

export type StyleKeyframesDefinition = {
  [K in keyof CSSStyleDeclarationWithTransform]?: ValueKeyframesDefinition;
};
export type SVGKeyframesDefinition = {
  [K in keyof SVGAttributes]?: ValueKeyframesDefinition;
};
export type VariableKeyframesDefinition = {
  [key: `--${string}`]: ValueKeyframesDefinition;
};
export type SVGPathKeyframesDefinition = {
  [K in keyof SVGPathProperties]?: ValueKeyframesDefinition;
};
export interface SVGPathProperties {
  pathLength?: number;
  pathOffset?: number;
  pathSpacing?: number;
}

export type ValueKeyframe = string | number;
export type UnresolvedValueKeyframe = ValueKeyframe | null;
export type ValueKeyframesDefinition =
  | ValueKeyframe
  | ValueKeyframe[]
  | UnresolvedValueKeyframe[];

export type DOMKeyframesDefinition = StyleKeyframesDefinition &
  SVGKeyframesDefinition &
  SVGPathKeyframesDefinition &
  VariableKeyframesDefinition;

export interface ProgressTimeline {
  currentTime: null | { value: number };
  cancel?: VoidFunction;
}

export interface AxisScrollInfo {
  current: number;
  offset: number[];
  progress: number;
  scrollLength: number;
  velocity: number;

  // TODO Rename before documenting // Todo from original repo motion
  targetOffset: number;

  targetLength: number;
  containerLength: number;
  interpolatorOffsets?: number[];
  interpolate?: EasingFunction;
}
export interface ScrollInfo {
  time: number;
  x: AxisScrollInfo;
  y: AxisScrollInfo;
}
export type OnScrollProgress = (progress: number) => void;
export type OnScrollWithInfo = (progress: number, info: ScrollInfo) => void;

export type OnScroll = OnScrollProgress | OnScrollWithInfo;

export type ContainerTargetOffset = `${AxisValue} ${AxisValue}`;
export type AxisValueName = 'start' | 'center' | 'end';
export type AxisValuePixel = `${number}px`;
export type AxisValuePercent = `${number}%`;
export type AxisValueViewport = `${number}vh` | `${number}vw`;
export type AxisValue =
  | number
  | AxisValueName
  | AxisValuePixel
  | AxisValuePercent
  | AxisValueViewport;

export type ViewChangeHandler = (entry: IntersectionObserverEntry) => void;
export type OnStart = (
  entry: IntersectionObserverEntry
) => void | ViewChangeHandler;

export type DynamicOption<T> = (i: number, total: number) => T

export type StaggerOrigin = "first" | "last" | "center" | number
export type StaggerOptions = {
    startDelay?: number
    from?: StaggerOrigin
    ease?: Easing
}
export type StaggerFunction = (
  duration?: number,
  { startDelay, from, ease }?: StaggerOptions
) => DynamicOption<number>

export type HexColor = `#${string}`;

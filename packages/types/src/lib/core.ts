import type { Element, ElementType } from './element';

export interface CoreOptions {
  width: number;
  height: number;
  devicePixelRatio?: number;
}

export type CursorType =
  | 'resize-left'
  | 'resize-right'
  | 'resize-top'
  | 'resize-bottom'
  | 'resize-top-left'
  | 'resize-top-right'
  | 'resize-bottom-left'
  | 'resize-bottom-right';

export interface CoreEventCursor {
  type: CursorType | string | null;
  groupQueue: Element<'group'>[];
  element: Element<ElementType>;
}

export interface CoreEventSelect {
  elements: Element<ElementType>[];
}

export type CoreEvent = {
  cursor: CoreEventCursor;
  select: CoreEventSelect;
};

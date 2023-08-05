import type { Point, BoardWatcherEventMap, Data, Element, ElementType, BoardWatcherOptions, BoardWatcherStore } from '@idraw/types';
import { EventEmitter, Store } from '@idraw/util';

function isBoardAvailableNum(num: any): boolean {
  return num > 0 || num < 0 || num === 0;
}

export class BoardWatcher extends EventEmitter<BoardWatcherEventMap> {
  private _opts: BoardWatcherOptions;
  private _store: Store<BoardWatcherStore>;
  constructor(opts: BoardWatcherOptions) {
    super();
    const store = new Store<BoardWatcherStore>({ defaultStorage: { hasPointDown: false, prevClickPoint: null } });
    this._store = store;
    this._opts = opts;
    this._init();
  }

  private _init() {
    const container = window;
    container.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this._isInTarget(e)) {
        return;
      }
      // if (!this._store.get('hasPointDown')) {
      //   return;
      // }
      e.preventDefault();
      const point = this._getPoint(e);
      if (!this._isVaildPoint(point)) {
        return;
      }
      this.trigger('hover', { point });
    });
    container.addEventListener('mousedown', (e: MouseEvent) => {
      if (!this._isInTarget(e)) {
        return;
      }
      e.preventDefault();
      const point = this._getPoint(e);
      if (!this._isVaildPoint(point)) {
        return;
      }
      this._store.set('hasPointDown', true);
      this.trigger('pointStart', { point });
    });
    container.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this._isInTarget(e)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const point = this._getPoint(e);
      if (!this._isVaildPoint(point)) {
        if (this._store.get('hasPointDown')) {
          this.trigger('pointLeave', { point });
          this._store.set('hasPointDown', false);
        }
        return;
      }
      if (this._store.get('hasPointDown') !== true) {
        return;
      }
      this.trigger('pointMove', { point });
    });
    container.addEventListener('mouseup', (e: MouseEvent) => {
      this._store.set('hasPointDown', false);
      if (!this._isInTarget(e)) {
        return;
      }
      e.preventDefault();
      const point = this._getPoint(e);
      this.trigger('pointEnd', { point });
    });
    container.addEventListener('mouseleave', (e: MouseEvent) => {
      this._store.set('hasPointDown', false);
      if (!this._isInTarget(e)) {
        return;
      }
      e.preventDefault();
      const point = this._getPoint(e);
      this.trigger('pointLeave', { point });
    });
    container.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        if (!this._isInTarget(e)) {
          return;
        }
        const point = this._getPoint(e);
        if (!this._isVaildPoint(point)) {
          return;
        }
        e.preventDefault();
        const deltaX = e.deltaX > 0 || e.deltaX < 0 ? e.deltaX : 0;
        const deltaY = e.deltaY > 0 || e.deltaY < 0 ? e.deltaY : 0;

        if (e.ctrlKey === true && this.has('wheelScale')) {
          this.trigger('wheelScale', { deltaX, deltaY, point });
        } else if (this.has('wheelX') && deltaX !== 0) {
          this.trigger('wheelX', { deltaX, point });
        } else if (this.has('wheelY') && deltaY !== 0) {
          this.trigger('wheelY', { deltaY, point });
        }
      },
      { passive: false }
    );
    container.addEventListener('click', (e: MouseEvent) => {
      if (!this._isInTarget(e)) {
        return;
      }
      e.preventDefault();
      const point = this._getPoint(e);
      if (!this._isVaildPoint(point)) {
        return;
      }
      const maxLimitTime = 500;
      const t = Date.now();
      const preClickPoint = this._store.get('prevClickPoint');
      if (preClickPoint && t - preClickPoint.t <= maxLimitTime && Math.abs(preClickPoint.x - point.x) <= 5 && Math.abs(preClickPoint.y - point.y) <= 5) {
        this.trigger('doubleClick', { point });
      } else {
        this._store.set('prevClickPoint', point);
      }
    });

    container.addEventListener('contextmenu', (e: MouseEvent) => {
      if (!this._isInTarget(e)) {
        return;
      }
      e.preventDefault();
      const point = this._getPoint(e);
      if (!this._isVaildPoint(point)) {
        return;
      }
      // TODO
    });
  }

  private _isInTarget(e: MouseEvent | WheelEvent) {
    return e.target === this._opts.viewContent.boardContext.canvas;
  }

  private _getPoint(e: MouseEvent): Point {
    const boardCanvas = this._opts.viewContent.boardContext.canvas;
    const rect = boardCanvas.getBoundingClientRect();
    const p: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      t: Date.now()
    };
    return p;
  }

  private _isVaildPoint(p: Point): boolean {
    const viewSize = this._opts.sharer.getActiveViewSizeInfo();
    const { width, height } = viewSize;
    if (isBoardAvailableNum(p.x) && isBoardAvailableNum(p.y) && p.x <= width && p.y <= height) {
      return true;
    }
    return false;
  }
}

interface PointResult {
  index: number;
  element: Element<ElementType> | null;
}

export function getPointResult(p: Point, data: Data): PointResult {
  const result: PointResult = {
    index: -1,
    element: null
  };
  for (let i = 0; i < data.elements.length; i++) {
    const elem = data.elements[i];
    if (p.x >= elem.x && p.x <= elem.x + elem.w && p.y >= elem.y && p.y <= elem.y + elem.h) {
      result.index = i;
      result.element = elem;
      break;
    }
  }
  return result;
}

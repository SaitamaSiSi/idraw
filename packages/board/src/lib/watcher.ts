import { TypePoint } from 'idraw_zyh_types';
// tempTest
// import { TypePoint } from '../../../types/src/index';
import { BoardEvent, TypeBoardEventArgMap } from './event';
import { TempData } from './watcher-temp';

export class Watcher {

  private _canvas: HTMLCanvasElement;
  private _isMoving = false;
  // private _onMove?: TypeWatchCallback;
  // private _onMoveStart?: TypeWatchCallback;
  // private _onMoveEnd?: TypeWatchCallback;
  private _event: BoardEvent;
  private _temp: TempData = new TempData;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._isMoving = false;
    this._initEvent();
    this._event = new BoardEvent;
  }

  on<T extends keyof TypeBoardEventArgMap >(name: T, callback: (p: TypeBoardEventArgMap[T]) => void): void {
    this._event.on(name, callback);
  }

  off<T extends keyof TypeBoardEventArgMap >(name: T, callback: (p: TypeBoardEventArgMap[T]) => void): void {
    this._event.off(name, callback);
  }

  _initEvent(): void {
    const canvas = this._canvas;
    canvas.addEventListener('mousemove', this._listenHover.bind(this), true);
    canvas.addEventListener('mousedown', this._listenMoveStart.bind(this), true);
    canvas.addEventListener('mousemove', this._listenMove.bind(this), true);
    canvas.addEventListener('mouseup', this._listenMoveEnd.bind(this), true);
    canvas.addEventListener('mouseleave', this._listenMoveEnd.bind(this), true);
    canvas.addEventListener('mouseleave', this._listenLeave.bind(this), true);
    canvas.addEventListener('click', this._listenClick.bind(this), true);
    canvas.addEventListener('wheel', this._listenWheel.bind(this), true);

    canvas.addEventListener('touchstart', this._listenMoveStart.bind(this), true);
    canvas.addEventListener('touchmove', this._listenMove.bind(this), true);
    canvas.addEventListener('touchend', this._listenMoveEnd.bind(this), true);
  }

  _listenHover(e: MouseEvent|TouchEvent): void {
    e.preventDefault();
    const p = this._getPosition(e);
    if (this._isVaildPoint(p)) {
      if (this._event.has('hover')) {
        this._event.trigger('hover', p);
      }
    }
    this._isMoving = true;
  }

  _listenLeave(e: MouseEvent|TouchEvent): void {
    e.preventDefault();
    if (this._event.has('leave')) {
      this._event.trigger('leave', undefined);
    }
  }

  _listenMoveStart(e: MouseEvent|TouchEvent): void {
    e.preventDefault();
    const p = this._getPosition(e);
    if (this._isVaildPoint(p)) {
      if (this._event.has('point')) {
        this._event.trigger('point', p);
      }
      if (this._event.has('moveStart')) {
        this._event.trigger('moveStart', p);
      }
    }
    this._isMoving = true;
  }
  
  _listenMove(e: MouseEvent|TouchEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (this._event.has('move') && this._isMoving === true) {
      const p = this._getPosition(e);
      if (this._isVaildPoint(p)) {
        this._event.trigger('move', p);
      }
    }
  }
  
  _listenMoveEnd(e: MouseEvent|TouchEvent): void {
    e.preventDefault();
    if (this._event.has('moveEnd')) {
      const p = this._getPosition(e);
      if (this._isVaildPoint(p)) {
        this._event.trigger('moveEnd', p);
      }
    }
    this._isMoving = false;
  }

  _listenWheel(e: WheelEvent) {
    e.preventDefault();
    if (this._event.has('wheelX') && (e.deltaX > 0 || e.deltaX < 0)) {
      this._event.trigger('wheelX', e.deltaX);
    }
    if (this._event.has('wheelY') && (e.deltaY > 0 || e.deltaY < 0)) {
      this._event.trigger('wheelY', e.deltaY);
    }
  }

  _listenClick(e: MouseEvent|TouchEvent) {
    e.preventDefault();
    const maxLimitTime = 500;
    const p = this._getPosition(e);
    const t = Date.now();
    if (this._isVaildPoint(p)) {
      const preClickPoint = this._temp.get('prevClickPoint');
      if (
        preClickPoint && (t - preClickPoint.t <= maxLimitTime)
        && Math.abs(preClickPoint.x - p.x) <= 5
        && Math.abs(preClickPoint.y - p.y) <= 5
      ) {
        if (this._event.has('doubleClick')) {
          this._event.trigger('doubleClick', { x: p.x, y: p.y });
        }
      } else {
        this._temp.set('prevClickPoint', {x: p.x, y: p.y, t, })
      }
    }
  }

  _getPosition(e: MouseEvent|TouchEvent): TypePoint {
    const canvas = this._canvas;
    let x = 0;
    let y = 0;

    // @ts-ignore
    if (e && e.touches && e.touches.length > 0) {
      // @ts-ignore
      const touch: Touch = e.touches[0];
      if (touch) {
        x = touch.clientX;
        y = touch.clientY;
      }
    } else {
      // @ts-ignore
      x = e.clientX;
      // @ts-ignore
      y = e.clientY;
    }

    const p = {
      x: x - canvas.getBoundingClientRect().left,
      y: y - canvas.getBoundingClientRect().top,
      t: Date.now(),
    };
    return p;
  }

  private _isVaildPoint(p: TypePoint): boolean {
    return ( p.x > 0 && p.y > 0);
  }
  
}

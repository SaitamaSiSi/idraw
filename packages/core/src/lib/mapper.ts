import { IDrawData, Point, PointCursor } from '@idraw/types';
import Board from '@idraw/board';
import { Helper } from './helper';
import { Element } from './element';

const _board = Symbol('_displayCtx');
const _helper = Symbol('_helper');
const _element = Symbol('_element');
const _opts = Symbol('_opts');

type Options = {
  board: Board;
  element: Element;
  helper: Helper;
};

export class Mapper {
  private [_opts]: Options;
  private [_board]: Board;
  private [_helper]: Helper;
  private [_element]: Element;

  constructor(opts: Options) {
    this[_opts] = opts;
    this[_board] = this[_opts].board;
    this[_element] = this[_opts].element;
    this[_helper] = this[_opts].helper;
  }

  isEffectivePoint(p: Point): boolean {
    const scrollLineWidth = this[_board].getScrollLineWidth();
    const screenInfo = this[_board].getScreenInfo();
    if (
      p.x <= screenInfo.width - scrollLineWidth &&
      p.y <= screenInfo.height - scrollLineWidth
    ) {
      return true;
    }
    return false;
  }

  judgePointCursor(
    p: Point,
    data: IDrawData
  ): {
    cursor: PointCursor;
    elementUUID: string | null;
  } {
    let cursor: PointCursor = 'auto';
    let elementUUID: string | null = null;
    if (!this.isEffectivePoint(p)) {
      return { cursor, elementUUID };
    }
    const { uuid, hoverControllerDirection } = this[
      _helper
    ].isPointInElementWrapperController(p, data);
    const direction = hoverControllerDirection;
    if (uuid && direction) {
      switch (direction) {
        case 'top-right': {
          cursor = 'ne-resize';
          break;
        }

        case 'top-left': {
          cursor = 'nw-resize';
          break;
        }
        case 'top': {
          cursor = 'n-resize';
          break;
        }

        case 'right': {
          cursor = 'e-resize';
          break;
        }
        case 'bottom-right': {
          cursor = 'se-resize';
          break;
        }
        case 'bottom': {
          cursor = 's-resize';
          break;
        }
        case 'bottom-left': {
          cursor = 'sw-resize';
          break;
        }
        case 'left': {
          cursor = 'w-resize';
          break;
        }
        case 'rotate': {
          cursor = 'grab';
          break;
        }
        default: {
          break;
        }
      }
      if (uuid) {
        elementUUID = uuid;
      }
    } else {
      const [index, uuid] = this[_element].isPointInElement(p, data);
      if (index >= 0) {
        cursor = 'move';
      }
      if (uuid) {
        elementUUID = uuid;
      }
    }
    return {
      cursor,
      elementUUID
    };
  }
}

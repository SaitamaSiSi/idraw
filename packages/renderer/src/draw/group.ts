import type { Element, ElementType, ElementSize, RendererDrawElementOptions, ViewContext2D } from '@idraw/types';
import { rotateElement } from '@idraw/util';
import { drawCircle } from './circle';
import { drawRect } from './rect';
import { drawImage } from './image';
import { drawText } from './text';
import { drawSVG } from './svg';
import { drawHTML } from './html';
import { drawBox } from './base';

export function drawElement(ctx: ViewContext2D, elem: Element<ElementType>, opts: RendererDrawElementOptions) {
  try {
    switch (elem.type) {
      case 'rect': {
        drawRect(ctx, elem as Element<'rect'>, opts);
        break;
      }
      case 'circle': {
        drawCircle(ctx, elem as Element<'circle'>, opts);
        break;
      }
      case 'text': {
        drawText(ctx, elem as Element<'text'>, opts);
        break;
      }
      case 'image': {
        drawImage(ctx, elem as Element<'image'>, opts);
        break;
      }
      case 'svg': {
        drawSVG(ctx, elem as Element<'svg'>, opts);
        break;
      }
      case 'html': {
        drawHTML(ctx, elem as Element<'html'>, opts);
        break;
      }
      case 'group': {
        drawGroup(ctx, elem as Element<'group'>, opts);
        break;
      }
      default: {
        break;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export function drawGroup(ctx: ViewContext2D, elem: Element<'group'>, opts: RendererDrawElementOptions) {
  const { calculator, scaleInfo, viewSize } = opts;
  const { x, y, w, h, angle } = calculator.elementSize({ x: elem.x, y: elem.y, w: elem.w, h: elem.h, angle: elem.angle }, scaleInfo, viewSize);

  rotateElement(ctx, { x, y, w, h, angle }, () => {
    drawBox(ctx, { ...elem, ...{ x, y, w, h, angle } }, elem?.desc?.bgColor);
    if (Array.isArray(elem.desc.children)) {
      const { parentElementSize: parentSize } = opts;
      const newParentSize: ElementSize = {
        x: parentSize.x + elem.x,
        y: parentSize.y + elem.y,
        w: elem.w || parentSize.w,
        h: elem.h || parentSize.h,
        angle: elem.angle
      };
      const { calculator } = opts;
      ctx.save();

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      ctx.clip();

      for (let i = 0; i < elem.desc.children.length; i++) {
        let child = elem.desc.children[i];
        child = {
          ...child,
          ...{
            x: newParentSize.x + child.x,
            y: newParentSize.y + child.y
          }
        };
        if (!calculator.isElementInView(child, opts.scaleInfo, opts.viewSize)) {
          continue;
        }
        try {
          drawElement(ctx, child, { ...opts });
        } catch (err) {
          console.error(err);
        }
      }

      ctx.restore();
    }
  });
}
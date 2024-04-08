import { TypeContext, TypeData, TypeElement, } from 'idraw_zyh_types';
import { isColorStr } from 'idraw_zyh_util';
// tempTest
// import { TypeContext, TypeData, TypeElement, } from '../../../../types/src/index';
// import { isColorStr } from '../../../../util/src/index';
import Loader from '../loader';
import { clearContext, drawBgColor } from './base';
import { drawRect } from './rect';
import { drawImage } from './image';
import { drawSVG } from './svg';
import { drawHTML } from './html';
import { drawText } from './text';
import { drawCircle } from './circle';

export function drawContext(
  ctx: TypeContext,
  data: TypeData,
  loader: Loader,
): void {
  clearContext(ctx);
  const size = ctx.getSize();
  ctx.clearRect(0, 0, size.contextWidth, size.contextHeight);

  if (typeof data.bgColor === 'string' && isColorStr(data.bgColor)) {
    drawBgColor(ctx, data.bgColor);
  }

  if (!(data.elements.length > 0)) {
    return;
  }
  for (let i = 0; i < data.elements.length; i++) {
    const elem = data.elements[i];
    if (elem?.operation?.invisible === true) {
      continue;
    }
    switch (elem.type) {
      case 'rect': {
        drawRect(ctx, elem as TypeElement<'rect'>);
        break;
      }
      case 'text': {
        drawText(ctx, elem as TypeElement<'text'>, loader);
        break;
      }
      case 'image': {
        drawImage(ctx, elem as TypeElement<'image'>, loader);
        break;
      }
      case 'svg': {
        drawSVG(ctx, elem as TypeElement<'svg'>, loader);
        break;
      }
      case 'html': {
        drawHTML(ctx, elem as TypeElement<'html'>, loader);
        break;
      }
      case 'circle': {
        drawCircle(ctx, elem as TypeElement<'circle'>);
        break;
      }
      default: {
        // nothing
        break;
      }
    }
  }
  
}


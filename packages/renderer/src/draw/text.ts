import type { Element, RendererDrawElementOptions, ViewContext2D } from '@idraw/types';
import { rotateElement } from '@idraw/util';
import { is, isColorStr } from '@idraw/util';
import { drawBox } from './base';

export function drawText(ctx: ViewContext2D, elem: Element<'text'>, opts: RendererDrawElementOptions) {
  const { calculator, viewScaleInfo, viewSizeInfo } = opts;
  const { x, y, w, h, angle } = calculator.elementSize(elem, viewScaleInfo, viewSizeInfo);
  rotateElement(ctx, { x, y, w, h, angle }, () => {
    drawBox(ctx, { ...elem, ...{ x, y, w, h, angle } }, elem.detail.bgColor || 'transparent');
    const detail: Element<'text'>['detail'] = {
      ...{
        fontSize: 12,
        fontFamily: 'sans-serif',
        textAlign: 'center'
      },
      ...elem.detail
    };
    ctx.fillStyle = elem.detail.color;
    ctx.textBaseline = 'top';
    ctx.$setFont({
      fontWeight: detail.fontWeight,
      fontSize: detail.fontSize,
      fontFamily: detail.fontFamily
    });
    const detailText = detail.text.replace(/\r\n/gi, '\n');
    const fontHeight = detail.lineHeight || detail.fontSize;
    const detailTextList = detailText.split('\n');
    const lines: { text: string; width: number }[] = [];

    let lineNum = 0;
    detailTextList.forEach((tempText: string, idx: number) => {
      let lineText = '';

      if (tempText.length > 0) {
        for (let i = 0; i < tempText.length; i++) {
          if (ctx.measureText(lineText + (tempText[i] || '')).width < ctx.$doPixelRatio(w)) {
            lineText += tempText[i] || '';
          } else {
            lines.push({
              text: lineText,
              width: ctx.$undoPixelRatio(ctx.measureText(lineText).width)
            });
            lineText = tempText[i] || '';
            lineNum++;
          }
          if ((lineNum + 1) * fontHeight > h) {
            break;
          }
          if (tempText.length - 1 === i) {
            if ((lineNum + 1) * fontHeight < h) {
              lines.push({
                text: lineText,
                width: ctx.$undoPixelRatio(ctx.measureText(lineText).width)
              });
              if (idx < detailTextList.length - 1) {
                lineNum++;
              }
              break;
            }
          }
        }
      } else {
        lines.push({
          text: '',
          width: 0
        });
      }
    });

    let startY = 0;
    if (lines.length * fontHeight < h) {
      if (elem.detail.verticalAlign === 'top') {
        startY = 0;
      } else if (elem.detail.verticalAlign === 'bottom') {
        startY += h - lines.length * fontHeight;
      } else {
        // middle and default
        startY += (h - lines.length * fontHeight) / 2;
      }
    }

    // draw text lines
    {
      const _y = y + startY;
      if (detail.textShadowColor !== undefined && isColorStr(detail.textShadowColor)) {
        ctx.shadowColor = detail.textShadowColor;
      }
      if (detail.textShadowOffsetX !== undefined && is.number(detail.textShadowOffsetX)) {
        ctx.shadowOffsetX = detail.textShadowOffsetX;
      }
      if (detail.textShadowOffsetY !== undefined && is.number(detail.textShadowOffsetY)) {
        ctx.shadowOffsetY = detail.textShadowOffsetY;
      }
      if (detail.textShadowBlur !== undefined && is.number(detail.textShadowBlur)) {
        ctx.shadowBlur = detail.textShadowBlur;
      }
      lines.forEach((line, i) => {
        let _x = x;
        if (detail.textAlign === 'center') {
          _x = x + (w - line.width) / 2;
        } else if (detail.textAlign === 'right') {
          _x = x + (w - line.width);
        }
        ctx.fillText(line.text, _x, _y + fontHeight * i);
      });
    }

    // draw text stroke
    if (isColorStr(detail.strokeColor) && detail.strokeWidth !== undefined && detail.strokeWidth > 0) {
      const _y = y + startY;
      lines.forEach((line, i) => {
        let _x = x;
        if (detail.textAlign === 'center') {
          _x = x + (w - line.width) / 2;
        } else if (detail.textAlign === 'right') {
          _x = x + (w - line.width);
        }
        if (detail.strokeColor !== undefined) {
          ctx.strokeStyle = detail.strokeColor;
        }
        if (detail.strokeWidth !== undefined && detail.strokeWidth > 0) {
          ctx.lineWidth = detail.strokeWidth;
        }
        ctx.strokeText(line.text, _x, _y + fontHeight * i);
      });
    }
  });
}
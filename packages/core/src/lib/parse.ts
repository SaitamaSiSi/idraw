import { IDrawData, DataElement, DataElemDesc } from '@idraw/types';
import { elementNames } from './../constant/element';

export function parseData(data: any): IDrawData {
  const result: IDrawData = {
    elements: []
  };
  if (Array.isArray(data?.elements)) {
    data?.elements.forEach((elem: any = {}) => {
      if (isElement(elem)) {
        result.elements.push(elem);
      }
    });
  }
  if (typeof data.bgColor === 'string') {
    result.bgColor = data.bgColor;
  }
  return result;
}

function isElement(elem: DataElement<keyof DataElemDesc>): boolean {
  if (
    !(
      isNumber(elem.x) &&
      isNumber(elem.y) &&
      isNumber(elem.w) &&
      isNumber(elem.h)
    )
  ) {
    return false;
  }
  if (!(typeof elem.type === 'string' && elementNames.includes(elem.type))) {
    return false;
  }
  return true;
}

function isNumber(num: any) {
  return num >= 0 || num < 0;
}

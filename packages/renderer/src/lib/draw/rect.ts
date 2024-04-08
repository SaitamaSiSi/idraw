import {
  TypeContext,
  TypeElement,
} from 'idraw_zyh_types';
import { drawBox } from './base';
 
export function drawRect(ctx: TypeContext, elem: TypeElement<'rect'>) {
  drawBox(ctx, elem, elem.desc.bgColor as string);
}

 

 
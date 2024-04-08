import { TypeContext, TypeElement, } from 'idraw_zyh_types';
// tempTest
// import { TypeContext, TypeElement, } from '../../../../types/src/index';
import { drawBox } from './base';
 
export function drawRect(ctx: TypeContext, elem: TypeElement<'rect'>) {
  drawBox(ctx, elem, elem.desc.bgColor as string);
}

 

 
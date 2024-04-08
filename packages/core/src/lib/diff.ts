import { TypeElement, TypeData, TypeElemDesc } from 'idraw_zyh_types';
// tempTest
// import { TypeElement, TypeData, TypeElemDesc } from '../../../types/src/index';

type TypeElementMap = {
  [uuid: string]: TypeElement<keyof TypeElemDesc>
}


export function isChangeImageElementResource(
  before: TypeElement<'image'>,
  after: TypeElement<'image'>,
): boolean {
  return (before?.desc?.src !== after?.desc?.src);
}


export function isChangeSVGElementResource(
  before: TypeElement<'svg'>,
  after: TypeElement<'svg'>,
): boolean {
  return (before?.desc?.svg !== after?.desc?.svg);
}

export function isChangeHTMLElementResource(
  before: TypeElement<'html'>,
  after: TypeElement<'html'>,
): boolean {
  return (
    before?.desc?.html !== after?.desc?.html
    || before?.desc?.width !== after?.desc?.width
    || before?.desc?.height !== after?.desc?.height
  );
}

export function diffElementResourceChange(
  before: TypeElement<keyof TypeElemDesc>,
  after: TypeElement<keyof TypeElemDesc>,
): string | null {
  let result = null;
  let isChange = false;
  switch (after.type) {
    case 'image': {
      isChange = isChangeImageElementResource(
        before as TypeElement<'image'>,
        after as TypeElement<'image'>
      );
      break;
    }
    case 'svg': {
      isChange = isChangeSVGElementResource(
        before as TypeElement<'svg'>,
        after as TypeElement<'svg'>
      );
      break;
    }
    case 'html': {
      isChange = isChangeHTMLElementResource(
        before as TypeElement<'html'>,
        after as TypeElement<'html'>
      );
      break;
    }
    default: break;
  }
  if (isChange === true) {
    result = after.uuid;
  }
  return result;
}

export function diffElementResourceChangeList(
  before: TypeData,
  after: TypeData,
): string[] {
  const uuids: string[] = [];
  const beforeMap = parseDataElementMap(before);
  const afterMap = parseDataElementMap(after);
  for (const uuid in afterMap) {
    if (['image', 'svg', 'html'].includes(afterMap[uuid]?.type) !== true) {
      continue;
    }
    if (beforeMap[uuid]) {
      let isChange = false;
      switch (beforeMap[uuid].type) {
        case 'image': {
          isChange = isChangeImageElementResource(
            beforeMap[uuid] as TypeElement<'image'>,
            afterMap[uuid] as TypeElement<'image'>
          );
          break;
        }
        case 'svg': {
          isChange = isChangeSVGElementResource(
            beforeMap[uuid] as TypeElement<'svg'>,
            afterMap[uuid] as TypeElement<'svg'>
          );
          break;
        }
        case 'html': {
          isChange = isChangeHTMLElementResource(
            beforeMap[uuid] as TypeElement<'html'>,
            afterMap[uuid] as TypeElement<'html'>
          );
          break;
        }
        default: break;
      }
      if (isChange === true) {
        uuids.push(uuid);
      }
    } else {
      uuids.push(uuid);
    }
  }
  return uuids;
}


function parseDataElementMap(data: TypeData): TypeElementMap {
  const elemMap: TypeElementMap = {};
  data.elements.forEach((elem) => {
    elemMap[elem.uuid] = elem;
  })
  return elemMap;
}
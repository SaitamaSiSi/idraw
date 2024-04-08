import { TypeElemDesc, TypeElement } from 'idraw_zyh_types';
// tempTest
// import { TypeElemDesc, TypeElement } from '../../../types/src/index';
import { Record } from './../types';


type TempDataDesc = {
  isDownloading: boolean;
  isFocus: boolean,
  doRecords: Record[],
  unDoRecords: Record[],
  clipboardElements: TypeElement<keyof TypeElemDesc>[]
}

function createDefaultData() {
  return {
    isFocus: false,
    doRecords: [],
    unDoRecords: [],
    clipboardElements: [],
    isDownloading: false,
  }
}

export class TempData {

  private _temp: TempDataDesc

  constructor() {
    this._temp = createDefaultData();
  }

  set<T extends keyof TempDataDesc >(name: T, value:  TempDataDesc[T]) {
    this._temp[name] = value;
  }

  get<T extends keyof TempDataDesc >(name: T): TempDataDesc[T] {
    return this._temp[name];
  }

  clear() {
    this._temp = createDefaultData();
  }
}
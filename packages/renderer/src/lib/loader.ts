import { IDrawData, DataElement } from '@idraw/types';
import { loadImage, loadSVG, loadHTML, deepClone } from '@idraw/util';
import {
  LoaderEvent,
  TypeLoadData,
  TypeLoaderEventArgMap
} from './loader-event';
import { filterScript } from './../util/filter';

type Options = {
  maxParallelNum: number;
};

enum LoaderStatus {
  FREE = 'free',
  LOADING = 'loading',
  COMPLETE = 'complete'
}

export default class Loader {
  private _opts: Options;
  private _event: LoaderEvent;
  // private _patternMap: {[uuid: string]: CanvasPattern} = {}
  private _currentLoadData: TypeLoadData = {};
  private _currentUUIDQueue: string[] = [];
  private _storageLoadData: TypeLoadData = {};
  private _status: LoaderStatus = LoaderStatus.FREE;

  private _waitingLoadQueue: Array<{
    uuidQueue: string[];
    loadData: TypeLoadData;
  }> = [];

  constructor(opts: Options) {
    this._opts = opts;
    this._event = new LoaderEvent();
    this._waitingLoadQueue = [];
  }

  load(data: IDrawData, changeResourceUUIDs: string[]): void {
    const [uuidQueue, loadData] = this._resetLoadData(
      data,
      changeResourceUUIDs
    );
    if (
      this._status === LoaderStatus.FREE ||
      this._status === LoaderStatus.COMPLETE
    ) {
      this._currentUUIDQueue = uuidQueue;
      this._currentLoadData = loadData;
      this._loadTask();
    } else if (this._status === LoaderStatus.LOADING && uuidQueue.length > 0) {
      this._waitingLoadQueue.push({
        uuidQueue,
        loadData
      });
    }
  }

  on<T extends keyof TypeLoaderEventArgMap>(
    name: T,
    callback: (arg: TypeLoaderEventArgMap[T]) => void
  ) {
    this._event.on(name, callback);
  }

  off<T extends keyof TypeLoaderEventArgMap>(
    name: T,
    callback: (arg: TypeLoaderEventArgMap[T]) => void
  ) {
    this._event.off(name, callback);
  }

  isComplete() {
    return this._status === LoaderStatus.COMPLETE;
  }

  getContent(uuid: string): null | HTMLImageElement | HTMLCanvasElement {
    if (this._storageLoadData[uuid]?.status === 'loaded') {
      return this._storageLoadData[uuid].content;
    }
    return null;
  }

  // getPattern(
  //   elem: DataElement<keyof DataElemDesc>,
  //   opts?: {
  //     forceUpdate: boolean
  //   }
  // ): null | CanvasPattern {
  //   if (this._patternMap[elem.uuid] ) {
  //     if (!(opts && opts.forceUpdate === true)) {
  //       return this._patternMap[elem.uuid];
  //     }
  //   }
  //   const item = this._currentLoadData[elem.uuid];
  //   if (item?.status === 'loaded') {
  //     const board = this._opts.board;
  //     const tempCanvas = board.createCanvas();
  //     const tempCtx = board.createContext(tempCanvas);
  //     const image = this.getContent(elem.uuid);
  //     tempCtx.drawImage(image, elem.x, elem.y, elem.w, elem.h);

  //     const canvas = board.createCanvas();
  //     const ctx = board.createContext(canvas);
  //     const pattern = ctx.createPattern(tempCanvas, 'no-repeat');
  //     if (pattern) this._patternMap[elem.uuid] = pattern;
  //     return pattern;
  //   }
  //   return null;
  // }

  private _resetLoadData(
    data: IDrawData,
    changeResourceUUIDs: string[]
  ): [string[], TypeLoadData] {
    const loadData: TypeLoadData = {};
    const uuidQueue: string[] = [];

    const storageLoadData = this._storageLoadData;
    // const currentUUIDs: string[] = []

    // add new load-data
    for (let i = data.elements.length - 1; i >= 0; i--) {
      const elem = data.elements[i] as DataElement<'image' | 'svg' | 'html'>;
      // currentUUIDs.push(elem.uuid);
      if (['image', 'svg', 'html'].includes(elem.type)) {
        if (!storageLoadData[elem.uuid]) {
          loadData[elem.uuid] = this._createEmptyLoadItem(elem);
          uuidQueue.push(elem.uuid);
        } else {
          if (changeResourceUUIDs.includes(elem.uuid)) {
            loadData[elem.uuid] = this._createEmptyLoadItem(elem);
            uuidQueue.push(elem.uuid);
          }
          // if (elem.type === 'image') {
          //   const _ele = elem as DataElement<'image'>;
          //   if (_ele.desc.src !== storageLoadData[elem.uuid].source) {
          //     loadData[elem.uuid] = this._createEmptyLoadItem(elem);
          //     uuidQueue.push(elem.uuid);
          //   }
          // } else if (elem.type === 'svg') {
          //   const _ele = elem as DataElement<'svg'>;
          //   if (_ele.desc.svg !== storageLoadData[elem.uuid].source) {
          //     loadData[elem.uuid] = this._createEmptyLoadItem(elem);
          //     uuidQueue.push(elem.uuid);
          //   }
          // } else if (elem.type === 'html') {
          //   const _ele = elem as DataElement<'html'>;
          //   if (filterScript(_ele.desc.html) !== storageLoadData[elem.uuid].source) {
          //     loadData[elem.uuid] = this._createEmptyLoadItem(elem);
          //     uuidQueue.push(elem.uuid);
          //   }
          // }
        }
      }
    }

    // const loadDataUUIDs = Object.keys(loadData);
    // // clear unuse load-data
    // loadDataUUIDs.forEach((loadUUID) => {
    //   if (currentUUIDs.includes(loadUUID) !== true) {
    //     delete loadData[loadUUID];
    //   }
    // });
    return [uuidQueue, loadData];
  }

  private _createEmptyLoadItem(
    elem: DataElement<'image' | 'svg' | 'html'>
  ): TypeLoadData[string] {
    let source = '';

    const type: TypeLoadData[string]['type'] =
      elem.type as TypeLoadData[string]['type'];
    let elemW: number = elem.w;
    let elemH: number = elem.h;
    if (elem.type === 'image') {
      const _elem = elem as DataElement<'image'>;
      source = _elem.desc.src || '';
    } else if (elem.type === 'svg') {
      const _elem = elem as DataElement<'svg'>;
      source = _elem.desc.svg || '';
    } else if (elem.type === 'html') {
      const _elem = elem as DataElement<'html'>;
      source = filterScript(_elem.desc.html || '');
      elemW = _elem.desc.width || elem.w;
      elemH = _elem.desc.height || elem.h;
    }
    return {
      uuid: elem.uuid,
      type: type,
      status: 'null',
      content: null,
      source,
      elemW,
      elemH,
      element: deepClone(elem)
    };
  }

  private _loadTask() {
    if (this._status === LoaderStatus.LOADING) {
      return;
    }
    this._status = LoaderStatus.LOADING;

    if (this._currentUUIDQueue.length === 0) {
      if (this._waitingLoadQueue.length === 0) {
        this._status = LoaderStatus.COMPLETE;
        this._event.trigger('complete', undefined);
        return;
      } else {
        const waitingItem = this._waitingLoadQueue.shift();
        if (waitingItem) {
          const { uuidQueue, loadData } = waitingItem;
          this._currentLoadData = loadData;
          this._currentUUIDQueue = uuidQueue;
        }
      }
    }

    const { maxParallelNum } = this._opts;
    const uuids = this._currentUUIDQueue.splice(0, maxParallelNum);
    const uuidMap: { [uuid: string]: number } = {};

    uuids.forEach((url, i) => {
      uuidMap[url] = i;
    });
    const loadUUIDList: string[] = [];
    const _loadAction = () => {
      if (loadUUIDList.length >= maxParallelNum) {
        return false;
      }
      if (uuids.length === 0) {
        return true;
      }

      for (let i = loadUUIDList.length; i < maxParallelNum; i++) {
        const uuid = uuids.shift();
        if (uuid === undefined) {
          break;
        }
        loadUUIDList.push(uuid);

        this._loadElementSource(this._currentLoadData[uuid])
          .then((image) => {
            loadUUIDList.splice(loadUUIDList.indexOf(uuid), 1);
            const status = _loadAction();

            this._storageLoadData[uuid] = {
              uuid,
              type: this._currentLoadData[uuid].type,
              status: 'loaded',
              content: image,
              source: this._currentLoadData[uuid].source,
              elemW: this._currentLoadData[uuid].elemW,
              elemH: this._currentLoadData[uuid].elemH,
              element: this._currentLoadData[uuid].element
            };

            if (
              loadUUIDList.length === 0 &&
              uuids.length === 0 &&
              status === true
            ) {
              this._status = LoaderStatus.FREE;
              this._loadTask();
            }
            this._event.trigger('load', {
              uuid: this._storageLoadData[uuid]?.uuid,
              type: this._storageLoadData[uuid].type,
              status: this._storageLoadData[uuid].status,
              content: this._storageLoadData[uuid].content,
              source: this._storageLoadData[uuid].source,
              elemW: this._storageLoadData[uuid].elemW,
              elemH: this._storageLoadData[uuid].elemH,
              element: this._storageLoadData[uuid]?.element
            });
          })
          .catch((err) => {
            console.warn(err);

            loadUUIDList.splice(loadUUIDList.indexOf(uuid), 1);
            const status = _loadAction();

            if (this._currentLoadData[uuid]) {
              this._storageLoadData[uuid] = {
                uuid,
                type: this._currentLoadData[uuid]?.type,
                status: 'fail',
                content: null,
                error: err,
                source: this._currentLoadData[uuid]?.source,
                elemW: this._currentLoadData[uuid]?.elemW,
                elemH: this._currentLoadData[uuid]?.elemH,
                element: this._currentLoadData[uuid]?.element
              };
            }

            if (
              loadUUIDList.length === 0 &&
              uuids.length === 0 &&
              status === true
            ) {
              this._status = LoaderStatus.FREE;
              this._loadTask();
            }

            if (this._currentLoadData[uuid]) {
              this._event.trigger('error', {
                uuid: uuid,
                type: this._storageLoadData[uuid]?.type,
                status: this._storageLoadData[uuid]?.status,
                content: this._storageLoadData[uuid]?.content,
                source: this._storageLoadData[uuid]?.source,
                elemW: this._storageLoadData[uuid]?.elemW,
                elemH: this._storageLoadData[uuid]?.elemH,
                element: this._storageLoadData[uuid]?.element
              });
            }
          });
      }
      return false;
    };
    _loadAction();
  }

  private async _loadElementSource(
    params: TypeLoadData[string]
  ): Promise<HTMLImageElement> {
    if (params && params.type === 'image') {
      const image = await loadImage(params.source);
      return image;
    } else if (params && params.type === 'svg') {
      const image = await loadSVG(params.source);
      return image;
    } else if (params && params.type === 'html') {
      const image = await loadHTML(params.source, {
        width: params.elemW,
        height: params.elemH
      });
      return image;
    }
    throw Error("Element's source is not support!");
  }
}

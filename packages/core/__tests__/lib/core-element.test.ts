// import { TypeData } from '@idraw/types';
import  { Core } from '../../src';
import { getData } from '../data';

describe("@idraw/core: Element API", () => {
  document.body.innerHTML = `
    <div id="mount"></div>
  `;
  const opts = {
    width: 600,
    height: 400,
    contextWidth: 600,
    contextHeight: 400,
    devicePixelRatio: 4
  }
  const mount = document.querySelector('#mount') as HTMLDivElement;
  const core = new Core(mount, opts);
  const data = getData();
  core.setData(data);
  const _data = core.getData();

  test('getSelectedElements', async () => {  
    core.selectElement(_data.elements[1].uuid || '');
    const elems = core.getSelectedElements();
    expect(elems).toStrictEqual([_data.elements[1]]);
  });

  test('getElement', async () => {  
    const uuid = core.getData().elements[0]?.uuid;
    const elem = core.getElement(uuid);
    expect(elem).toStrictEqual(core.getData().elements[0])
  });

  test('getElementByIndex', async () => {  
    const index = 0;
    const elem = core.getElementByIndex(index);
    expect(elem).toStrictEqual(core.getData().elements[index])
  });

});





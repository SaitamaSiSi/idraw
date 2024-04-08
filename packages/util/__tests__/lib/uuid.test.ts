import {
  createUUID
} from '../../src/lib/uuid';


describe('idraw_zyh_util: lib/uuid', () => {
  
  test('createUUID', async () => { 
    const uuid = createUUID();
    expect(typeof uuid).toStrictEqual('string');
    expect(uuid.length).toStrictEqual(36);
  });
  
});


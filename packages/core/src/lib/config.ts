import { TypeConfig, TypeConfigStrict } from 'idraw_zyh_types';
import { deepClone } from 'idraw_zyh_util';
// tempTest
// import { TypeConfig, TypeConfigStrict } from '../../../types/src/index';
// import { deepClone } from '../../../util/src/index';

const defaultConfig: TypeConfigStrict = {
  elementWrapper: {
    color: '#2ab6f1',
    lockColor: '#aaaaaa',
    controllerSize: 6,
    lineWidth: 1,
    lineDash: [4, 3],
  }
};

function mergeConfig(config?: TypeConfig): TypeConfigStrict {
  const result = deepClone(defaultConfig);
  if (config) {
    if (config.elementWrapper) {
      result.elementWrapper = {...result.elementWrapper, ...config.elementWrapper};
    }
  }
  return result;
}

export {
  mergeConfig,
};


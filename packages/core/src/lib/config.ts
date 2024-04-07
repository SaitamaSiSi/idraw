import { IDrawConfig, IDrawConfigStrict } from '@idraw/types';
import { deepClone } from '@idraw/util';

const defaultConfig: IDrawConfigStrict = {
  elementWrapper: {
    color: '#0d85da',
    lockColor: '#aaaaaa',
    controllerSize: 6,
    lineWidth: 1,
    lineDash: [4, 3]
  }
};

function mergeConfig(config?: IDrawConfig): IDrawConfigStrict {
  const result = deepClone(defaultConfig);
  if (config) {
    if (config.elementWrapper) {
      result.elementWrapper = {
        ...result.elementWrapper,
        ...config.elementWrapper
      };
    }
  }
  return result;
}

export { mergeConfig };

export { createAttributeMatcher } from './matcher';
export type { AttributeMatcher, AttributeOption } from './matcher';
export { transformCode } from './transform';
export { validateOptions } from './config';
export type { PluginOptions } from './config';

import { createFilter } from 'vite';
import { validateOptions } from './config';
import { createAttributeMatcher } from './matcher';
import { transformCode } from './transform';
import type { PluginOptions } from './config';

export default function removeAttributes(options?: PluginOptions) {
  const config = validateOptions(options);
  
  if (config.mode === 'development') {
    return {
      name: 'remove-attributes',
      transform() {
        return null;
      }
    };
  }
  
  const filter = createFilter(config.include, config.exclude);
  const matcher = createAttributeMatcher(config.attributes);
  
  return {
    name: 'remove-attributes',
    transform(code: string, id: string) {
      if (!filter(id)) {
        return null;
      }
      
      const result = transformCode(code, matcher, {
        filename: id,
        sourceMap: true
      });
      
      if (result.code === code) {
        return null;
      }
      
      return {
        code: result.code,
        map: result.map
      };
    }
  };
}

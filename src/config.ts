export interface PluginOptions {
  attributes?: string | RegExp | (string | RegExp)[];
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];
  mode?: 'development' | 'production';
}

export function validateOptions(options?: PluginOptions): Required<PluginOptions> {
  if (!options) {
    return {
      attributes: [],
      include: [],
      exclude: [],
      mode: 'production'
    };
  }

  if (typeof options !== 'object') {
    throw new Error('Options must be an object');
  }

  const result: Required<PluginOptions> = {
    attributes: options.attributes ?? [],
    include: options.include ?? [],
    exclude: options.exclude ?? [],
    mode: options.mode ?? 'production'
  };

  if (result.mode !== 'development' && result.mode !== 'production') {
    throw new Error('Mode must be either "development" or "production"');
  }

  return result;
}

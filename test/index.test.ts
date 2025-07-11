import { describe, it, expect } from 'vitest';
import removeAttributes from '../src/index';

describe('removeAttributes plugin', () => {
  it('should return plugin object with correct name', () => {
    const plugin = removeAttributes();
    expect(plugin.name).toBe('remove-attributes');
    expect(plugin.transform).toBeDefined();
  });

  it('should return no-op plugin in development mode', () => {
    const plugin = removeAttributes({ mode: 'development' });
    expect(plugin.name).toBe('remove-attributes');
    expect(plugin.transform()).toBeNull();
  });

  it('should return production plugin by default', () => {
    const plugin = removeAttributes();
    expect(plugin.name).toBe('remove-attributes');
    expect(typeof plugin.transform).toBe('function');
  });

  it('should handle undefined options', () => {
    const plugin = removeAttributes(undefined);
    expect(plugin.name).toBe('remove-attributes');
    expect(typeof plugin.transform).toBe('function');
  });
});

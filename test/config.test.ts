import { describe, it, expect } from 'bun:test';
import { validateOptions } from '../src/config';

describe('validateOptions', () => {
  describe('default values', () => {
    it('should return default options when no options provided', () => {
      const result = validateOptions();
      expect(result).toEqual({
        attributes: [],
        include: [],
        exclude: [],
        mode: 'production'
      });
    });

    it('should return default options when undefined provided', () => {
      const result = validateOptions(undefined);
      expect(result).toEqual({
        attributes: [],
        include: [],
        exclude: [],
        mode: 'production'
      });
    });
  });

  describe('partial options', () => {
    it('should use provided attributes with defaults for others', () => {
      const result = validateOptions({ attributes: ['data-test'] });
      expect(result).toEqual({
        attributes: ['data-test'],
        include: [],
        exclude: [],
        mode: 'production'
      });
    });

    it('should use provided mode with defaults for others', () => {
      const result = validateOptions({ mode: 'development' });
      expect(result).toEqual({
        attributes: [],
        include: [],
        exclude: [],
        mode: 'development'
      });
    });

    it('should handle all options provided', () => {
      const options = {
        attributes: ['data-test', /^data-cy/],
        include: ['**/*.tsx'],
        exclude: ['**/*.test.tsx'],
        mode: 'development' as const
      };
      const result = validateOptions(options);
      expect(result).toEqual(options);
    });
  });

  describe('validation', () => {
    it('should throw error for invalid options type', () => {
      expect(() => validateOptions('invalid' as any)).toThrow('Options must be an object');
      expect(() => validateOptions(123 as any)).toThrow('Options must be an object');
      expect(() => validateOptions(true as any)).toThrow('Options must be an object');
    });

    it('should throw error for invalid mode', () => {
      expect(() => validateOptions({ mode: 'invalid' as any }))
        .toThrow('Mode must be either "development" or "production"');
      expect(() => validateOptions({ mode: 'test' as any }))
        .toThrow('Mode must be either "development" or "production"');
    });

    it('should accept valid modes', () => {
      expect(() => validateOptions({ mode: 'development' })).not.toThrow();
      expect(() => validateOptions({ mode: 'production' })).not.toThrow();
    });
  });

  describe('complex attribute patterns', () => {
    it('should handle regex patterns', () => {
      const result = validateOptions({
        attributes: /^data-test/
      });
      expect(result.attributes).toBeInstanceOf(RegExp);
    });

    it('should handle array of mixed patterns', () => {
      const patterns = [
        'data-testid',
        /^data-cy/,
        'aria-label'
      ];
      const result = validateOptions({ attributes: patterns });
      expect(result.attributes).toEqual(patterns);
    });

    it('should handle function predicates', () => {
      const predicate = (name: string) => name.startsWith('test-');
      const result = validateOptions({ attributes: predicate as any });
      expect(result.attributes).toBe(predicate);
    });
  });

  describe('include/exclude patterns', () => {
    it('should handle string patterns', () => {
      const result = validateOptions({
        include: '**/*.tsx',
        exclude: '**/*.test.tsx'
      });
      expect(result.include).toBe('**/*.tsx');
      expect(result.exclude).toBe('**/*.test.tsx');
    });

    it('should handle regex patterns', () => {
      const result = validateOptions({
        include: /\.tsx?$/,
        exclude: /\.test\.tsx?$/
      });
      expect(result.include).toBeInstanceOf(RegExp);
      expect(result.exclude).toBeInstanceOf(RegExp);
    });

    it('should handle array patterns', () => {
      const result = validateOptions({
        include: ['**/*.tsx', '**/*.jsx'],
        exclude: ['**/*.test.tsx', '**/*.spec.tsx']
      });
      expect(result.include).toEqual(['**/*.tsx', '**/*.jsx']);
      expect(result.exclude).toEqual(['**/*.test.tsx', '**/*.spec.tsx']);
    });
  });
});
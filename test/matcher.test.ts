import { describe, it, expect } from 'vitest';
import { createAttributeMatcher, AttributeMatcher } from '../src/matcher';

const DATA_TEST = "data-test";
const DATA_ID = "data-id";
const DATA_OTHER = "data-other";
const DATA_TEST_ID = "data-testid";
const DATA_ARIA_LABEL = "aria-label";
const CLASS_NAME = "className";
const ID = "id";
const CUSTOM_PROP = "custom-prop";
const OTHER_PROP = "other-prop";
const ANY = "any";
const TEST = "test";

describe('AttributeMatcher', () => {
  describe('string matching', () => {
    it('should match exact string', () => {
      const matcher = createAttributeMatcher(DATA_TEST);
      expect(matcher.matchAttribute(DATA_TEST)).toBe(true);
      expect(matcher.matchAttribute(DATA_OTHER)).toBe(false);
    });

    it('should match multiple strings', () => {
      const matcher = createAttributeMatcher([DATA_TEST, DATA_ID]);
      expect(matcher.matchAttribute(DATA_TEST)).toBe(true);
      expect(matcher.matchAttribute(DATA_ID)).toBe(true);
      expect(matcher.matchAttribute(DATA_OTHER)).toBe(false);
    });
  });

  describe('regex matching', () => {
    it('should match regex pattern', () => {
      const matcher = createAttributeMatcher(/^data-/);
      expect(matcher.matchAttribute(DATA_TEST)).toBe(true);
      expect(matcher.matchAttribute(DATA_ID)).toBe(true);
      expect(matcher.matchAttribute(ID)).toBe(false);
    });

    it('should pre-compile regex correctly', () => {
      const regex = /^data-.*$/i;
      const matcher = createAttributeMatcher(regex);
      expect(matcher.matchAttribute(DATA_TEST)).toBe(true);
      expect(matcher.matchAttribute(DATA_TEST)).toBe(true);
      expect(matcher.matchAttribute(ID)).toBe(false);
    });

    it('should handle mixed array of strings and regexes', () => {
      const matcher = createAttributeMatcher([ID, /^data-/]);
      expect(matcher.matchAttribute(ID)).toBe(true);
      expect(matcher.matchAttribute(DATA_TEST)).toBe(true);
    });
  });

  describe('function matching', () => {
    it('should use custom predicate function', () => {
      const matcher = createAttributeMatcher((name: string) => name.startsWith('custom-'));
      expect(matcher.matchAttribute(CUSTOM_PROP)).toBe(true);
      expect(matcher.matchAttribute(OTHER_PROP)).toBe(false);
    });

    it('should handle mixed array with function', () => {
      const matcher = createAttributeMatcher([
        ID,
        (name: string) => name.startsWith(CUSTOM_PROP),
        /^data-/
      ]);
      expect(matcher.matchAttribute(ID)).toBe(true);
      expect(matcher.matchAttribute(CUSTOM_PROP)).toBe(true);
      expect(matcher.matchAttribute(DATA_TEST)).toBe(true);
      expect(matcher.matchAttribute(CLASS_NAME)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const matcher = createAttributeMatcher([]);
      expect(matcher.matchAttribute(ANY)).toBe(false);
    });

    it('should handle single item array', () => {
      const matcher = createAttributeMatcher([TEST]);
      expect(matcher.matchAttribute(TEST)).toBe(true);
      expect(matcher.matchAttribute(OTHER_PROP)).toBe(false);
    });

    it('should throw error for invalid option type', () => {
      expect(() => {
        createAttributeMatcher(123 as any);
      }).toThrow('Invalid attribute option type');
    });
  });

  describe('performance', () => {
    it('should be efficient for large number of matches', () => {
      const matcher = createAttributeMatcher(/^data-/);
      const start = Date.now();
      
      for (let i = 0; i < 10000; i++) {
        matcher.matchAttribute(DATA_TEST + '-' + i);
      }
      
      const end = Date.now();
      expect(end - start).toBeLessThan(100);
    });
  });
});

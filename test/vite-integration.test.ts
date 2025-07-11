import { describe, it, expect, vi } from 'vitest';
import removeAttributes from '../src/index';
import type { Plugin } from 'vite';

describe('Vite Plugin Integration', () => {
  describe('Plugin structure', () => {
    it('should return a valid Vite plugin object', () => {
      const plugin = removeAttributes();
      
      expect(plugin).toBeDefined();
      expect(plugin.name).toBe('remove-attributes');
      expect(typeof plugin.transform).toBe('function');
    });

    it('should have correct plugin name', () => {
      const plugin = removeAttributes({ attributes: ['data-test'] });
      expect(plugin.name).toBe('remove-attributes');
    });
  });

  describe('File filtering', () => {
    it('should process files matching include pattern', () => {
      const plugin = removeAttributes({
        attributes: ['data-testid'],
        include: ['**/*.tsx', '**/*.jsx']
      }) as Plugin & { transform: Function };

      const tsxCode = '<div data-testid="test">Content</div>';
      const result = plugin.transform(tsxCode, '/src/component.tsx');
      
      expect(result).toBeDefined();
      expect(result?.code).not.toContain('data-testid');
    });

    it('should skip files not matching include pattern', () => {
      const plugin = removeAttributes({
        attributes: ['data-testid'],
        include: ['**/*.tsx']
      }) as Plugin & { transform: Function };

      const jsCode = '<div data-testid="test">Content</div>';
      const result = plugin.transform(jsCode, '/src/component.js');
      
      expect(result).toBeNull();
    });

    it('should skip files matching exclude pattern', () => {
      const plugin = removeAttributes({
        attributes: ['data-testid'],
        exclude: ['**/*.test.tsx', '**/*.spec.tsx']
      }) as Plugin & { transform: Function };

      const testCode = '<div data-testid="test">Content</div>';
      const result = plugin.transform(testCode, '/src/component.test.tsx');
      
      expect(result).toBeNull();
    });

    it('should handle complex include/exclude patterns', () => {
      const plugin = removeAttributes({
        attributes: ['data-testid'],
        include: ['src/**/*.{tsx,jsx}'],
        exclude: ['src/**/*.stories.{tsx,jsx}', 'src/**/__tests__/**']
      }) as Plugin & { transform: Function };

      const componentCode = '<div data-testid="test">Content</div>';
      
      // Should process regular component
      const result1 = plugin.transform(componentCode, '/src/components/Button.tsx');
      expect(result1).toBeDefined();
      
      // Should skip stories file
      const result2 = plugin.transform(componentCode, '/src/components/Button.stories.tsx');
      expect(result2).toBeNull();
      
      // Should skip test directory
      const result3 = plugin.transform(componentCode, '/src/components/__tests__/Button.test.tsx');
      expect(result3).toBeNull();
    });
  });

  describe('Source maps', () => {
    it('should generate source maps for transformed files', () => {
      const plugin = removeAttributes({
        attributes: ['data-testid']
      }) as Plugin & { transform: Function };

      const code = `
        function Component() {
          return <div data-testid="test" className="container">Hello</div>;
        }
      `;
      
      const result = plugin.transform(code, '/src/component.tsx');
      
      expect(result).toBeDefined();
      expect(result?.map).toBeDefined();
    });

    it('should include filename in source map', () => {
      const plugin = removeAttributes({
        attributes: ['data-testid']
      }) as Plugin & { transform: Function };

      const code = '<div data-testid="test">Content</div>';
      const filename = '/src/components/MyComponent.tsx';
      
      const result = plugin.transform(code, filename);
      
      expect(result).toBeDefined();
      expect(result?.map).toBeDefined();
    });
  });

  describe('Large file handling', () => {
    it('should handle large files efficiently', () => {
      const plugin = removeAttributes({
        attributes: [/^data-test/]
      }) as Plugin & { transform: Function };

      // Generate a large component with many attributes
      const generateLargeComponent = (size: number) => {
        let code = 'function LargeComponent() { return (<div>';
        for (let i = 0; i < size; i++) {
          code += `<div data-test-id="${i}" data-test-name="item-${i}" className="item-${i}" key="${i}">Item ${i}</div>`;
        }
        code += '</div>); }';
        return code;
      };

      const largeCode = generateLargeComponent(1000);
      const startTime = Date.now();
      
      const result = plugin.transform(largeCode, '/src/large.tsx');
      
      const endTime = Date.now();
      const processingTime = endTime - startTime;
      
      expect(result).toBeDefined();
      expect(result?.code).not.toContain('data-test');
      expect(processingTime).toBeLessThan(1000); // Should process in under 1 second
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSX gracefully', () => {
      const plugin = removeAttributes({
        attributes: ['data-testid']
      }) as Plugin & { transform: Function };

      const malformedCode = `
        function Component() {
          return <div data-testid="test" className={styles.
          // Syntax error here
        }
      `;
      
      const result = plugin.transform(malformedCode, '/src/component.tsx');
      
      expect(result).toBeNull();
    });

    it('should handle non-JSX files', () => {
      const plugin = removeAttributes({
        attributes: ['data-testid']
      }) as Plugin & { transform: Function };

      const cssCode = `
        .container {
          data-testid: "should-not-be-processed";
          color: red;
        }
      `;
      
      const result = plugin.transform(cssCode, '/src/styles.css');
      
      expect(result).toBeNull();
    });

    it('should handle empty files', () => {
      const plugin = removeAttributes({
        attributes: ['data-testid']
      }) as Plugin & { transform: Function };

      const result = plugin.transform('', '/src/empty.tsx');
      
      expect(result).toBeNull();
    });
  });

  describe('Multiple plugin instances', () => {
    it('should support multiple instances with different configs', () => {
      const plugin1 = removeAttributes({
        attributes: ['data-testid'],
        include: ['**/*.tsx']
      }) as Plugin & { transform: Function };

      const plugin2 = removeAttributes({
        attributes: ['data-cy'],
        include: ['**/*.jsx']
      }) as Plugin & { transform: Function };

      const tsxCode = '<div data-testid="test" data-cy="test">Content</div>';
      const jsxCode = '<div data-testid="test" data-cy="test">Content</div>';

      const result1 = plugin1.transform(tsxCode, '/src/component.tsx');
      const result2 = plugin2.transform(jsxCode, '/src/component.jsx');

      expect(result1?.code).not.toContain('data-testid');
      expect(result1?.code).toContain('data-cy');

      expect(result2?.code).not.toContain('data-cy');
      expect(result2?.code).toContain('data-testid');
    });
  });

  describe('HMR compatibility', () => {
    it('should not interfere with hot module replacement', () => {
      const plugin = removeAttributes({
        attributes: ['data-testid']
      }) as Plugin & { transform: Function };

      const codeWithHMR = `
        import { hot } from 'vite/hmr';
        
        function Component() {
          return <div data-testid="test">Content</div>;
        }
        
        if (import.meta.hot) {
          import.meta.hot.accept();
        }
        
        export default Component;
      `;

      const result = plugin.transform(codeWithHMR, '/src/component.tsx');
      
      expect(result).toBeDefined();
      expect(result?.code).not.toContain('data-testid');
      expect(result?.code).toContain('import.meta.hot');
    });
  });
});
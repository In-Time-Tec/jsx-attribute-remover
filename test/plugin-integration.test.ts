import { describe, it, expect } from 'vitest';
import removeAttributes from '../src/index';

describe('removeAttributes plugin integration', () => {
  it('should transform JSX code by removing specified attributes', () => {
    const plugin = removeAttributes({
      attributes: ['data-testid', 'aria-label'],
      mode: 'production'
    });

    const code = `
      const Component = () => (
        <div data-testid="test" className="container" aria-label="Test">
          <span id="example">Hello World</span>
        </div>
      );
    `;

    const result = plugin.transform(code, 'test.tsx');
    
    expect(result).toBeDefined();
    expect(result!.code).toBeDefined();
    expect(result!.code).not.toContain('data-testid');
    expect(result!.code).not.toContain('aria-label');
    expect(result!.code).toContain('className');
    expect(result!.code).toContain('id');
  });

  it('should return null for non-matching files', () => {
    const plugin = removeAttributes({
      attributes: ['data-testid'],
      include: ['**/*.tsx'],
      mode: 'production'
    });

    const code = `const x = 1;`;
    const result = plugin.transform(code, 'test.js');
    
    expect(result).toBeNull();
  });

  it('should return null when no attributes are removed', () => {
    const plugin = removeAttributes({
      attributes: ['data-testid'],
      mode: 'production'
    });

    const code = `
      const Component = () => (
        <div className="container">
          <span id="example">Hello World</span>
        </div>
      );
    `;

    const result = plugin.transform(code, 'test.tsx');
    
    expect(result).toBeNull();
  });

  it('should handle invalid code gracefully', () => {
    const plugin = removeAttributes({
      attributes: ['data-testid'],
      mode: 'production'
    });

    const code = `invalid javascript code {{{`;
    const result = plugin.transform(code, 'test.tsx');
    
    expect(result).toBeNull();
  });
});

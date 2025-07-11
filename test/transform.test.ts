import { describe, it, expect } from 'bun:test';
import { transformCode } from '../src/transform';
import { createAttributeMatcher } from '../src/matcher';

describe('transformCode', () => {
  describe('basic transformations', () => {
    it('should remove matching attributes from JSX elements', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `<div data-testid="test" className="container">Hello</div>`;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
      expect(result.code).toContain('className');
    });

    it('should handle multiple attributes', () => {
      const matcher = createAttributeMatcher(['data-testid', 'data-cy']);
      const input = `
        <button 
          data-testid="submit"
          data-cy="submit-btn"
          onClick={handleClick}
          className="btn"
        >
          Submit
        </button>
      `;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
      expect(result.code).not.toContain('data-cy');
      expect(result.code).toContain('onClick');
      expect(result.code).toContain('className');
    });

    it('should handle regex patterns', () => {
      const matcher = createAttributeMatcher(/^data-/);
      const input = `
        <div 
          data-test="1"
          data-id="2"
          data-value="3"
          id="main"
          className="container"
        >
          Content
        </div>
      `;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-test');
      expect(result.code).not.toContain('data-id');
      expect(result.code).not.toContain('data-value');
      expect(result.code).toContain('id="main"');
      expect(result.code).toContain('className');
    });
  });

  describe('complex JSX structures', () => {
    it('should handle nested JSX elements', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `
        <div data-testid="parent">
          <span data-testid="child1">Text</span>
          <button data-testid="child2">Click</button>
          <div>
            <p data-testid="nested">Nested</p>
          </div>
        </div>
      `;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
      expect(result.code.match(/<div>/g)?.length).toBeGreaterThan(0);
    });

    it('should handle JSX fragments', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `
        <>
          <div data-testid="first">First</div>
          <div data-testid="second">Second</div>
        </>
      `;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
    });

    it('should handle self-closing tags', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `
        <div>
          <input data-testid="input" type="text" />
          <img data-testid="image" src="test.jpg" />
          <CustomComponent data-testid="custom" prop="value" />
        </div>
      `;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
      expect(result.code).toContain('type="text"');
      expect(result.code).toContain('src="test.jpg"');
      expect(result.code).toContain('prop="value"');
    });
  });

  describe('React components', () => {
    it('should handle functional components', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `
        function Button({ onClick }) {
          return (
            <button data-testid="btn" onClick={onClick}>
              Click me
            </button>
          );
        }
      `;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
      expect(result.code).toContain('onClick={onClick}');
    });

    it('should handle arrow function components', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `
        const Card = ({ title, content }) => (
          <div data-testid="card" className="card">
            <h2 data-testid="card-title">{title}</h2>
            <p data-testid="card-content">{content}</p>
          </div>
        );
      `;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
      expect(result.code).toContain('className="card"');
    });

    it('should handle components with hooks', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `
        function Counter() {
          const [count, setCount] = useState(0);
          
          return (
            <div data-testid="counter">
              <span data-testid="count">{count}</span>
              <button data-testid="increment" onClick={() => setCount(count + 1)}>
                +
              </button>
            </div>
          );
        }
      `;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
      expect(result.code).toContain('useState');
      expect(result.code).toContain('onClick');
    });
  });

  describe('attribute value types', () => {
    it('should handle string attribute values', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `<div data-testid="simple-string" id="test">Text</div>`;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
      expect(result.code).toContain('id="test"');
    });

    it('should handle expression attribute values', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `<div data-testid={dynamicId} className={styles.container}>Text</div>`;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
      expect(result.code).toContain('className={styles.container}');
    });

    it('should handle boolean attributes', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `
        <div>
          <input data-testid="input" disabled />
          <button data-testid="btn" disabled={isDisabled}>Click</button>
        </div>
      `;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
      expect(result.code).toContain('disabled');
      expect(result.code).toContain('disabled={isDisabled}');
    });
  });

  describe('edge cases', () => {
    it('should handle empty code', () => {
      const matcher = createAttributeMatcher('data-testid');
      const result = transformCode('', matcher);
      
      expect(result.code).toBe('');
    });

    it('should handle non-string input', () => {
      const matcher = createAttributeMatcher('data-testid');
      const result = transformCode(null as any, matcher);
      
      expect(result.code).toBeNull();
    });

    it('should handle invalid JSX gracefully', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = 'const x = <div data-testid="test" invalid jsx here';
      const result = transformCode(input, matcher);
      
      expect(result.code).toBe(input);
    });

    it('should preserve code when no matches found', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `<div className="container">No test ids here</div>`;
      const result = transformCode(input, matcher);
      
      expect(result.code).toBe(input);
    });

    it('should handle spread attributes', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `
        <div {...props} data-testid="test">
          <span data-testid="child" {...otherProps}>Text</span>
        </div>
      `;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
      expect(result.code).toContain('{...props}');
      expect(result.code).toContain('{...otherProps}');
    });
  });

  describe('source maps', () => {
    it('should generate source maps when requested', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `<div data-testid="test">Hello</div>`;
      const result = transformCode(input, matcher, {
        sourceMap: true,
        filename: 'test.tsx'
      });
      
      expect(result.map).toBeDefined();
      expect(result.map).not.toBeNull();
    });

    it('should not generate source maps by default', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `<div data-testid="test">Hello</div>`;
      const result = transformCode(input, matcher);
      
      expect(result.map).toBeFalsy();
    });
  });

  describe('TypeScript support', () => {
    it('should handle TypeScript generics', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `
        function List<T>({ items }: { items: T[] }) {
          return (
            <ul data-testid="list">
              {items.map((item, index) => (
                <li key={index} data-testid={\`item-\${index}\`}>
                  {item}
                </li>
              ))}
            </ul>
          );
        }
      `;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
      expect(result.code).toContain('function List<T>');
    });

    it('should handle type assertions', () => {
      const matcher = createAttributeMatcher('data-testid');
      const input = `
        const element = (
          <div data-testid="typed" ref={ref as React.RefObject<HTMLDivElement>}>
            Content
          </div>
        );
      `;
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toContain('data-testid');
      expect(result.code).toContain('as React.RefObject<HTMLDivElement>');
    });
  });
});
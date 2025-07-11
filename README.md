# React Attribute Remover

A Vite plugin for automatically removing specified attributes from React/JSX components during the build process. Perfect for stripping out development-only attributes like `data-testid`, `data-cy`, or any custom attributes from your production builds.

## Features

- 🚀 **Zero runtime overhead** - Attributes are removed at build time
- 🎯 **Flexible matching** - Support for exact strings, regex patterns, and custom functions
- ⚡ **Optimized performance** - Pre-compiled patterns and efficient AST traversal
- 🔧 **Development mode** - Optionally preserve attributes in development
- 📦 **TypeScript support** - Full type definitions included
- 🎮 **Vite integration** - Seamless integration with Vite's build pipeline

## Installation

```bash
npm install --save-dev react-attribute-remover
```

```bash
yarn add --dev react-attribute-remover
```

```bash
pnpm add -D react-attribute-remover
```

## Quick Start

Add the plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import removeAttributes from 'react-attribute-remover';

export default defineConfig({
  plugins: [
    removeAttributes({
      attributes: ['data-testid', 'data-cy']
    })
  ]
});
```

## Configuration

### Basic Options

```typescript
interface PluginOptions {
  // Attributes to remove (string, regex, or function)
  attributes?: string | RegExp | (string | RegExp | ((name: string) => boolean))[];
  
  // Files to include (minimatch patterns)
  include?: string | RegExp | (string | RegExp)[];
  
  // Files to exclude (minimatch patterns)
  exclude?: string | RegExp | (string | RegExp)[];
  
  // Mode to run in ('development' or 'production')
  mode?: 'development' | 'production';
}
```

### Examples

#### Remove Test Attributes

```typescript
removeAttributes({
  attributes: ['data-testid', 'data-test', 'data-cy']
})
```

#### Remove Attributes by Pattern

```typescript
removeAttributes({
  attributes: [
    /^data-test/,      // Remove all data-test* attributes
    /^data-cy-/,       // Remove all data-cy-* attributes
    'data-automation'  // Remove exact match
  ]
})
```

#### Custom Predicate Function

```typescript
removeAttributes({
  attributes: [
    (name) => name.startsWith('test-'),
    (name) => name.includes('debug')
  ]
})
```

#### Development Mode

Keep attributes in development, remove in production:

```typescript
removeAttributes({
  attributes: ['data-testid'],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
})
```

#### File Filtering

Only process specific files:

```typescript
removeAttributes({
  attributes: ['data-testid'],
  include: ['**/*.tsx', '**/*.jsx'],
  exclude: ['**/*.test.tsx', '**/*.spec.jsx']
})
```

## How It Works

The plugin uses Babel to parse your JSX code into an AST (Abstract Syntax Tree), traverses the tree to find matching attributes, and removes them before generating the final code. This happens during Vite's transform phase, ensuring:

1. **Build-time removal** - No runtime overhead
2. **Source map support** - Debugging remains accurate
3. **Preservation of code structure** - Only attributes are removed

## Example Transformation

**Before:**
```jsx
function Button({ onClick, children }) {
  return (
    <button 
      data-testid="submit-button"
      data-cy="submit"
      className="btn btn-primary"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

**After:**
```jsx
function Button({ onClick, children }) {
  return (
    <button 
      className="btn btn-primary"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

## API Reference

### Plugin Function

```typescript
export default function removeAttributes(options?: PluginOptions): VitePlugin
```

Creates a Vite plugin instance with the specified options.

### Attribute Matcher

The plugin exports utilities for creating attribute matchers:

```typescript
import { createAttributeMatcher } from 'react-attribute-remover';

const matcher = createAttributeMatcher(['data-test', /^aria-/]);
console.log(matcher.matchAttribute('data-test'));     // true
console.log(matcher.matchAttribute('aria-label'));    // true
console.log(matcher.matchAttribute('className'));     // false
```

See [MATCHER_README.md](./MATCHER_README.md) for detailed matcher documentation.

## Performance Considerations

- **Regex compilation**: Regular expressions are pre-compiled once during initialization
- **AST caching**: Vite handles caching of transformed modules
- **Minimal overhead**: Only files matching include/exclude patterns are processed
- **No runtime impact**: All transformations happen at build time

## Common Use Cases

### 1. Remove Testing Attributes

```typescript
removeAttributes({
  attributes: ['data-testid', 'data-test', 'data-cy', 'data-test-id']
})
```

### 2. Remove Development Attributes

```typescript
removeAttributes({
  attributes: [/^data-dev-/, 'data-debug', 'data-inspector']
})
```

### 3. Conditional Removal

```typescript
removeAttributes({
  attributes: ['data-analytics'],
  mode: process.env.DISABLE_ANALYTICS ? 'production' : 'development'
})
```

### 4. Framework-Specific Attributes

```typescript
// Remove Playwright test attributes
removeAttributes({
  attributes: [/^data-pw-/]
})

// Remove Cypress test attributes
removeAttributes({
  attributes: [/^data-cy-/]
})
```

## TypeScript

Full TypeScript support is included. The plugin exports all necessary types:

```typescript
import removeAttributes, { 
  PluginOptions, 
  AttributeOption,
  AttributeMatcher 
} from 'react-attribute-remover';
```

## Troubleshooting

### Attributes not being removed

1. Check that your file matches the `include` pattern
2. Verify the attribute name matches your pattern exactly
3. Ensure you're not in development mode
4. Check that the file contains valid JSX

### Build errors

1. Ensure you have a compatible Vite version (^5.0.0)
2. Check for syntax errors in your JSX
3. Verify your TypeScript configuration if using `.tsx` files

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License - see LICENSE file for details
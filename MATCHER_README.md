# Attribute Matcher Module

The attribute matcher is a core module of react-attribute-remover that provides high-performance pattern matching for JSX attributes. It converts various matching options (strings, regexes, functions) into optimized predicate functions.

## Usage

```typescript
import { createAttributeMatcher } from 'react-attribute-remover';

// String matching
const matcher1 = createAttributeMatcher('data-test');
matcher1.matchAttribute('data-test'); // true
matcher1.matchAttribute('data-other'); // false

// Regex matching (pre-compiled for efficiency)
const matcher2 = createAttributeMatcher(/^data-/);
matcher2.matchAttribute('data-test'); // true
matcher2.matchAttribute('data-id'); // true
matcher2.matchAttribute('id'); // false

// Multiple options
const matcher3 = createAttributeMatcher(['id', 'class', /^data-/]);
matcher3.matchAttribute('id'); // true
matcher3.matchAttribute('data-test'); // true
matcher3.matchAttribute('style'); // false

// Custom predicate function
const matcher4 = createAttributeMatcher(name => name.startsWith('custom-'));
matcher4.matchAttribute('custom-prop'); // true
matcher4.matchAttribute('other-prop'); // false
```

## API

### `createAttributeMatcher(options)`

Creates a new attribute matcher instance.

**Parameters:**
- `options`: `AttributeOption | AttributeOption[]`
  - `string`: Exact string match
  - `RegExp`: Regular expression match (pre-compiled for performance)
  - `(name: string) => boolean`: Custom predicate function
  - Array of any combination of the above

**Returns:** `AttributeMatcher`

### `AttributeMatcher.matchAttribute(name: string): boolean`

Tests if the given attribute name matches the configured criteria.

**Parameters:**
- `name`: The attribute name to test

**Returns:** `boolean` - `true` if the attribute matches, `false` otherwise

## Performance Features

- **Pre-compiled Regexes**: Regular expressions are compiled once during matcher creation for optimal performance
- **Efficient Predicates**: String matches use direct equality comparison
- **Short-circuit Evaluation**: Array-based matchers use early termination on first match
- **Minimal Memory Overhead**: Predicates are pre-built and cached

## Type Definitions

```typescript
type AttributeOption = string | RegExp | ((name: string) => boolean);

interface AttributeMatcher {
  matchAttribute(name: string): boolean;
}
```

## Implementation Details

The matcher uses a strategy pattern to handle different attribute option types:

1. **String options** → Direct equality check
2. **RegExp options** → Pre-compiled regex test
3. **Function options** → Direct function call
4. **Array options** → Combined predicate with OR logic

This design ensures optimal performance regardless of the matching pattern used.

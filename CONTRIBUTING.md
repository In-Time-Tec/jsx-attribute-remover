# Contributing to JSX Attribute Remover

Thank you for your interest in contributing to JSX Attribute Remover! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/jsx-attribute-remover.git`
3. Install dependencies: `bun install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch
```

### Building

```bash
bun run build
```

### Development Mode

```bash
bun run dev
```

## Making Changes

1. **Write tests first**: Add tests for any new functionality or bug fixes
2. **Follow existing code style**: Match the patterns used in the codebase
3. **Keep commits focused**: Each commit should represent a single logical change
4. **Update documentation**: Update README.md or other docs if needed

## Testing Guidelines

- All new features must have tests
- Tests should cover both positive and negative cases
- Use descriptive test names that explain what is being tested
- Group related tests using `describe` blocks

## Code Style

- Use TypeScript for all new code
- Follow the existing patterns in the codebase
- Use meaningful variable and function names
- Add type annotations where TypeScript can't infer them

## Pull Request Process

1. Ensure all tests pass: `bun test`
2. Update documentation if you've made API changes
3. Add a descriptive title and description to your PR
4. Link any related issues
5. Wait for code review

## Reporting Issues

When reporting issues, please include:

- Node.js version
- Vite version
- A minimal reproduction example
- Expected behavior
- Actual behavior

## Questions?

Feel free to open an issue for any questions about contributing.
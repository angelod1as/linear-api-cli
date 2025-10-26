# Contributing to Linear API CLI

Thank you for your interest in contributing! This project aims to provide a simple, non-interactive CLI for Linear that's perfect for LLM agents and automation.

## How to Contribute

### Reporting Bugs

If you find a bug, please [open an issue](https://github.com/angelodias/linear-api-cli/issues) with:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Your environment (Node.js version, OS, pnpm version)
- Any relevant error messages or logs

### Suggesting Features

Feature suggestions are welcome! Please [open an issue](https://github.com/angelodias/linear-api-cli/issues) with:

- A clear description of the feature
- The problem it solves or use case it enables
- Any examples of how it would work
- Whether you're willing to help implement it

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/linear-api-cli.git
   cd linear-api-cli
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up your environment**
   ```bash
   cp .env.example .env
   # Add your LINEAR_API_KEY and LINEAR_TEAM_ID to .env
   ```

4. **Run tests**
   ```bash
   pnpm test
   ```

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Keep changes focused and atomic
   - Maintain the non-interactive, LLM-friendly design philosophy
   - Follow existing code style and patterns
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Run the test suite
   pnpm test

   # Test commands manually
   pnpm linear:teams
   pnpm linear:list
   pnpm linear:create --title "Test issue"
   ```

4. **Commit your changes**
   - Write clear, descriptive commit messages
   - Reference any related issues

### Pull Request Process

1. **Update documentation**
   - Update README.md if you've added/changed features
   - Update USAGE.md if you've changed command behavior
   - Add examples for new features

2. **Submit your PR**
   - Provide a clear description of the changes
   - Reference any related issues (e.g., "Fixes #123")
   - Explain why the changes are needed

3. **Review process**
   - Maintainers will review your PR
   - Address any feedback or requested changes
   - Once approved, your PR will be merged

## Design Philosophy

When contributing, please keep these principles in mind:

1. **Non-interactive**: All commands should work with flags only, no prompts
2. **LLM-friendly**: Output should be clear, consistent, and easily parsable
3. **Simple**: Keep the API surface small and focused
4. **Portable**: The tool should work standalone with minimal setup
5. **Well-documented**: Every feature should be documented with examples

## Code Style

- Use TypeScript for type safety
- Follow existing code formatting
- Use descriptive variable and function names
- Add comments for complex logic
- Keep functions focused and single-purpose

## Testing

- Test all new features with the test suite
- Ensure existing tests still pass
- Test edge cases and error conditions
- Verify documentation examples work correctly

## Questions?

If you have questions about contributing, feel free to:

- [Open an issue](https://github.com/angelodias/linear-api-cli/issues) with the "question" label
- Check existing issues and discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

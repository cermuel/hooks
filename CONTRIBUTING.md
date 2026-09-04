# Contributing

Thank you for contributing to Cermuel Hooks.

## Before You Begin

For larger changes or new hooks, open or comment on an issue before beginning implementation.

## Local Development

Fork and clone the repository, then install the dependencies:

```bash
pnpm install
```

Run the documentation website:

```bash
pnpm dev
```

## Project Checks

Before opening a pull request, run:

```bash
pnpm check
```

## Adding a Hook

A public hook or composable should include:

- Shared core behaviour where practical
- A React implementation
- A Vue implementation
- TypeScript types
- SSR protection where relevant
- Cleanup logic where relevant
- Unit tests
- Documentation and examples

## Pull Requests

1. Create a focused feature branch.
2. Keep the change limited to one feature or fix.
3. Add or update tests.
4. Update documentation for public API changes.
5. Run the project checks.
6. Open a pull request against `main`.

## Commit Messages

Use Conventional Commits:

```text
feat(clipboard): add copy to clipboard
fix(storage): guard browser APIs during SSR
docs: update installation guide
test(network): cover connection changes
```

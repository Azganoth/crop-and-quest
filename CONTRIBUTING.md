# Contributing

Crop & Quest is an open-source project. Contributions are welcome, especially for game presets, export correctness, accessibility, documentation, and user experience.

## Requirements

Use the versions declared in `package.json`.

You will need:

- Node.js
- pnpm

```bash
corepack enable
pnpm install
```

## Commands

```bash
pnpm dev       # start the development server
pnpm build     # create a production build
pnpm lint      # run oxlint for fast syntax checking
pnpm typecheck # run typescript compiler for strict type checking
pnpm check     # run both lint and typecheck
pnpm fmt       # run oxfmt for code formatting
```

## Project Guidance

- Follow the specification in [`DOCS.md`](./DOCS.md).
- Keep image processing client-side unless a documented decision says otherwise.
- Prefer small, readable changes over broad rewrites.

## Adding a Game Preset

A preset contribution should include:

- game name
- unique preset id
- required portrait dimensions
- required output filenames
- source or explanation for the dimensions and filenames
- install folder notes, if known

Do not include official game artwork unless permission or a compatible license allows it.

## Legal

Crop & Quest is an unofficial fan-made tool.

Do not add copyrighted game artwork, logos, or extracted assets unless permission or a compatible license allows it.

Game names may be used for identification and preset compatibility, but avoid implying affiliation, endorsement, or sponsorship.

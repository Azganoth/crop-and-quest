# Contributing

Crop & Quest is an open-source project.

Contributions are welcome, especially for game presets, export correctness, accessibility, documentation, and user experience.

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
pnpm dev      # start the development server
pnpm build    # create a production build
pnpm lint     # run oxlint
pnpm fmt      # run oxfmt
```

## Project Guidance

- Follow the rules in [`AGENTS.md`](./AGENTS.md).
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

## Pull Request Checklist

Before opening a pull request:

- [ ] Run `pnpm fmt`
- [ ] Run `pnpm lint`
- [ ] Run `pnpm build`
- [ ] Update `DOCS.md` for specification, route, runtime, architecture, or privacy changes
- [ ] Update `README.md` for public-facing feature or setup changes
- [ ] Include sources for new or changed game preset dimensions

## Legal

Crop & Quest is an unofficial fan-made tool.

Do not add copyrighted game artwork, logos, or extracted assets unless permission or a compatible license allows it.

Game names may be used for identification and preset compatibility, but avoid implying affiliation, endorsement, or sponsorship.

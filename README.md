[![BSD-3-Clause](https://img.shields.io/badge/BSD--3--Clause-green?style=flat)](https://github.com/valksor/stencil-valksor/blob/master/LICENSE)
[![Coverage Status](https://coveralls.io/repos/github/valksor/stencil-valksor/badge.svg?branch=master)](https://coveralls.io/github/valksor/stencil-valksor?branch=master)
[![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)](https://stenciljs.com)

# Valksor Web Components

Valksor is building a growing collection of UI-focused Web Components powered by [Stencil](https://stenciljs.com). The components live in this monorepo and share build tooling, styles, and publishing workflows so it is easy to add new primitives as the design system evolves.

## Components

| Tag              | Description                                                                                                                               | Notes                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `<latvian-flag>` | Renders Latvia's crimson-white-crimson flag with configurable colors, ratios, and orientation (vertical by default, horizontal optional). | First published component, serves as a reference for upcoming additions. |

More components are on the roadmap—follow the same patterns in `src/components` when adding new ones so they slot into the shared pipeline without additional configuration.

## Local Development

```bash
bun install
bun run start
```

`bun run start` builds Tailwind assets, starts Stencil in dev/watch mode, and serves the demo app in `www`. Edit files under `src` and the dev server will reload automatically.

### Other Scripts

- `bun run build.local.css` – generates unminified local Tailwind styles (`src/styles/index.css`).
- `bun run build.css` – builds the minified component stylesheet (`src/styles/components.min.css`).
- `bun run build` – runs both CSS steps and produces production bundles in `dist/`.
- `bun run test` or `bun run test.watch` – executes Stencil unit + e2e suites.
- `bun run generate` – scaffolds a new component (you will be prompted for a tag name).

## Consuming the Package

Install the package from npm/GitHub Packages and choose the loading strategy that fits your app.

### Lazy Loading the Whole Bundle

```html
<script type="module" src="https://unpkg.com/@valksor/valksor"></script>
<latvian-flag class="w-6" class2="w-3"></latvian-flag>
```

The namespace bootstrap registers every published component, so additional tags will automatically become available as they are released.

### Tree-shaking Individual Components

```ts
import '@valksor/valksor/latvian-flag';

const Flag = () => <latvian-flag class="border" />;
export default Flag;
```

Alternatively, import from `@valksor/valksor/dist/components` if you prefer bundler-friendly ESM modules.

## Creating New Components

1. Run `bun run generate` and follow the prompts.
2. Implement the component in `src/components/<name>/<name>.tsx`.
3. Add any shared styles to `src/styles`.
4. Update this README's **Components** table with a short description so consumers know what is available.
5. Run `bun run build` and `bun run test` before publishing.

Refer to the [Stencil docs](https://stenciljs.com/docs/introduction) for guidance on decorators, lifecycle hooks, and publishing strategies.

## License

BSD 3-Clause © Valksor.

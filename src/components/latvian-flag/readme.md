# latvian-flag

Latvia's crimson-white-crimson flag rendered as a zero-dependency web component. The element uses simple `div` stripes, so you can stretch or shrink it entirely through CSS utility classes.

## Examples

### Default

```html
<latvian-flag></latvian-flag>
```

### Custom Classes

```html
<latvian-flag class="bg-latvian h-12 w-3" class2="w-8 bg-white"></latvian-flag>
```

### Large Size

```html
<latvian-flag class="bg-latvian h-12 w-24 rounded" class2="w-12 bg-white"></latvian-flag>
```

### With Border

```html
<latvian-flag class="bg-latvian h-3 w-32 border-[6px]" class2="w-12 border-[6px] bg-white"></latvian-flag>
```

## Usage Notes

- `class` is applied to the crimson stripes (outer rectangles).
- `class2` is applied to the white stripe (center rectangle).
  Target these to control width, border thickness, colors, etc.

### React + Stencil loader example

```tsx
import { useEffect } from 'react';
import { defineCustomElements } from 'valksor/loader';

export function Hero() {
    useEffect(() => {
        defineCustomElements();
    }, []);

    return <latvian-flag class="w-20 border-4" class2="w-10 border-4" />;
}
```

## Styling tips

- Apply Tailwind utility classes or your own CSS via the `class` / `class2` props.
- Add `block`/`inline-flex` to the host element to integrate with surrounding text/layout.
- To animate flag reveal, wrap the component in your own container and use keyframes on that wrapper; the component renders static stripes for performance.

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description | Type     | Default |
| -------- | --------- | ----------- | -------- | ------- |
| `class`  | `class`   |             | `string` | `''`    |
| `class2` | `class2`  |             | `string` | `''`    |

---

_Built with [StencilJS](https://stenciljs.com/)_

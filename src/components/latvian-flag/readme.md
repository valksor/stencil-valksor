# latvian-flag

Latvia's crimson-white-crimson flag rendered as a zero-dependency web component. The element exposes layout, color, and orientation knobs through properties so you can configure it without depending on global CSS utilities.

## Examples

### Default

```html
<latvian-flag></latvian-flag>
```

### Fixed Width With Rounded Corners

```html
<latvian-flag width="120" border-radius="0.75rem"></latvian-flag>
```

### Custom Colors & Stripe Ratio

```html
<latvian-flag outer-color="#7b0015" inner-color="#f7f2e8" center-stripe-ratio="1.26"></latvian-flag>
```

### Explicit Height + Border

```html
<latvian-flag height="56" border-width="6" border-color="#52000c"></latvian-flag>
```

### Altered Aspect Ratio (Badge Style)

```html
<latvian-flag width="160" aspect-ratio="1.6" border-radius="999px"></latvian-flag>
```

### Horizontal Orientation

```html
<latvian-flag orientation="horizontal" height="140" border-radius="0.5rem" center-stripe-ratio="0.25"></latvian-flag>
```

## Usage Notes

- The default layout is **vertical** (maroon bands run left/right). Set `orientation="horizontal"` to display the traditional horizontal stripes.
- `width` controls the width directly. Numbers are treated as pixels; strings can include any CSS units (e.g. `12rem`, `60%`). When both `width` and `height` are omitted, the component defaults to an overall width of `calc(2px + 1px + 2px)` so the visible stripes measure red 2px, white 1px, red 2px like the original Tailwind setup.
- `height` controls the cross-axis dimension. Leaving it unset preserves the compact 2.5rem (Tailwind `h-10`) footprint; set it (or `width`) alongside `aspect-ratio` for larger badges.
- `outer-color` and `inner-color` change the maroon and center stripe fills.
- `center-stripe-ratio` clamps between `0.05` and `0.6` to keep the flag proportional.
- `border-radius`, `border-width`, and `border-color` apply directly to the flag container for badge or patch styles.
- You can still use regular CSS on the host element (e.g. `latvian-flag { display: block; }`) for layout concerns; the stripes remain encapsulated in the shadow root.
- To mirror the old Tailwind defaults, the fallback size matches `h-10` (height) with the width derived from the aspect ratio (instead of the previous `w-0` class that required manual overrides).

### React + Stencil loader example

```tsx
import { useEffect } from 'react';
import { defineCustomElements } from 'valksor/loader';

export function Hero() {
    useEffect(() => {
        defineCustomElements();
    }, []);

    return <latvian-flag width="180" border-radius="12px" border-width="4" border-color="#4a0010" center-stripe-ratio="0.22" />;
}
```

## Styling tips

- Width and height props accept CSS units, so `width="100%"` makes the flag fill responsive containers.
- Because the component renders inside a shadow root, prefer the exposed properties or CSS custom properties over global class names for color changes.
- Animate the host element (e.g. `latvian-flag { transition: transform 200ms; }`) instead of targeting internal stripes.

<!-- Auto Generated Below -->

## Properties

| Property            | Attribute             | Description                                                                  | Type                         | Default         |
| ------------------- | --------------------- | ---------------------------------------------------------------------------- | ---------------------------- | --------------- |
| `aspectRatio`       | `aspect-ratio`        | Aspect ratio (width divided by height) used when only the width is provided. | `number \| string`           | `2`             |
| `borderColor`       | `border-color`        | Border color used with `border-width`.                                       | `string`                     | `'transparent'` |
| `borderRadius`      | `border-radius`       | Border radius applied to the flag container.                                 | `number \| string`           | `'0'`           |
| `borderWidth`       | `border-width`        | Border width applied around the flag.                                        | `number \| string`           | `0`             |
| `centerStripeRatio` | `center-stripe-ratio` | Percentage (0-1) of the flag's height dedicated to the center stripe.        | `number \| string`           | `0.2`           |
| `height`            | `height`              | Optional explicit height. Falls back to a compact default when omitted.      | `number \| string`           | `undefined`     |
| `innerColor`        | `inner-color`         | Background color for the center stripe.                                      | `string`                     | `'#ffffff'`     |
| `orientation`       | `orientation`         | Controls whether the maroon bands run vertically (default) or horizontally.  | `"horizontal" \| "vertical"` | `'vertical'`    |
| `outerColor`        | `outer-color`         | Background color for the maroon stripes.                                     | `string`                     | `'#960018'`     |
| `width`             | `width`               | Explicit width for the rendered flag. Numbers are treated as pixels.         | `number \| string`           | `undefined`     |

---

_Built with [StencilJS](https://stenciljs.com/)_

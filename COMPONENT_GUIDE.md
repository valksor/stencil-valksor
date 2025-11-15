# Component Development Guide

This guide explains how to create new components and structure their readme files so that the automated generator (`gen.mjs`) can properly parse and display examples in the interactive component preview.

## Understanding the Generator

The `gen.mjs` script automatically generates `src/index.html` with interactive previews of all components. It works by:

1. **Discovering Components**: Scans `src/components/` for Stencil components with the `@Component` decorator
2. **Parsing Examples**: Reads each component's `readme.md` file to extract usage examples
3. **Generating HTML**: Creates interactive cards with live previews and copy-to-clipboard functionality

### How Example Parsing Works

The generator uses the `extractExamplesFromReadme()` function with this specific pattern:

- Looks for an `## Examples` section in your component readme
- Extracts content until the next `## ` section or `<!-- Auto Generated Below -->`
- Uses regex pattern: `/###? ([^\n]+)\s*\n[\s\S]*?```html\s*\n([\s\S]*?)```/g`
- Each example requires: a heading (`### Title`) + HTML code block (``html...`)

## Required Readme Template

Use this template for all new components. **Copy and paste it as-is, then customize the content.**

````markdown
# [component-name]

[Brief, one-sentence description of what this component does and its purpose.]

## Examples

### Default

```html
<[component-tag]></[component-tag]>
```
````

### Basic Usage

```html
<[component-tag] class="basic-styling"></[component-tag]>
```

### Advanced Example

```html
<[component-tag] class="advanced-styling" other-prop="value">
  <!-- Nested content if applicable -->
</[component-tag]>
```

## Usage Notes

- [Important details about props, styling, or behavior]
- [How to customize the component]
- [Any gotchas or special considerations]

<!-- Auto Generated Below -->

````

### Real Example: latvian-flag

Here's the current latvian-flag readme as a working reference:

```markdown
# latvian-flag

Latvia's crimson-white-crimson flag rendered as a zero-dependency web component. The element exposes layout and color knobs through properties so you can configure it without depending on global CSS utilities.

## Examples

### Default

```html
<latvian-flag></latvian-flag>
```

### Fixed Width With Rounded Corners

```html
<latvian-flag width="200" border-radius="0.75rem"></latvian-flag>
```

### Custom Colors & Stripe Ratio

```html
<latvian-flag outer-color="#7b0015" inner-color="#f7f2e8" center-stripe-ratio="0.26"></latvian-flag>
```

### Explicit Height + Border

```html
<latvian-flag height="56" border-width="6" border-color="#52000c"></latvian-flag>
```

### Horizontal Orientation

```html
<latvian-flag orientation="horizontal" width="160" border-radius="0.5rem"></latvian-flag>
```

## Usage Notes

- `orientation` is `vertical` by default; set `orientation="horizontal"` for the classic three-band look.
- `width` or `height` control the size. When neither is provided the component renders at a compact 2.5rem (Tailwind `h-10`) tall footprint.
- Color, border, and ratio props keep styling within the shadow root.
- Width now defaults to the legacy `2px / 1px / 2px` composition (`calc(2px + 1px + 2px)`) whenever both dimensions are omitted, mirroring the old `w-0` + border technique without relying on Tailwind.

<!-- Auto Generated Below -->

```

## Good vs Bad Examples

### ✅ Good: Properly Formatted

```markdown
## Examples

### Default

```html
<my-button></my-button>
````

### With Variants

```html
<my-button class="btn-primary"></my-button>
```

`````

**Why it works:**
- Has `## Examples` section
- Each example has `### Title` heading
- HTML is in proper ````html` code blocks
- Clean, consistent structure

### ❌ Bad: Missing HTML Code Block

```markdown
## Examples

### Default

<my-button></my-button>

### With Variants

`````

<my-button class="btn-primary"></my-button>

```

```

**Why it fails:**

- First example not in HTML code block
- Second example has generic code block (missing `html` label)
- Generator won't extract these examples

### ❌ Bad: Wrong Section Structure

````markdown
### Usage Examples

#### Default

```html
<my-button></my-button>
```
````

`````

**Why it fails:**
- Section is `### Usage Examples` (must be `## Examples`)
- Example heading is `####` (must be `###`)

## Best Practices

### 1. Example Progression
Follow this order for consistency:
1. **Default**: Basic component with no props
2. **Basic Usage**: Simple styling or common use case
3. **Variations**: Size, color, or style variations
4. **Advanced**: Complex combinations or edge cases

### 2. Clear, Descriptive Titles
- ✅ Good: "Default", "Large Size", "With Border", "Custom Colors"
- ❌ Bad: "Example 1", "Test", "Something", "asdf"

### 3. Real-World Usage
- Use Tailwind utility classes that developers would actually use
- Show common patterns (buttons, forms, layouts)
- Include accessibility best practices when applicable

### 4. Keep Examples Focused
- Each example should demonstrate one concept
- Avoid combining multiple new ideas in one example
- Make it easy to copy-paste and understand

### 5. HTML Formatting
- Use self-closing tags where appropriate: `<my-component />`
- Indent consistently (2 spaces recommended)
- Include comments for complex structures

## Integration & Testing

### How Examples Appear in Generated HTML

When you run `bun run gen.mjs`, your examples will:
- Display in interactive cards on the main preview page
- Show live component previews with your styling
- Provide expandable code blocks with syntax highlighting
- Include copy-to-clipboard functionality for easy adoption

### Testing Your Examples

1. **Create Component**: Use `bun run generate` to scaffold your component
2. **Add Examples**: Follow the template and add your examples
3. **Test Generation**: Run `bun run gen.mjs` to verify examples appear
4. **Check Output**: Open `src/index.html` to see interactive preview
5. **Verify Examples**: Ensure code blocks expand and copy correctly

### Troubleshooting

#### "Examples not appearing in preview"
- Check that you have `## Examples` section (exact capitalization)
- Verify HTML code blocks use ````html` (not generic ````)
- Ensure each example has a `### Title` heading
- Run `bun run gen.mjs` and check console for parsing errors

#### "Example preview broken"
- Test your HTML in the browser to verify it's valid
- Check for missing required props or attributes
- Ensure component imports and CSS are working
- Verify Tailwind classes are properly applied

#### "Code won't copy correctly"
- Ensure proper HTML escaping in your readme
- Check that special characters are properly encoded
- Test the generated HTML page's copy functionality

## Complete Workflow

1. **Generate Component**: `bun run generate` and follow prompts
2. **Implement Component**: Add your Stencil component logic in `.tsx` file
3. **Write Examples**: Follow this guide and add examples to `readme.md`
4. **Test Locally**: `bun run start` to test in development
5. **Generate Preview**: `bun run gen.mjs` to update component showcase
6. **Verify Output**: Check `src/index.html` for proper example rendering

Following this guide ensures your components integrate seamlessly with the automated preview system and provide excellent developer experience for consumers of the Valksor component library.
`````

import { newSpecPage } from '@stencil/core/testing';
import { LatvianFlag } from './latvian-flag';

describe('latvian-flag', () => {
    it('renders three stripes vertically with the expected default ratios', async () => {
        const page = await newSpecPage({
            components: [LatvianFlag],
            html: `<latvian-flag></latvian-flag>`,
        });

        const container = page.root?.shadowRoot?.querySelector('.latvian-flag-container') as HTMLElement | null;
        expect(container).not.toBeNull();
        expect(container?.classList.contains('vertical')).toBe(true);

        const stripes = Array.from(container!.querySelectorAll('.stripe')) as HTMLElement[];
        expect(stripes).toHaveLength(3);

        expect(stripes[0].classList.contains('outer')).toBe(true);
        expect(stripes[1].classList.contains('inner')).toBe(true);
        expect(stripes[2].classList.contains('outer')).toBe(true);

        expect(stripes[0].getAttribute('style')).toContain('flex-basis: 40%');
        expect(stripes[1].getAttribute('style')).toContain('flex-basis: 20%');
        expect(stripes[2].getAttribute('style')).toContain('flex-basis: 40%');

        const wrapper = page.root?.shadowRoot?.querySelector('.latvian-flag-root') as HTMLElement | null;
        const wrapperStyle = wrapper?.getAttribute('style') ?? '';
        expect(wrapperStyle).toContain('height: 2.5rem');
        expect(wrapperStyle).toContain('width: calc(4px + 2px + 4px)');
    });

    it('applies sizing, color, and border props as inline styles', async () => {
        const page = await newSpecPage({
            components: [LatvianFlag],
            html: `<latvian-flag width="180" height="120" outer-color="#750012" inner-color="#fef6f0" border-width="6" border-color="#52000c" border-radius="12px" center-stripe-ratio="0.3"></latvian-flag>`,
        });

        const wrapper = page.root?.shadowRoot?.querySelector('.latvian-flag-root') as HTMLElement | null;
        expect(wrapper).not.toBeNull();
        const wrapperStyle = wrapper!.getAttribute('style') ?? '';
        expect(wrapperStyle).toContain('width: 180px');
        expect(wrapperStyle).toContain('height: 120px');
        expect(wrapperStyle).toContain('--latvian-flag-outer-color: #750012');
        expect(wrapperStyle).toContain('--latvian-flag-inner-color: #fef6f0');

        const container = page.root!.shadowRoot!.querySelector('.latvian-flag-container') as HTMLElement;
        const containerStyle = container.getAttribute('style') ?? '';
        expect(containerStyle).toContain('border-width: 6px');
        expect(containerStyle).toContain('border-color: #52000c');
        expect(containerStyle).toContain('border-radius: 12px');

        const middleStripe = page.root!.shadowRoot!.querySelector('.stripe.inner') as HTMLElement;
        expect(middleStripe.getAttribute('style')).toContain('flex-basis: 30%');
    });

    it('supports horizontal orientation', async () => {
        const page = await newSpecPage({
            components: [LatvianFlag],
            html: `<latvian-flag orientation="horizontal" width="120"></latvian-flag>`,
        });

        const container = page.root!.shadowRoot!.querySelector('.latvian-flag-container') as HTMLElement;
        expect(container.classList.contains('horizontal')).toBe(true);

        const wrapper = page.root!.shadowRoot!.querySelector('.latvian-flag-root') as HTMLElement;
        const wrapperStyle = wrapper.getAttribute('style') ?? '';
        expect(wrapperStyle).toContain('width: 120px');
        expect(wrapperStyle).toContain('aspect-ratio: 2');
    });

    it('derives width via aspect ratio when only height is provided', async () => {
        const page = await newSpecPage({
            components: [LatvianFlag],
            html: `<latvian-flag height="80"></latvian-flag>`,
        });

        const wrapper = page.root!.shadowRoot!.querySelector('.latvian-flag-root') as HTMLElement;
        const wrapperStyle = wrapper.getAttribute('style') ?? '';
        expect(wrapperStyle).toContain('height: 80px');
        expect(wrapperStyle).toContain('aspect-ratio: 2');
        expect(wrapperStyle.includes('width:')).toBe(false);
    });

    it('normalizes helper inputs for edge cases', () => {
        const flag = new LatvianFlag();
        const normalizeDimension = (flag as any).normalizeDimension.bind(flag);
        const normalizeAspectRatio = (flag as any).normalizeAspectRatio.bind(flag);
        const normalizeRatio = (flag as any).normalizeRatio.bind(flag);

        expect(normalizeDimension(undefined, 'fallback')).toBe('fallback');
        expect(normalizeDimension('   ', 'fallback')).toBe('fallback');
        expect(normalizeDimension(12, 'fallback')).toBe('12px');
        expect(normalizeDimension('10%', 'fallback')).toBe('10%');

        expect(normalizeAspectRatio(undefined, 2)).toBe('2');
        expect(normalizeAspectRatio('foo', 2)).toBe('2');
        expect(normalizeAspectRatio('3', 2)).toBe('3');

        expect(normalizeRatio(undefined, 0.2)).toBe(0.2);
        expect(normalizeRatio('oops', 0.2)).toBe(0.2);
        expect(normalizeRatio(0.8, 0.2)).toBe(0.6);
        expect(normalizeRatio(0.01, 0.2)).toBe(0.05);
    });

    it('falls back to default color variables when custom colors are empty', async () => {
        const page = await newSpecPage({
            components: [LatvianFlag],
            html: `<latvian-flag outer-color="" inner-color=""></latvian-flag>`,
        });

        const wrapper = page.root!.shadowRoot!.querySelector('.latvian-flag-root') as HTMLElement;
        const wrapperStyle = wrapper.getAttribute('style') ?? '';
        expect(wrapperStyle).toContain('--latvian-flag-outer-color: #960018');
        expect(wrapperStyle).toContain('--latvian-flag-inner-color: #ffffff');
    });

    it('reuses the outer color when border color is empty', async () => {
        const page = await newSpecPage({
            components: [LatvianFlag],
            html: `<latvian-flag border-color="" outer-color="#7b0015"></latvian-flag>`,
        });

        const container = page.root!.shadowRoot!.querySelector('.latvian-flag-container') as HTMLElement;
        const containerStyle = container.getAttribute('style') ?? '';
        expect(containerStyle).toContain('border-color: #7b0015');
    });
});

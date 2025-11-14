import { newSpecPage } from '@stencil/core/testing';
import { LatvianFlag } from './latvian-flag';

describe('latvian-flag', () => {
    it('renders the expected stripe structure with base classes', async () => {
        const page = await newSpecPage({
            components: [LatvianFlag],
            html: `<latvian-flag></latvian-flag>`,
        });

        const container = page.root?.querySelector('.latvian-flag-container.flex') as HTMLElement | null;
        expect(container).not.toBeNull();

        const stripes = Array.from(container!.children) as HTMLElement[];
        expect(stripes).toHaveLength(5);

        const crimsonStripeTokens = ['border-latvian', 'h-10', 'w-0', 'border'];
        const whiteStripeTokens = ['h-10', 'w-0', 'border', 'border-white'];

        stripes.forEach((stripe, index) => {
            const tokens = index === 2 ? whiteStripeTokens : crimsonStripeTokens;
            tokens.forEach(token => {
                expect(stripe.classList.contains(token)).toBe(true);
            });
        });
    });

    it('applies custom class props to crimson and white stripes', async () => {
        const crimsonClasses = 'w-24 border-[6px] rounded';
        const whiteClasses = 'w-12 border-[4px] border-white/80';

        const page = await newSpecPage({
            components: [LatvianFlag],
            html: `<latvian-flag class="${crimsonClasses}" class2="${whiteClasses}"></latvian-flag>`,
        });

        const stripes = Array.from(page.root!.querySelectorAll('.latvian-flag-container.flex > div')) as HTMLElement[];

        const crimsonTokens = crimsonClasses.split(' ').filter(Boolean);
        const whiteTokens = whiteClasses.split(' ').filter(Boolean);

        stripes.forEach((stripe, index) => {
            const expectedTokens = index === 2 ? whiteTokens : crimsonTokens;
            expectedTokens.forEach(token => {
                expect(stripe.className).toContain(token);
            });
        });
    });
});

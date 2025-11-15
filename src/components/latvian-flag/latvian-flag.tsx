import { Component, h, Prop } from '@stencil/core';

@Component({
    tag: 'latvian-flag',
    styleUrl: 'latvian-flag.css',
    shadow: true,
})
export class LatvianFlag {
    private static readonly DEFAULT_HEIGHT = '2.5rem';
    private static readonly DEFAULT_WIDTH = 'calc(4px + 2px + 4px)';

    /**
     * Explicit width for the rendered flag. Numbers are treated as pixels.
     */
    @Prop() width?: string | number;

    /**
     * Optional explicit height. Falls back to a compact default when omitted.
     */
    @Prop() height?: string | number;

    /**
     * Aspect ratio (width divided by height) used when only the width is provided.
     */
    @Prop({ attribute: 'aspect-ratio' }) aspectRatio: string | number = 2;

    /**
     * Background color for the maroon stripes.
     */
    @Prop({ attribute: 'outer-color' }) outerColor: string = '#960018';

    /**
     * Background color for the center stripe.
     */
    @Prop({ attribute: 'inner-color' }) innerColor: string = '#ffffff';

    /**
     * Percentage (0-1) of the flag's height dedicated to the center stripe.
     */
    @Prop({ attribute: 'center-stripe-ratio' }) centerStripeRatio: string | number = 0.2;

    /**
     * Border radius applied to the flag container.
     */
    @Prop({ attribute: 'border-radius' }) borderRadius: string | number = '0';

    /**
     * Border width applied around the flag.
     */
    @Prop({ attribute: 'border-width' }) borderWidth: string | number = 0;

    /**
     * Border color used with `border-width`.
     */
    @Prop({ attribute: 'border-color' }) borderColor: string = 'transparent';

    /**
     * Controls whether the maroon bands run vertically (default) or horizontally.
     */
    @Prop() orientation: 'vertical' | 'horizontal' = 'vertical';

    private normalizeDimension(value: string | number | undefined, fallback: string): string {
        if (value === undefined || value === null || value === '') {
            return fallback;
        }

        if (typeof value === 'number') {
            return `${value}px`;
        }

        const trimmed = value.trim();
        if (trimmed === '') {
            return fallback;
        }

        return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed;
    }

    private normalizeAspectRatio(value: string | number | undefined, fallback: number): string {
        if (value === undefined || value === null || value === '') {
            return `${fallback}`;
        }

        if (typeof value === 'number' && !Number.isNaN(value) && value > 0) {
            return `${value}`;
        }

        const parsed = parseFloat(String(value));
        if (!Number.isNaN(parsed) && parsed > 0) {
            return `${parsed}`;
        }

        return `${fallback}`;
    }

    private hasDimension(value: string | number | undefined): boolean {
        return value !== undefined && value !== null && String(value).trim() !== '';
    }

    private normalizeRatio(value: string | number | undefined, fallback: number, min = 0.05, max = 0.6): number {
        if (value === undefined || value === null || value === '') {
            return fallback;
        }

        const numeric = typeof value === 'number' ? value : parseFloat(value);
        if (Number.isNaN(numeric)) {
            return fallback;
        }

        return Math.min(Math.max(numeric, min), max);
    }

    private getWrapperStyles(): Record<string, string> {
        const widthProvided = this.hasDimension(this.width);
        const heightProvided = this.hasDimension(this.height);
        const wrapperStyles: Record<string, string> = {};
        const aspect = this.normalizeAspectRatio(this.aspectRatio, 2);

        if (widthProvided) {
            wrapperStyles.width = this.normalizeDimension(this.width, 'auto');
        } else if (!heightProvided) {
            wrapperStyles.width = LatvianFlag.DEFAULT_WIDTH;
        }

        if (heightProvided) {
            wrapperStyles.height = this.normalizeDimension(this.height, 'auto');
        } else if (!widthProvided) {
            wrapperStyles.height = this.normalizeDimension(LatvianFlag.DEFAULT_HEIGHT, LatvianFlag.DEFAULT_HEIGHT);
        }

        if ((widthProvided && !heightProvided) || (!widthProvided && heightProvided)) {
            wrapperStyles.aspectRatio = aspect;
        }

        return wrapperStyles;
    }

    private getContainerStyles(): Record<string, string> {
        return {
            borderRadius: this.normalizeDimension(this.borderRadius, '0.375rem'),
            borderWidth: this.normalizeDimension(this.borderWidth, '0px'),
            borderColor: this.borderColor || this.outerColor,
        };
    }

    private getColorVariables(): Record<string, string> {
        return {
            '--latvian-flag-outer-color': this.outerColor || '#960018',
            '--latvian-flag-inner-color': this.innerColor || '#ffffff',
        };
    }

    render() {
        const centerRatio = this.normalizeRatio(this.centerStripeRatio, 0.2);
        const outerRatio = (1 - centerRatio) / 2;
        const containerClass = this.orientation === 'horizontal' ? 'latvian-flag-container horizontal' : 'latvian-flag-container vertical';

        return (
            <div class="latvian-flag-root" style={{ ...this.getWrapperStyles(), ...this.getColorVariables() }}>
                <div class={containerClass} style={this.getContainerStyles()}>
                    <div class="stripe outer" style={{ flexBasis: `${outerRatio * 100}%` }}></div>
                    <div class="stripe inner" style={{ flexBasis: `${centerRatio * 100}%` }}></div>
                    <div class="stripe outer" style={{ flexBasis: `${outerRatio * 100}%` }}></div>
                </div>
            </div>
        );
    }
}

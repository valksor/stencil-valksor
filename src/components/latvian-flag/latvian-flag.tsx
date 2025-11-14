import { Component, h, Prop } from '@stencil/core';
import { mergeComponentClasses } from '../../utils/class-utils';

@Component({
    tag: 'latvian-flag',
})
export class LatvianFlag {
    @Prop() class: string = '';
    @Prop({ attribute: 'class2' }) class2: string = '';

    render() {
        return (
            <div class="latvian-flag-container flex">
                <div class={mergeComponentClasses('border-latvian h-10 w-0 border', this.class)}></div>
                <div class={mergeComponentClasses('border-latvian h-10 w-0 border', this.class)}></div>
                <div class={mergeComponentClasses('h-10 w-0 border border-white', this.class2)}></div>
                <div class={mergeComponentClasses('border-latvian h-10 w-0 border', this.class)}></div>
                <div class={mergeComponentClasses('border-latvian h-10 w-0 border', this.class)}></div>
            </div>
        );
    }
}

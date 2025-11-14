import { Component, h, Prop } from '@stencil/core';

@Component({
    tag: 'latvian-flag',
})
export class LatvianFlag {
    @Prop() class: string = '';
    @Prop({ attribute: 'class2' }) class2: string = '';

    render() {
        return (
            <div class="latvian-flag-container flex">
                <div class={`border-latvian h-10 w-0 border ${this.class}`}></div>
                <div class={`border-latvian h-10 w-0 border ${this.class}`}></div>
                <div class={`h-10 w-0 border border-white ${this.class2}`}></div>
                <div class={`border-latvian h-10 w-0 border ${this.class}`}></div>
                <div class={`border-latvian h-10 w-0 border ${this.class}`}></div>
            </div>
        );
    }
}

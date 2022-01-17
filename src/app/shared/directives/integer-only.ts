import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({ selector: '[appIntegerOnly]'})
export class IntegerOnlyDirective {

    constructor(
        private ngControl: NgControl
    ) { }

    @HostListener('input')
    input() {
        this.ngControl.control.setValue(this.ngControl.control.value.replace(/[^0-9]/g, ''));
    }
}

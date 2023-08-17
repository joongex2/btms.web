import { Directive, Input, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

export function getRequireMatchValidator(array: { title: string, value: any }[]) {
    return function requireMatchValidator(control: AbstractControl): ValidationErrors | null {
        if (typeof control.value === 'string' &&
            control.value !== '' &&
            array &&
            (array.length > 0 && array.findIndex(v => [v.title, v.value].includes(control.value)) === -1)
        ) {
            return { requireMatch: true };
        } else {
            return null;
        }
    }
}

// export function requireMatchValidator(control: AbstractControl): ValidationErrors | null {
//     return typeof control.value === 'string' && control.value !== '' ? { requireMatch: true } : null;
// }

@Directive({
    selector: 'input[requireMatch]',
    providers: [{ provide: NG_VALIDATORS, useExisting: RequireMatchDirective, multi: true }]
})
export class RequireMatchDirective implements Validator {
    @Input() requireMatch: { title: string, value: string }[];
    private requireMatchValidator: (control: AbstractControl) => ValidationErrors | null;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.requireMatch) {
            this.requireMatchValidator = getRequireMatchValidator(this.requireMatch as any[]);
        }
    }

    validate(control: AbstractControl): ValidationErrors | null {
        return !this.requireMatch || this.requireMatch ? this.requireMatchValidator(control) : null;
    }
}
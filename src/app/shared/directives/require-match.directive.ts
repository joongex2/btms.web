import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

export function requireMatchValidator(control: AbstractControl): ValidationErrors | null {
    return typeof control.value === 'string' && control.value !== '' ? { requireMatch: true } : null;
}

@Directive({
    selector: '[requireMatch]',
    providers: [{ provide: NG_VALIDATORS, useExisting: RequireMatchDirective, multi: true }]
})
export class RequireMatchDirective implements Validator {
    validate(control: AbstractControl): ValidationErrors | null {
        return requireMatchValidator(control);
    }
}
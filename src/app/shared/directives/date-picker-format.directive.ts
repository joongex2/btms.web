import { Directive, Inject, Input, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateFormat } from './custom-date-format';

@Directive({
    selector: '[datePickerFormat]',
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS,
            useClass: CustomDateFormat
        }
    ]
})
export class DatePickerFormatDirective {
    @Input('datePickerFormat')
    set datePickerFormat(format: string) {
        this.matDateFormat.updateDateFormat(format);

        // Need this for the first time to tell component change new format
        const value = this.ngControl.value;
        this.ngControl.valueAccessor?.writeValue(value);
    }

    constructor(
        @Inject(MAT_DATE_FORMATS) public matDateFormat: CustomDateFormat,
        @Optional() private ngControl: NgControl
    ) {
    }
}
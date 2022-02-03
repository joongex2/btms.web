import { NgModule } from '@angular/core';
import { DatePickerFormatDirective } from './date-picker-format.directive';

@NgModule({
    declarations: [
        DatePickerFormatDirective
    ],
    exports: [
        DatePickerFormatDirective
    ]
})
export class DatePickerFormatDirectiveModule {
}
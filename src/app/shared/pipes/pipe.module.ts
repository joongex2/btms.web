import { NgModule } from '@angular/core';
import { ThaiMonthPipe } from './thai-month-pipe';

@NgModule({
    declarations: [
        ThaiMonthPipe
    ],
    exports: [
        ThaiMonthPipe
    ]
})
export class PipeModule {
}
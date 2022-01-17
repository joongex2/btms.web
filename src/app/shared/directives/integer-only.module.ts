import { NgModule } from '@angular/core';
import { IntegerOnlyDirective } from './integer-only';

@NgModule({
    declarations: [
        IntegerOnlyDirective
    ],
    exports: [
        IntegerOnlyDirective
    ]
})
export class IntegerOnlyModule {
}
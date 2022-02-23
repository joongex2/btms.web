import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsActivePipe } from './pipes/is-active.pipe';
import { PipeModule } from './pipes/pipe.module';

@NgModule({
    declarations: [
        IsActivePipe,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PipeModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PipeModule,
        IsActivePipe
    ]
})
export class SharedModule {
}

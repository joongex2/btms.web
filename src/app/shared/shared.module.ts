import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IntegerOnlyModule } from './directives/integer-only.module';
import { IsActivePipe } from './pipes/is-active.pipe';
import { PipeModule } from './pipes/pipe.module';
import { ConfirmationService } from './services/confirmation.service';
import { SnackBarService } from './services/snack-bar.service';

@NgModule({
    declarations: [
        IsActivePipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        PipeModule,
        IntegerOnlyModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PipeModule,
        IsActivePipe,
        IntegerOnlyModule
    ],
    providers: [
        ConfirmationService,
        SnackBarService
    ]
})
export class SharedModule {
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { LastCommentModalComponent } from './components/last-comment-modal/last-comment-modal.component';
import { IntegerOnlyModule } from './directives/integer-only.module';
import { RequireMatchDirective } from './directives/require-match.directive';
import { IsActivePipe } from './pipes/is-active.pipe';
import { PipeModule } from './pipes/pipe.module';
import { ConfirmationService } from './services/confirmation.service';
import { SnackBarService } from './services/snack-bar.service';

@NgModule({
    declarations: [
        LastCommentModalComponent,
        IsActivePipe,
        RequireMatchDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        PipeModule,
        IntegerOnlyModule,
        MatPaginatorModule,
        MatIconModule,
        MatTableModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PipeModule,
        IsActivePipe,
        IntegerOnlyModule,
        RequireMatchDirective,
        LastCommentModalComponent
    ],
    providers: [
        ConfirmationService,
        SnackBarService
    ]
})
export class SharedModule {
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { FuseAlertModule } from '@fuse/components/alert';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AutocompleteFormComponent } from './components/autocomplete-form/autocomplete-form.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { ErrorIconComponent } from './components/error-icon/error-icon.component';
import { FormErrorComponent } from './components/form-error/form-error.component';
import { FormMultiSelectDropdownComponent } from './components/form-multi-select-dropdown/form-multi-select-dropdown.component';
import { LastCommentModalComponent } from './components/last-comment-modal/last-comment-modal.component';
import { SuccessIconComponent } from './components/success-icon/success-icon.component';
import { IntegerOnlyModule } from './directives/integer-only.module';
import { RequireMatchDirective } from './directives/require-match.directive';
import { IsActivePipe } from './pipes/is-active.pipe';
import { PipeModule } from './pipes/pipe.module';
import { TitleValuePipe } from './pipes/title-value.pipe';
import { ConfirmationService } from './services/confirmation.service';
import { SnackBarService } from './services/snack-bar.service';

@NgModule({
    declarations: [
        LastCommentModalComponent,
        AutocompleteComponent,
        AutocompleteFormComponent,
        IsActivePipe,
        TitleValuePipe,
        RequireMatchDirective,
        FormErrorComponent,
        FormMultiSelectDropdownComponent,
        SuccessIconComponent,
        ErrorIconComponent
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
        MatTableModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatInputModule,
        FuseAlertModule,
        MatSelectModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PipeModule,
        IsActivePipe,
        TitleValuePipe,
        IntegerOnlyModule,
        RequireMatchDirective,
        LastCommentModalComponent,
        AutocompleteComponent,
        AutocompleteFormComponent,
        FormErrorComponent,
        FormMultiSelectDropdownComponent,
        SuccessIconComponent,
        ErrorIconComponent
    ],
    providers: [
        ConfirmationService,
        SnackBarService
    ]
})
export class SharedModule {
}

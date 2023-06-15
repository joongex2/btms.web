import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
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
import { FileUploadTableComponent } from './components/file-upload-table/file-upload-table.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FormErrorComponent } from './components/form-error/form-error.component';
import { FormMultiSelectDropdownComponent } from './components/form-multi-select-dropdown/form-multi-select-dropdown.component';
import { LastCommentLinkComponent } from './components/last-comment-link/last-comment-link.component';
import { LastCommentModalComponent } from './components/last-comment-modal/last-comment-modal.component';
import { SuccessIconComponent } from './components/success-icon/success-icon.component';
import { IntegerOnlyModule } from './directives/integer-only.module';
import { RequireMatchDirective } from './directives/require-match.directive';
import { BaseUrlPipe } from './pipes/base-url.pipe';
import { IsActivePipe } from './pipes/is-active.pipe';
import { MeasureTypePipe } from './pipes/measure-type.pipe';
import { PipeModule } from './pipes/pipe.module';
import { TargetActualResultPipe } from './pipes/target-actual-result-pipe';
import { TargetValueStatusPipe } from './pipes/target-value-status';
import { ThaiMonthPipe } from './pipes/thai-month-pipe';
import { TitleValuePipe } from './pipes/title-value.pipe';
import { ConfirmationService } from './services/confirmation.service';
import { SnackBarService } from './services/snack-bar.service';

@NgModule({
    declarations: [
        LastCommentModalComponent,
        LastCommentLinkComponent,
        AutocompleteComponent,
        AutocompleteFormComponent,
        IsActivePipe,
        TitleValuePipe,
        TargetValueStatusPipe,
        BaseUrlPipe,
        ThaiMonthPipe,
        TargetActualResultPipe,
        MeasureTypePipe,
        RequireMatchDirective,
        FormErrorComponent,
        FormMultiSelectDropdownComponent,
        SuccessIconComponent,
        ErrorIconComponent,
        FileUploadTableComponent,
        FileUploadComponent
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
        MatButtonModule,
        MatDialogModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PipeModule,
        IsActivePipe,
        TitleValuePipe,
        TargetValueStatusPipe,
        BaseUrlPipe,
        ThaiMonthPipe,
        TargetActualResultPipe,
        MeasureTypePipe,
        IntegerOnlyModule,
        RequireMatchDirective,
        LastCommentModalComponent,
        LastCommentLinkComponent,
        AutocompleteComponent,
        AutocompleteFormComponent,
        FormErrorComponent,
        FormMultiSelectDropdownComponent,
        SuccessIconComponent,
        ErrorIconComponent,
        FileUploadTableComponent,
        FileUploadComponent
    ],
    providers: [
        ConfirmationService,
        SnackBarService
    ]
})
export class SharedModule {
}

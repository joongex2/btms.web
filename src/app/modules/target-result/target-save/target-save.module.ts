import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { IntegerOnlyModule } from 'app/shared/directives/integer-only.module';
import { SharedModule } from 'app/shared/shared.module';
import * as moment from 'moment';
import { CauseModalComponent } from './modals/cause-modal/cause-modal.component';
import { FixModalComponent } from './modals/fix-modal/fix-modal.component';
import { ProtectModalComponent } from './modals/protect-modal/protect-modal.component';
import { CauseTableComponent } from './tables/cause-table/cause-table.component';
import { FileUploadTableComponent } from './tables/file-upload-table/file-upload-table.component';
import { FixTableComponent } from './tables/fix-table/fix-table.component';
import { ProtectTableComponent } from './tables/protect-table/protect-table.component';
import { TargetSaveComponent } from './target-save.component';



@NgModule({
  declarations: [
    CauseModalComponent,
    FixModalComponent,
    ProtectModalComponent,
    FixTableComponent,
    ProtectTableComponent,
    CauseTableComponent,
    FileUploadTableComponent,
    TargetSaveComponent
  ],
  imports: [
    RouterModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatTabsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatMomentDateModule,
    FuseAlertModule,
    SharedModule,
    IntegerOnlyModule
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: moment.ISO_8601
        },
        display: {
          dateInput: 'L',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMM YYYY'
        }
      }
    }
  ]
})
export class TargetSaveModule { }

import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { CauseModalComponent } from '../modals/cause-modal/cause-modal.component';
import { FixModalComponent } from '../modals/fix-modal/fix-modal.component';
import { LastCommentModalComponent } from '../../../shared/components/last-comment-modal/last-comment-modal.component';
import { ProtectModalComponent } from '../modals/protect-modal/protect-modal.component';
import { TargetEntryDetailModalComponent } from '../modals/target-entry-detail-modal/target-entry-detail-modal.component';
import { TargetEntryDetailComponent } from './target-entry-detail.component';
import { targetEntryDetailRoutes } from './target-entry-detail.routing';
import { MethodEntryTableComponent } from '../tables/method-entry-table/method-entry-table.component';
import { MainMethodEntryTableComponent } from '../tables/main-method-entry-table/main-method-entry-table.component';
import { SubTargetEntryTableComponent } from '../tables/sub-target-entry-table/sub-target-entry-table.component';
import { TargetEntryTableComponent } from '../tables/target-entry-table/target-entry-table.component';
import { PlanEntryTableComponent } from '../tables/plan-entry-table/plan-entry-table.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { FixTableComponent } from '../tables/fix-table/fix-table.component';
import { ProtectTableComponent } from '../tables/protect-table/protect-table.component';
import { CauseTableComponent } from '../tables/cause-table/cause-table.component';
import { FileUploadTableComponent } from '../tables/file-upload-table/file-upload-table.component';



@NgModule({
  declarations: [
    TargetEntryDetailComponent,
    TargetEntryDetailModalComponent,
    CauseModalComponent,
    FixModalComponent,
    ProtectModalComponent,
    MethodEntryTableComponent,
    MainMethodEntryTableComponent,
    SubTargetEntryTableComponent,
    TargetEntryTableComponent,
    PlanEntryTableComponent,
    FixTableComponent,
    ProtectTableComponent,
    CauseTableComponent,
    FileUploadTableComponent
  ],
  imports: [
    RouterModule.forChild(targetEntryDetailRoutes),
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
export class TargetEntryDetailModule { }

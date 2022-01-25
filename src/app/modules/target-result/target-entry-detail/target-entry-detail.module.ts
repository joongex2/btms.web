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
import { CauseModalComponent } from '../modal/cause-modal/cause-modal.component';
import { FixModalComponent } from '../modal/fix-modal/fix-modal.component';
import { LastCommentModalComponent } from '../modal/last-comment-modal/last-comment-modal.component';
import { ProtectModalComponent } from '../modal/protect-modal/protect-modal.component';
import { TargetEntryDetailModalComponent } from '../modal/target-entry-detail-modal/target-entry-detail-modal.component';
import { TargetEntryDetailComponent } from './target-entry-detail.component';
import { targetEntryDetailRoutes } from './target-entry-detail.routing';



@NgModule({
  declarations: [
    TargetEntryDetailComponent,
    LastCommentModalComponent,
    TargetEntryDetailModalComponent,
    CauseModalComponent,
    FixModalComponent,
    ProtectModalComponent
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
    FuseAlertModule,
    SharedModule,
    IntegerOnlyModule
  ]
})
export class TargetEntryDetailModule { }

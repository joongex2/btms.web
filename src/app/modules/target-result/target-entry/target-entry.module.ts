import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { TargetListModule } from 'app/modules/target-list/target-list.module';
import { SharedModule } from 'app/shared/shared.module';
import { TargetEntryDetailModule } from '../target-entry-detail/target-entry-detail.module';
import { TargetSaveModule } from '../target-save/target-save.module';
import { TargetEntryComponent } from './target-entry.component';
import { targetEntryRoutes } from './target-entry.routing';



@NgModule({
  declarations: [
    TargetEntryComponent
  ],
  imports: [
    RouterModule.forChild(targetEntryRoutes),
    TargetListModule,
    TargetEntryDetailModule,
    TargetSaveModule,
    SharedModule
  ]
})
export class TargetEntryModule { }

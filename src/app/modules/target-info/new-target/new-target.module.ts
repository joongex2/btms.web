import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { TargetManagementModule } from '../target-management/target-management.module';
import { NewTargetListComponent } from './new-target-list/new-target-list.component';
import { NewTargetComponent } from './new-target.component';
import { newTargetRoutes } from './new-target.routing';



@NgModule({
  declarations: [
    NewTargetComponent,
    NewTargetListComponent
  ],
  imports: [
    RouterModule.forChild(newTargetRoutes),
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
    MatPaginatorModule,
    SharedModule,
    TargetManagementModule
  ]
})
export class NewTargetModule { }

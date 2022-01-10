import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { TargetManagementComponent } from '../pages/target-management/target-management.component';
import { TargetManagementModule } from '../pages/target-management/target-management.module';
import { MethodTableComponent } from '../tables/method-table/method-table.component';
import { SubTargetTableComponent } from '../tables/sub-target-table/sub-target-table.component';
import { TargetTableComponent } from '../tables/target-table/target-table.component';
import { NewTargetComponent } from './new-target.component';
import { newTargetRoutes } from './new-target.routing';



@NgModule({
  declarations: [
    NewTargetComponent
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
    SharedModule,
    TargetManagementModule
  ]
})
export class NewTargetModule { }

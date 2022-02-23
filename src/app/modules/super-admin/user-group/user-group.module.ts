import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { UserGroupModalComponent } from './modals/user-group-modal/user-group-modal.component';
import { UserGroupComponent } from './user-group.component';
import { groupRoutes } from './user-group.routing';




@NgModule({
  declarations: [
    UserGroupComponent,
    UserGroupModalComponent
  ],
  imports: [
    RouterModule.forChild(groupRoutes),
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatExpansionModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    FuseAlertModule,
    SharedModule
  ]
})
export class UserGroupModule { }

import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { TreeChecklistComponent } from './tree-check-list/tree-checklist';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserComponent } from './user.component';
import { userRoutes } from './user.routing';



@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    UserDetailComponent,
    TreeChecklistComponent
  ],
  imports: [
    RouterModule.forChild(userRoutes),
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatExpansionModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTreeModule,
    MatCheckboxModule,
    FuseAlertModule,
    SharedModule
  ]
})
export class UserModule { }

import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { AdminUserDetailComponent } from './admin-user-detail/admin-user-detail.component';
import { AdminUserListComponent } from './admin-user-list/admin-user-list.component';
import { AdminUserComponent } from './admin-user.component';
import { userRoutes } from './admin-user.routing';




@NgModule({
  declarations: [
    AdminUserComponent,
    AdminUserListComponent,
    AdminUserDetailComponent
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
    MatAutocompleteModule,
    FuseAlertModule,
    SharedModule
  ]
})
export class AdminUserModule { }

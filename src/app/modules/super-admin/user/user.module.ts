import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { UserGroupModalComponent } from '../modals/user-group-modal/user-group-modal.component';
import { UserModalComponent } from '../modals/user-modal/user-modal.component';
import { UserComponent } from './user.component';
import { userRoutes } from './user.routing';



@NgModule({
  declarations: [
    UserComponent,
    UserModalComponent
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
    SharedModule
  ]
})
export class UserModule { }

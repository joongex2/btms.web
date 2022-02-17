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
import { GroupMenuModalComponent } from '../modals/group-menu-modal/group-menu-modal.component';
import { GroupMenuComponent } from './group-menu.component';
import { groupMenuRoutes } from './group-menu.routing';



@NgModule({
  declarations: [
    GroupMenuComponent,
    GroupMenuModalComponent
  ],
  imports: [
    RouterModule.forChild(groupMenuRoutes),
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
export class GroupMenuModule { }

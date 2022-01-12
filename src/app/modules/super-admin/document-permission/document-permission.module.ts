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
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { DocumentPermissionModalComponent } from '../modals/document-permission-modal/document-permission-modal.component';
import { DocumentPermissionComponent } from './document-permission.component';
import { documentPermissionRoutes } from './document-permission.routing';



@NgModule({
  declarations: [
    DocumentPermissionComponent,
    DocumentPermissionModalComponent
  ],
  imports: [
    RouterModule.forChild(documentPermissionRoutes),
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatExpansionModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCheckboxModule,
    SharedModule
  ]
})
export class DocumentPermissionModule { }

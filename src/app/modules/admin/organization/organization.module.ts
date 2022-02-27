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
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationModalComponent } from './modals/organization-modal/organization-modal.component';
import { OrganizationComponent } from './organization.component';
import { organizationRoutes } from './organization.routing';




@NgModule({
  declarations: [
    OrganizationComponent,
    OrganizationModalComponent
  ],
  imports: [
    RouterModule.forChild(organizationRoutes),
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatExpansionModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    FuseAlertModule,
    SharedModule
  ]
})
export class OrganizationModule { }

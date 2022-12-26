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
import { LookupComponent } from './lookup.component';
import { lookupRoutes } from './lookup.routing';
import { LookupModalComponent } from './modals/lookup-modal/lookup-modal.component';



@NgModule({
  declarations: [
    LookupComponent,
    LookupModalComponent
  ],
  imports: [
    RouterModule.forChild(lookupRoutes),
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
export class LookupModule { }

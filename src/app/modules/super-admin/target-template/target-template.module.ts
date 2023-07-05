import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { TargetManagementModule } from 'app/modules/target-info/target-management/target-management.module';
import { SharedModule } from 'app/shared/shared.module';
import { SelectOrganizesModalComponent } from './modals/select-organizes-modal/select-organizes-modal.component';
import { TemplateDeployModalComponent } from './modals/template-deploy-modal/template-deploy-modal.component';
import { TargetDeployComponent } from './target-deploy/target-deploy.component';
import { TargetTemplateDetailComponent } from './target-template-detail/target-template-detail.component';
import { TargetTemplateListComponent } from './target-template-list/target-template-list.component';
import { TargetTemplateComponent } from './target-template.component';
import { targetTemplateRoutes } from './target-template.routing';



@NgModule({
  declarations: [
    TargetTemplateListComponent,
    TargetTemplateComponent,
    TargetTemplateDetailComponent,
    TargetDeployComponent, // use select organizes modal instead
    SelectOrganizesModalComponent,
    TemplateDeployModalComponent
  ],
  imports: [
    RouterModule.forChild(targetTemplateRoutes),
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
    MatExpansionModule,
    MatSortModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    TargetManagementModule,
    FuseAlertModule,
    SharedModule
  ]
})
export class TargetTemplateModule { }

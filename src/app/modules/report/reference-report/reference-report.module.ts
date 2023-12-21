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
import { TargetListModule } from 'app/modules/target-list/target-list.module';
import { SharedModule } from 'app/shared/shared.module';
import { ReferenceReportComponent } from './reference-report.component';
import { referenceReportRoutes } from './reference-report.routing';

@NgModule({
    declarations: [
        ReferenceReportComponent
    ],
    imports: [
        RouterModule.forChild(referenceReportRoutes),
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
        TargetListModule,
        SharedModule
    ]
})
export class ReferenceReportModule { }

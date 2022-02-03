import { NgModule } from "@angular/core";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule } from "@angular/router";
import { FuseAlertModule } from "@fuse/components/alert";
import { DatePickerFormatDirectiveModule } from "app/shared/directives/date-picker-format.module";
import { IntegerOnlyModule } from "app/shared/directives/integer-only.module";
import { SharedModule } from "app/shared/shared.module";
import { MethodModalComponent } from '../../modals/method-modal/method-modal.component';
import { PlanModalComponent } from "../../modals/plan-modal/plan-modal.component";
import { SubTargetModalComponent } from '../../modals/sub-target-modal/sub-target-modal.component';
import { TargetModalComponent } from '../../modals/target-modal/target-modal.component';
import { MainMethodTableComponent } from "../../tables/main-method-table/main-method-table.component";
import { MethodTableComponent } from "../../tables/method-table/method-table.component";
import { PlanTableComponent } from "../../tables/plan-table/plan-table.component";
import { SubTargetTableComponent } from "../../tables/sub-target-table/sub-target-table.component";
import { TargetTableComponent } from "../../tables/target-table/target-table.component";
import { TargetManagementComponent } from "./target-management.component";

@NgModule({
  declarations: [
    TargetTableComponent,
    SubTargetTableComponent,
    MainMethodTableComponent,
    MethodTableComponent,
    PlanTableComponent,
    TargetManagementComponent,
    TargetModalComponent,
    SubTargetModalComponent,
    MethodModalComponent,
    PlanModalComponent
  ],
  imports: [
    RouterModule,
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
    MatAutocompleteModule,
    MatDialogModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatMomentDateModule,
    IntegerOnlyModule,
    DatePickerFormatDirectiveModule,
    FuseAlertModule,
    SharedModule
  ],
  exports: [
    TargetManagementComponent
  ]
})
export class TargetManagementModule { }
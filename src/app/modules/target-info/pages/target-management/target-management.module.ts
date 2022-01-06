import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
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
import { SharedModule } from "app/shared/shared.module";
import { MethodTableComponent } from "../../tables/method-table/method-table.component";
import { SubTargetTableComponent } from "../../tables/sub-target-table/sub-target-table.component";
import { TargetTableComponent } from "../../tables/target-table/target-table.component";
import { TargetManagementComponent } from "./target-management.component";
import { AddTargetModalComponent } from '../../modals/add-target-modal/add-target-modal.component';
import { AddSubTargetModalComponent } from '../../modals/add-sub-target-modal/add-sub-target-modal.component';
import { AddMethodModalComponent } from '../../modals/add-method-modal/add-method-modal.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
    declarations: [
      TargetTableComponent,
      SubTargetTableComponent,
      MethodTableComponent,
      TargetManagementComponent,
      AddTargetModalComponent,
      AddSubTargetModalComponent,
      AddMethodModalComponent
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
      SharedModule
    ],
    exports: [
      TargetManagementComponent
    ]
  })
  export class TargetManagementModule { }
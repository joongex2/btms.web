import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { MasterService } from '../master/master.service';
import { Master } from '../master/master.types';
import { ModalMode } from '../modals/modal.types';
import { OrganizationModalComponent } from './modals/organization-modal/organization-modal.component';

import { OrganizationService } from './organization.service';
import { Organization } from './organization.types';

@Component({
  selector: 'organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // bind value
  dataSource: MatTableDataSource<Organization> = new MatTableDataSource([]);
  code: string;
  name: string;
  selectedBusinessCode: string;
  selectedSubBusinessCode: string;
  selectedPlantCode: string;
  selectedDivisionCode: string;
  selectedIsActive: boolean;

  // select option
  businessCodes: any[];
  subBusinessCodes: any[];
  plantCodes: any[];
  divisionCodes: any[];
  isActives: any = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];

  // table setting
  displayedColumns: string[] = [
    'index',
    'code',
    'name',
    'businessCode',
    'subBusinessCode',
    'plantCode',
    'divisionCode',
    'isActive',
    'editDeleteIcon'
  ];

  keyToColumnName: any = {
    'index': 'ลำดับที่',
    'code': 'Code',
    'name': 'Name',
    'businessCode': 'Business Unit Code',
    'subBusinessCode': 'Sub-Business Unit Code',
    'plantCode': 'Plant Code',
    'divisionCode': 'Division Code',
    'isActive': 'Status',
    'editDeleteIcon': 'จัดการ'
  };

  notSortColumn: string[] = [
    'index',
    'editDeleteIcon'
  ];

  constructor(
    private _masterService: MasterService,
    private _organizationService: OrganizationService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _matDialog: MatDialog
  ) {
    this.loadOrganizations();
  }

  ngOnInit(): void {
    this._masterService.getMasters().subscribe({
      next: (masters: Master[]) => {
        // TODO: not sure can load type from api
        this.businessCodes = masters.filter((master) => master.type == 'BNU').map((master) => ({ title: master.code, value: master.code }));
        this.subBusinessCodes = masters.filter((master) => master.type == 'SBU').map((master) => ({ title: master.code, value: master.code }));
        this.plantCodes = masters.filter((master) => master.type == 'PLT').map((master) => ({ title: master.code, value: master.code }));
        this.divisionCodes = masters.filter((master) => master.type == 'DIV').map((master) => ({ title: master.code, value: master.code }));
      },
      error: (e) => console.log(e)
    });
    // default
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Organization, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.code || data.code.toString().trim().toLowerCase().indexOf(searchString.code.toLowerCase()) !== -1)
        && (!searchString.name || data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1)
        && (searchString.businessCode == undefined || data.businessCode == searchString.businessCode)
        && (searchString.subBusinessCode == undefined || data.subBusinessCode == searchString.subBusinessCode)
        && (searchString.plantCode == undefined || data.plantCode == searchString.plantCode)
        && (searchString.divisionCode == undefined || data.divisionCode == searchString.divisionCode)
        && (searchString.isActive == undefined || data.isActive == searchString.isActive);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      code: this.code,
      name: this.name,
      businessCode: this.selectedBusinessCode,
      subBusinessCode: this.selectedSubBusinessCode,
      plantCode: this.selectedPlantCode,
      divisionCode: this.selectedDivisionCode,
      isActive: this.selectedIsActive
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.code = '';
    this.name = '';
    this.selectedBusinessCode = undefined;
    this.selectedSubBusinessCode = undefined;
    this.selectedPlantCode = undefined;
    this.selectedDivisionCode = undefined;
    this.selectedIsActive = undefined;
  }

  addOrganization(): void {
    const dialogRef = this._matDialog.open(OrganizationModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((isAdd: boolean) => {
        if (!isAdd) return; // cancel
        this.loadOrganizations();
      });
  }

  editOrganization(element: Organization) {
    const dialogRef = this._matDialog.open(OrganizationModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: element
      }
    });
    dialogRef.afterClosed()
      .subscribe((isEdit: boolean) => {
        if (!isEdit) return; // cancel
        this.loadOrganizations();
      });
  }

  deleteOrganization(element: Organization) {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this._organizationService.deleteOrganization(element.id).subscribe({
          next: (v) => {
            this._snackBarService.success();
            this.loadOrganizations()
          },
          error: (e) => {
            this._snackBarService.error();
            console.error(e)
          }
        });
      }
    });
  }

  loadOrganizations() {
    this._organizationService.getOrganizations().subscribe({
      next: (organizations: Organization[]) => this.dataSource.data = organizations,
      error: (e) => console.log(e)
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { ModalMode } from 'app/shared/interfaces/modal.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { firstValueFrom } from 'rxjs';
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
  currentUser: User;
  defaultPageSize = 10;

  // bind value
  dataSource: MatTableDataSource<Organization> = new MatTableDataSource([]);
  organizeCode: string;
  organizeName: string;
  selectedBu: string | any;
  selectedSubBu: string | any;
  selectedPlant: string | any;
  selectedDivision: string | any;
  selectedIsActive: boolean;

  // select option
  bus: any[] = [];
  subBus: any[] = [];
  plants: any[] = [];
  divisions: any[] = [];
  isActives: any = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];

  // table setting
  displayedColumns: string[] = [
    'index',
    'organizeCode',
    'organizeName',
    'businessUnitCode',
    'subBusinessUnitCode',
    'plantCode',
    'divisionCode',
    'isActive'
  ];

  keyToColumnName: any = {
    'index': 'No.',
    'organizeCode': 'Organize Code',
    'organizeName': 'Organize Name',
    'businessUnitCode': 'Business Unit Code',
    'subBusinessUnitCode': 'Sub-Business Unit Code',
    'plantCode': 'Plant Code',
    'divisionCode': 'Division Code',
    'isActive': 'Status',
    'editDeleteIcon': ''
  };

  notSortColumn: string[] = [
    'index',
    'editDeleteIcon'
  ];

  constructor(
    private _organizationService: OrganizationService,
    private _userService: UserService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _matDialog: MatDialog,
    private _activatedRoute: ActivatedRoute
  ) {
    this.loadOrganizations();
  }

  async ngOnInit(): Promise<void> {
    const bus = this._activatedRoute.snapshot.data.bus;
    const subBus = this._activatedRoute.snapshot.data.subBus;
    const plants = this._activatedRoute.snapshot.data.plants;
    const divisions = this._activatedRoute.snapshot.data.divisions;
    this.bus = bus.filter((master) => master.type == 'BUSINESS_UNIT').map((master) => ({ title: master.name, value: master.code }));
    this.subBus = subBus.filter((master) => master.type == 'SUB_BUSINESS_UNIT').map((master) => ({ title: master.name, value: master.code }));
    this.plants = plants.filter((master) => master.type == 'PLANT').map((master) => ({ title: master.name, value: master.code }));
    this.divisions = divisions.filter((master) => master.type == 'DIVISION').map((master) => ({ title: master.name, value: master.code }));
    // default
    this.dataSource.filterPredicate = this.customFilterPredicate();

    this.currentUser = await firstValueFrom(this._userService.user$);
    if (this.currentUser?.groupId === 1) {
      this.displayedColumns.push('editDeleteIcon');
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Organization, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.organizeCode || data.organizeCode.toString().trim().toLowerCase().indexOf(searchString.organizeCode.toLowerCase()) !== -1)
        && (!searchString.organizeName || data.organizeName.toString().trim().toLowerCase().indexOf(searchString.organizeName.toLowerCase()) !== -1)
        && (searchString.businessUnitCode == undefined || data.businessUnitCode == searchString.businessUnitCode)
        && (searchString.subBusinessUnitCode == undefined || data.subBusinessUnitCode == searchString.subBusinessUnitCode)
        && (searchString.plantCode == undefined || data.plantCode == searchString.plantCode)
        && (searchString.divisionCode == undefined || data.divisionCode == searchString.divisionCode)
        && (searchString.isActive == undefined || data.isActive == searchString.isActive);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      organizeCode: this.organizeCode,
      organizeName: this.organizeName,
      businessUnitCode: typeof this.selectedBu === 'string' ? this.selectedBu : this.selectedBu?.value,
      subBusinessUnitCode: typeof this.selectedSubBu === 'string' ? this.selectedSubBu : this.selectedSubBu?.value,
      plantCode: typeof this.selectedPlant === 'string' ? this.selectedPlant : this.selectedPlant?.value,
      divisionCode: typeof this.selectedDivision === 'string' ? this.selectedDivision : this.selectedDivision?.value,
      isActive: this.selectedIsActive
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.organizeCode = '';
    this.organizeName = '';
    this.selectedBu = undefined;
    this.selectedSubBu = undefined;
    this.selectedPlant = undefined;
    this.selectedDivision = undefined;
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
    this._organizationService.getOrganization(element.id).subscribe({
      next: (organization: Organization) => {
        const dialogRef = this._matDialog.open(OrganizationModalComponent, {
          data: {
            mode: ModalMode.EDIT,
            data: organization
          }
        });
        dialogRef.afterClosed()
          .subscribe((isEdit: boolean) => {
            if (!isEdit) return; // cancel
            this.loadOrganizations();
          });
      },
      error: (e) => {
        this._snackBarService.error();
        console.error(e)
      }
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

  onClick() {
    return false;
  }
}

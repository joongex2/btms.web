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
import { MasterService } from '../master/master.service';
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
    private _activatedRoute: ActivatedRoute,
    private _masterService: MasterService
  ) {
    this.loadOrganizations();
  }

  async ngOnInit(): Promise<void> {
    this.bus = this._activatedRoute.snapshot.data.bus;
    this.divisions = this._activatedRoute.snapshot.data.divisions;
    // default
    this.dataSource.filterPredicate = this.customFilterPredicate();

    this.currentUser = await firstValueFrom(this._userService.user$);
    if ([1, 2].includes(this.currentUser?.groupId)) {
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
        && (searchString.businessUnitCode == undefined || data.businessUnitCode.toString().trim().toLowerCase().indexOf(searchString.businessUnitCode.toLowerCase()) !== -1)
        && (searchString.subBusinessUnitCode == undefined || data.subBusinessUnitCode.toString().trim().toLowerCase().indexOf(searchString.subBusinessUnitCode.toLowerCase()) !== -1)
        && (searchString.plantCode == undefined || data.plantCode.toString().trim().toLowerCase().indexOf(searchString.plantCode.toLowerCase()) !== -1)
        && (searchString.divisionCode == undefined || data.divisionCode.toString().trim().toLowerCase().indexOf(searchString.divisionCode.toLowerCase()) !== -1)
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

  async addOrganization(): Promise<void> {
    const dialogRef = this._matDialog.open(OrganizationModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined,
        bus: (await firstValueFrom(this._masterService.getBus())),
        divisions: (await firstValueFrom(this._masterService.getDivisions()))
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
      next: async (organization: Organization) => {
        const dialogRef = this._matDialog.open(OrganizationModalComponent, {
          data: {
            mode: ModalMode.EDIT,
            data: organization,
            bus: (await firstValueFrom(this._masterService.getBus())),
            divisions: (await firstValueFrom(this._masterService.getDivisions()))
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

  async buChange(bu: any) {
    if (typeof bu === 'string') {
      this.selectedSubBu = null;
      this.selectedPlant = null;
    } else {
      this.subBus = await firstValueFrom(this._masterService.getSubBus(bu.id));
    }
  }

  async subBuChange(subBu: any) {
    if (typeof subBu === 'string') {
      this.selectedPlant = null;
    } else {
      this.plants = await firstValueFrom(this._masterService.getPlants(subBu.id));
    }
  }
}

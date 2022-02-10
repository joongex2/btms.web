import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../admin.service';
import { Bu, Department, Division, Organization, Plant, Status, SubBu } from '../admin.types';
import { ModalMode } from '../modals/modal.types';
import { OrganizationModalComponent } from '../modals/organization-modal/organization-modal.component';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('organizationTable') organizationTable: MatTable<Organization>;
  organizations: Organization[];
  bus: any[];
  subBus: any[];
  plants: any[];
  divisions: any[];
  departments: any[];

  // bind value
  dataSource: MatTableDataSource<Organization>;
  organizationCode: string;
  organizationDescription: string;
  bu: Bu;
  subBu: SubBu;
  plant: Plant;
  division: Division;
  department: Department;
  selectedStatus: Status;

  // select option
  statuses: any = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ]

  // table setting
  displayedColumns: string[] = [
    'organizationCode',
    'organizationDescription',
    'bu',
    'subBu',
    'plant',
    'division',
    'department',
    'status',
    'userRole',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'organizationCode': 'Organization Code',
    'organizationDescription': 'Organization Description',
    'bu': 'BU',
    'subBu': 'Sub-BU',
    'plant': 'Plant',
    'division': 'Division',
    'department': 'Department',
    'status': 'Status',
    'userRole': 'User Role'
  };

  objColumns: string[] = [
    'bu',
    'subBu',
    'plant',
    'division',
    'department'
  ];

  constructor(
    private _adminService: AdminService,
    private _matDialog: MatDialog
  ) {
    this.organizations = this._adminService.getOrganizations();
    this.dataSource = new MatTableDataSource(this.organizations);
  }

  ngOnInit(): void {
    // get all admin values
    this.bus = this._adminService.getBus().map((bu) => ({ title: bu.buDescription, value: bu }));
    this.subBus = this._adminService.getSubBus().map((subBu) => ({ title: subBu.subBuDescription, value: subBu }));
    this.plants = this._adminService.getPlants().map((plant) => ({ title: plant.plantDescription, value: plant }));
    this.divisions = this._adminService.getDivisions().map((division) => ({ title: division.divisionDescription, value: division }));
    this.departments = this._adminService.getDepartments().map((department) => ({ title: department.departmentDescription, value: department }));

    // default
    this.selectedStatus = Status.ACTIVE;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Organization, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.organizationCode || data.organizationCode.toString().trim().toLowerCase().indexOf(searchString.organizationCode.toLowerCase()) !== -1)
        && (!searchString.organizationDescription || data.organizationDescription.toString().trim().toLowerCase().indexOf(searchString.organizationDescription.toLowerCase()) !== -1)
        && (!searchString.bu || data.bu.buDescription == searchString.bu.buDescription)
        && (!searchString.subBu || data.subBu.subBuDescription == searchString.subBu.subBuDescription)
        && (!searchString.plant || data.plant.plantDescription == searchString.plant.plantDescription)
        && (!searchString.division || data.division.divisionDescription == searchString.division.divisionDescription)
        && (!searchString.department || data.department.departmentDescription == searchString.department.departmentDescription)
        && (!searchString.status || data.status.toString().trim().toLowerCase().indexOf(searchString.status.toLowerCase()) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      organizationCode: this.organizationCode,
      organizationDescription: this.organizationDescription,
      bu: this.bu,
      subBu: this.subBu,
      plant: this.plant,
      division: this.division,
      department: this.department,
      status: this.selectedStatus
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.organizationCode = undefined;
    this.organizationDescription = undefined;
    this.bu = undefined;
    this.subBu = undefined;
    this.plant = undefined;
    this.division = undefined;
    this.department = undefined;
    this.selectedStatus = undefined;
  }

  addOrganization(): void {
    const dialogRef = this._matDialog.open(OrganizationModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((organization: Organization) => {
        if (!organization) return; // cancel
        organization.userRoles = [];
        this.organizations.push(organization);
        this.dataSource.data = this.organizations;
        this.organizationTable.renderRows();
      });
  }

  editOrganization(index: number) {
    const dialogRef = this._matDialog.open(OrganizationModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.organizations[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((organization: Organization) => {
        if (!organization) return; // cancel
        this.organizations[index] = organization;
        this.dataSource.data = this.organizations;
        this.organizationTable.renderRows();
      });
  }

  deleteOrganization(index: number) {
    this.organizations.splice(index, 1);
    this.dataSource.data = this.organizations;
    this.organizationTable.renderRows();
  }
}

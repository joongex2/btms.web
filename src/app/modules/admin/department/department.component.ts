import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../admin.service';
import { Department, Status } from '../admin.types';
import { DepartmentModalComponent } from '../modals/department-modal/department-modal.component';
import { ModalMode } from '../modals/modal.types';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('departmentTable') departmentTable: MatTable<Department>;
  departments: Department[];

  // bind value
  dataSource: MatTableDataSource<Department>;
  departmentCode: string;
  departmentDescription: string;
  selectedStatus: Status;

  // select option
  statuses: any = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ]

  // table setting
  displayedColumns: string[] = [
    'departmentCode',
    'departmentDescription',
    'status',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'departmentCode': 'Department Code',
    'departmentDescription': 'Department Description',
    'status': 'Status'
  };

  constructor(
    private _adminService: AdminService,
    private _matDialog: MatDialog
  ) {
    this.departments = this._adminService.getDepartments();
    this.dataSource = new MatTableDataSource(this.departments);
  }

  ngOnInit(): void {
    // default
    this.selectedStatus = Status.ACTIVE;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Department, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.departmentCode || data.departmentCode.toString().trim().toLowerCase().indexOf(searchString.departmentCode.toLowerCase()) !== -1)
        && (!searchString.departmentDescription || data.departmentDescription.toString().trim().toLowerCase().indexOf(searchString.departmentDescription.toLowerCase()) !== -1)
        && (!searchString.status || data.status.toString().trim().toLowerCase().indexOf(searchString.status.toLowerCase()) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      departmentCode: this.departmentCode,
      departmentDescription: this.departmentDescription,
      status: this.selectedStatus
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.departmentCode = undefined;
    this.departmentDescription = undefined;
    this.selectedStatus = undefined;
  }

  addDepartment(): void {
    const dialogRef = this._matDialog.open(DepartmentModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((department: Department) => {
        if (!department) return; // cancel
        this.departments.push(department);
        this.dataSource.data = this.departments;
        this.departmentTable.renderRows();
      });
  }

  editDepartment(index: number) {
    const dialogRef = this._matDialog.open(DepartmentModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.departments[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((department: Department) => {
        if (!department) return; // cancel
        this.departments[index] = department;
        this.dataSource.data = this.departments;
        this.departmentTable.renderRows();
      });
  }

  deleteDepartment(index: number) {
    this.departments.splice(index, 1);
    this.dataSource.data = this.departments;
    this.departmentTable.renderRows();
  }
}

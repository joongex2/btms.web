import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ModalMode } from '../modals/modal.types';
import { RoleModalComponent } from '../modals/role-modal/role-modal.component';
import { SuperAdminService } from '../super-admin.service';
import { Role, RoleStatus } from '../super-admin.types';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('roleTable') roleTable: MatTable<Role>;
  roles: Role[];

  // bind value
  dataSource: MatTableDataSource<Role>;
  roleCode: string;
  roleDescription: string;
  selectedStatus: string;

  // select option
  statuses: any = [
    { title: 'Active', value: RoleStatus.ACTIVE },
    { title: 'Expired', value: RoleStatus.EXPIRED }
  ]

  // table setting
  displayedColumns: string[] = [
    'roleCode',
    'roleDescription',
    'sequence',
    'status',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'roleCode': 'Role ID',
    'roleDescription': 'Role Description',
    'sequence': 'Sequence',
    'status': 'Status'
  };

  constructor(
    private _superAdminService: SuperAdminService,
    private _matDialog: MatDialog
  ) {
    this.roles = this._superAdminService.getRoles();
    this.dataSource = new MatTableDataSource(this.roles);
  }

  ngOnInit(): void {
    // default
    this.selectedStatus = RoleStatus.ACTIVE;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Role, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.roleCode || data.roleCode.toString().trim().toLowerCase().indexOf(searchString.roleCode.toLowerCase()) !== -1)
        && (!searchString.roleDescription || data.roleDescription.toString().trim().toLowerCase().indexOf(searchString.roleDescription.toLowerCase()) !== -1)
        && (!searchString.status || data.status.toString().trim().toLowerCase().indexOf(searchString.status.toLowerCase()) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      roleCode: this.roleCode,
      roleDescription: this.roleDescription,
      status: this.selectedStatus
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.roleCode = undefined;
    this.roleDescription = undefined;
    this.selectedStatus = undefined;
  }

  addRole(): void {
    const dialogRef = this._matDialog.open(RoleModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((role: Role) => {
        if (!role) return; // cancel
        this.roles.push(role);
        this.dataSource.data = this.roles;
        this.roleTable.renderRows();
      });
  }

  editRole(index: number) {
    const dialogRef = this._matDialog.open(RoleModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.roles[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((role: Role) => {
        if (!role) return; // cancel
        this.roles[index] = role;
        this.dataSource.data = this.roles;
        this.roleTable.renderRows();
      });
  }

  deleteRole(index: number) {
    this.roles.splice(index, 1);
    this.dataSource.data = this.roles;
    this.roleTable.renderRows();
  }
}

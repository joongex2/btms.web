import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { SuperAdminService } from 'app/modules/super-admin/super-admin.service';
import { Role } from 'app/modules/super-admin/super-admin.types';
import { AdminService } from '../../admin.service';
import { Status, User, UserRole } from '../../admin.types';
import { ModalMode } from '../../modals/modal.types';
import { UserRoleModalComponent } from '../../modals/user-role-modal/user-role-modal.component';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('userRoleTable') userRoleTable: MatTable<UserRole>;

  organizationCode: string;
  roles: any[];
  users: any[];
  userRoles: UserRole[];

  // bind value
  dataSource: MatTableDataSource<UserRole>;
  role: Role;
  user: User;
  selectedStatus: Status;

  // select option
  statuses: any = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ]

  // table setting
  displayedColumns: string[] = [
    'roleDescription',
    'userName',
    'status',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'roleDescription': 'Role Description',
    'userName': 'Full Name',
    'status': 'Status'
  };

  constructor(
    private route: ActivatedRoute,
    private _adminService: AdminService,
    private _superAdminService: SuperAdminService,
    private _matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.organizationCode = this.route.snapshot.paramMap.get('organizationCode');
    this.userRoles = this._adminService.getUserRoles(this.organizationCode);
    this.dataSource = new MatTableDataSource(this.userRoles);

    // get all admin values
    this.roles = this._superAdminService.getRoles().map((role) => ({ title: role.roleDescription, value: role }));
    this.users = this._adminService.getUsers().map((user) => ({ title: user.userName, value: user }));

    // default
    this.selectedStatus = Status.ACTIVE;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: UserRole, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.role || data.role.roleCode == searchString.role.roleCode)
        && (!searchString.user || data.user.userLogin == searchString.user.userLogin)
        && (!searchString.status || data.status.toString().trim().toLowerCase().indexOf(searchString.status.toLowerCase()) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      role: this.role,
      user: this.user,
      status: this.selectedStatus
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.role = undefined;
    this.user = undefined;
    this.selectedStatus = undefined;
  }

  addUserRole(): void {
    const dialogRef = this._matDialog.open(UserRoleModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((userRole: UserRole) => {
        if (!userRole) return; // cancel
        this.userRoles.push(userRole);
        this.dataSource.data = this.userRoles;
        this.userRoleTable.renderRows();
      });
  }

  editUserRole(index: number) {
    const dialogRef = this._matDialog.open(UserRoleModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.userRoles[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((userRole: UserRole) => {
        if (!userRole) return; // cancel
        this.userRoles[index] = userRole;
        this.dataSource.data = this.userRoles;
        this.userRoleTable.renderRows();
      });
  }

  deleteUserRole(index: number) {
    this.userRoles.splice(index, 1);
    this.dataSource.data = this.userRoles;
    this.userRoleTable.renderRows();
  }

}

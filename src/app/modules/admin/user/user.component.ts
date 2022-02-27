import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RoleService } from 'app/modules/super-admin/role/role.service';
import { Role } from 'app/modules/super-admin/role/role.types';
import { UserGroupService } from 'app/modules/super-admin/user-group/user-group.service';
import { UserGroup } from 'app/modules/super-admin/user-group/user-group.types';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { OrganizationService } from '../organization/organization.service';
import { Organization } from '../organization/organization.types';
import { UserService } from './user.service';
import { User } from './user.types';



@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // bind value
  dataSource: MatTableDataSource<User> = new MatTableDataSource([]);
  userGroups: any[];
  organizations: any[];
  roles: any[];
  isActives = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];
  defaultPageSize = 5;
  resultsLength = 0;

  // bind value
  username: string;
  email: string;
  name: string;
  selectedUserGroup: string;
  selectedOrganization: string;
  selectedRole: string;
  selectedIsActive: string;

  // table setting
  displayedColumns: string[] = [
    'index',
    'username',
    'name',
    'email',
    'isActive',
    'detailIcon'
  ];

  keyToColumnName: any = {
    'index': 'ลำดับที่',
    'username': 'Username',
    'name': 'Name',
    'email': 'Email',
    'isActive': 'Status',
    'detailIcon': 'จัดการ',
  };

  notSortColumn: string[] = [
    'index',
    'detailIcon'
  ];

  constructor(
    private _userGroupService: UserGroupService,
    private _organizationService: OrganizationService,
    private _roleService: RoleService,
    private _userService: UserService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadUsers();

    this._userGroupService.getUserGroups().subscribe({
      next: (v: UserGroup[]) => { this.userGroups = v.map((v) => ({ title: v.name, value: v.id })) },
      error: (e) => console.error(e)
    });

    this._organizationService.getOrganizations().subscribe({
      next: (v: Organization[]) => { this.organizations = v.map((v) => ({ title: v.name, value: v.id })) },
      error: (e) => console.error(e)
    });

    this._roleService.getRoles().subscribe({
      next: (v: Role[]) => { this.roles = v.map((v) => ({ title: v.name, value: v.id })) },
      error: (e) => console.error(e)
    });

    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: User, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.username || data.username.toString().trim().toLowerCase().indexOf(searchString.username.toLowerCase()) !== -1)
        && (!searchString.email || data.email.toString().trim().toLowerCase().indexOf(searchString.email.toLowerCase()) !== -1)
        && (!searchString.name || data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1)
        && (searchString.userGroup == undefined || data.groupId == searchString.userGroup)
        && (searchString.organization == undefined || data.organizes == searchString.organization)
        // && (searchString.role == undefined || data.role == searchString.role)
        && (searchString.isActive == undefined || data.isActive == searchString.isActive);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      username: this.username,
      email: this.email,
      name: this.name,
      userGroup: this.selectedUserGroup,
      organization: this.selectedOrganization,
      role: this.selectedRole,
      isActive: this.selectedIsActive
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.username = '';
    this.email = '';
    this.name = '';
    this.selectedUserGroup = undefined;
    this.selectedOrganization = undefined;
    this.selectedRole = undefined;
    this.selectedIsActive = undefined;
  }

  // addUser(): void {
  //   const dialogRef = this._matDialog.open(UserModalComponent, {
  //     data: {
  //       mode: ModalMode.ADD,
  //       data: undefined
  //     }
  //   });
  //   dialogRef.afterClosed()
  //     .subscribe((master: Master) => {
  //       if (!master) return; // cancel
  //       this.refreshTableSubject.next(true);
  //     });
  // }

  // editUser(element: User) {
  //   const dialogRef = this._matDialog.open(UserModalComponent, {
  //     data: {
  //       mode: ModalMode.EDIT,
  //       data: element
  //     }
  //   });
  //   dialogRef.afterClosed()
  //     .subscribe((isEdit: boolean) => {
  //       if (!isEdit) return; // cancel
  //       this.refreshTableSubject.next(true);
  //     });
  // }

  // deleteUser(element: User) {
  //   this._confirmationService.delete().afterClosed().subscribe(async (result) => {
  //     if (result == 'confirmed') {
  //       this._userService.deleteUser(element.id).subscribe({
  //         next: (v) => {
  //           this._snackBarService.success();
  //           this.refreshTableSubject.next(true);
  //         },
  //         error: (e) => {
  //           this._snackBarService.error();
  //           console.error(e);
  //         }
  //       });
  //     }
  //   });
  // }

  loadUsers() {
    this._userService.getUsers().subscribe({
      next: (users: User[]) => this.dataSource.data = users,
      error: (e) => console.log(e)
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService as _CurrentUserService } from 'app/core/user/user.service';
import { User as CurrentUser } from 'app/core/user/user.types';
import { AdminUserService } from 'app/modules/super-admin/admin-user/admin-user.service';
import { OrganizationService } from 'app/modules/super-admin/organization/organization.service';
import { RoleService } from 'app/modules/super-admin/role/role.service';
import { Role } from 'app/modules/super-admin/role/role.types';
import { UserGroupService } from 'app/modules/super-admin/user-group/user-group.service';
import { UserGroup } from 'app/modules/super-admin/user-group/user-group.types';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { BehaviorSubject, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { UserService } from '../user.service';
import { User } from '../user.types';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatExpansionPanel) matExpansionPanel: MatExpansionPanel;
  user: CurrentUser;

  // bind value
  dataSource: MatTableDataSource<User> = new MatTableDataSource([]);
  userGroups: any[];
  organizations: any[] = [];
  roles: any[];
  isActives = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];
  resultsLength = 0;

  // bind value
  username: string;
  email: string;
  name: string;
  selectedUserGroup: number;
  selectedOrganization: any;
  selectedRole: string;
  selectedIsActive: boolean;

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
    'index': 'No.',
    'username': 'Username',
    'name': 'Name',
    'email': 'Email',
    'isActive': 'Status',
    'detailIcon': '',
  };

  notSortColumn: string[] = [
    'index',
    'detailIcon'
  ];

  isFirstLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);

  constructor(
    private _userGroupService: UserGroupService,
    private _organizationService: OrganizationService,
    private _roleService: RoleService,
    private _userService: UserService,
    private _currentUserService: _CurrentUserService,
    private _adminUserService: AdminUserService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _matDialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.organizations = this._activatedRoute.snapshot.data.organizations?.map((v) => ({ title: `${v.organizeCode}:${v.organizeName}`, value: v.organizeCode }));
    this.user = await firstValueFrom(this._currentUserService.user$);
    this.loadUsers();

    this._userGroupService.getUserGroups().subscribe({
      next: (v: UserGroup[]) => { this.userGroups = v.map((v) => ({ title: v.name, value: v.id })) },
      error: (e) => console.error(e)
    });

    this._roleService.getRoles().subscribe({
      next: (v: Role[]) => { this.roles = v.map((v) => ({ title: v.name, value: v.code })) },
      error: (e) => console.error(e)
    });

    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  private addQueryParam(param?: object): void {
    this._router.navigate(['./'], {
      relativeTo: this._activatedRoute,
      queryParams: param,
      queryParamsHandling: 'merge'
    })
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 10;

    this.paginator.page.subscribe((v) => this.addQueryParam({
      page: v.pageIndex,
      size: v.pageSize
    }));

    this.matExpansionPanel.opened.subscribe((v) => this.addQueryParam({ expand: true }));
    this.matExpansionPanel.closed.subscribe((v) => this.addQueryParam({ expand: undefined }));

    this._activatedRoute.queryParams.pipe(
      distinctUntilChanged()
    ).subscribe(params => {
      if (!this.isFirstLoaded.value) {
        this.isFirstLoaded.subscribe((v) => {
          // set page
          this.paginator.pageIndex = parseInt(params.page);
          // this.paginator.pageSize = parseInt(params.size);
          this.paginator.pageSize = 10;
          // set filter
          this.username = params.username ? params.username : undefined;
          this.email = params.email ? params.email : undefined;
          this.name = params.name ? params.name : undefined;
          this.selectedUserGroup = params.userGroup ? parseInt(params.userGroup) : undefined;
          this.selectedOrganization = params.organization ? this.organizations.find(v => v.value === params.organization) : undefined;
          this.selectedRole = params.role ? params.role : undefined;
          this.selectedIsActive = params.isActive ? (params.isActive === 'true') : undefined;
          this.filter();
          // set expand
          if (params.expand === 'true') this.matExpansionPanel.open();
        })
      }
    });
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: User, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let foundOrg = false;
      let foundRole = false;

      if (data.organizes) {
        for (let org of data.organizes) {
          if (org.organizeCode == searchString.organization) {
            foundOrg = true;
          }
          if (org.roles) {
            for (let role of org.roles) {
              if (role.roleCode == searchString.role) {
                foundRole = true;
              }
            }
          }
        }
      }

      return (!searchString.username || data.username.toString().trim().toLowerCase().indexOf(searchString.username.toLowerCase()) !== -1)
        && (!searchString.email || data.email.toString().trim().toLowerCase().indexOf(searchString.email.toLowerCase()) !== -1)
        && (!searchString.name || data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1)
        && (searchString.userGroup == undefined || data.groupId == searchString.userGroup)
        && (searchString.organization == undefined || foundOrg)
        && (searchString.role == undefined || foundRole)
        && (searchString.isActive == undefined || data.isActive == searchString.isActive);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue = this.filter();
    this.addQueryParam(filterValue);
  }

  filter() {
    const filterValue: any = {
      username: this.username,
      email: this.email,
      name: this.name,
      userGroup: this.selectedUserGroup,
      organization: this.selectedOrganization?.value,
      role: this.selectedRole,
      isActive: this.selectedIsActive
    }
    this.dataSource.filter = JSON.stringify(filterValue);
    return filterValue;
  }

  clear() {
    this.username = undefined;
    this.email = undefined;
    this.name = undefined;
    this.selectedUserGroup = undefined;
    this.selectedOrganization = undefined;
    this.selectedRole = undefined;
    this.selectedIsActive = undefined;
    this.dataSource.filter = '{}';
    const clearParams = {
      username: undefined,
      email: undefined,
      name: undefined,
      userGroup: undefined,
      organization: undefined,
      role: undefined,
      isActive: undefined,
      page: undefined
    }
    this.addQueryParam(clearParams);
  }

  loadUsers() {
    // this._userService.getUsers().subscribe({
    this._adminUserService.getUsersByAdminId(this.user.id).subscribe({
      next: (users: User[]) => {
        // this.dataSource.data = users.filter(v => ![1, 2].includes(v.groupId));
        this.dataSource.data = users;
        if (!this.isFirstLoaded.value) this.isFirstLoaded.next(true);
      },
      error: (e) => console.log(e)
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from 'app/modules/super-admin/role/role.service';
import { Role } from 'app/modules/super-admin/role/role.types';
import { UserGroupService } from 'app/modules/super-admin/user-group/user-group.service';
import { UserGroup } from 'app/modules/super-admin/user-group/user-group.types';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { OrganizationService } from '../../organization/organization.service';
import { Organization } from '../../organization/organization.types';
import { AdminUserService } from '../admin-user.service';
import { AdminUser } from '../admin-user.types';






@Component({
  selector: 'admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss']
})
export class AdminUserListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatExpansionPanel) matExpansionPanel: MatExpansionPanel;

  // bind value
  dataSource: MatTableDataSource<AdminUser> = new MatTableDataSource([]);
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
  selectedUserGroup: number;
  selectedOrganization: string;
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
    private _userService: AdminUserService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _matDialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();

    this._userGroupService.getUserGroups().subscribe({
      next: (v: UserGroup[]) => { this.userGroups = v.map((v) => ({ title: v.name, value: v.id })) },
      error: (e) => console.error(e)
    });

    this._organizationService.getOrganizations().subscribe({
      next: (v: Organization[]) => { this.organizations = v.map((v) => ({ title: v.organizeName, value: v.organizeCode })) },
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
          this.paginator.pageSize = parseInt(params.size);
          // set filter
          this.username = params.username ? params.username : undefined;
          this.email = params.email ? params.email : undefined;
          this.name = params.name ? params.name : undefined;
          this.selectedUserGroup = params.userGroup ? parseInt(params.userGroup) : undefined;
          this.selectedOrganization = params.organization ? params.organization : undefined;
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
    const myFilterPredicate = function (data: AdminUser, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let foundOrg = false;
      let foundRole = false;

      for (let org of data.organizes) {
        if (org.id == searchString.organization) {
          foundOrg = true;
        }
        for (let role of org.role) {
          if (role.id == searchString.role) {
            foundRole = true;
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
      organization: this.selectedOrganization,
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
    this._userService.getAdminUsers().subscribe({
      next: (users: AdminUser[]) => {
        this.dataSource.data = users;
        if (!this.isFirstLoaded.value) this.isFirstLoaded.next(true);
        this.filter();
      },
      error: (e) => console.log(e)
    });
  }
}

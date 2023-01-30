import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalMode } from 'app/shared/interfaces/modal.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { UserGroupModalComponent } from './modals/user-group-modal/user-group-modal.component';
import { UserGroupService } from './user-group.service';
import { UserGroup } from './user-group.types';


@Component({
  selector: 'user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.scss']
})
export class UserGroupComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  defaultMenu: string;
  defaultPageSize = 10;

  // bind value
  dataSource: MatTableDataSource<UserGroup> = new MatTableDataSource([]);
  name = '';
  selectedIsActive: boolean = undefined;

  // select option
  isActives: any = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ]

  // table setting
  displayedColumns: string[] = [
    'index',
    'name',
    'isActive',
    'editDeleteIcon'
  ];

  keyToColumnName: any = {
    'index': 'No.',
    'name': 'Name',
    'isActive': 'Status',
    'editDeleteIcon': ''
  };

  constructor(
    private _userGroupService: UserGroupService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _matDialog: MatDialog
  ) {
    this.loadUserGroups();
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = this.customFilterPredicate();
    this._userGroupService.getDefaultMenu().subscribe({
      next: (v) => { this.defaultMenu = v.menus },
      error: (e) => console.error(e)
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: UserGroup, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.name || data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1)
        && (searchString.isActive == undefined || data.isActive == searchString.isActive)
    }
    return myFilterPredicate;
  }

  search() {
    this.paginator.pageIndex = 0;
    const filterValue: any = {
      name: this.name,
      isActive: this.selectedIsActive,
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.paginator.pageIndex = 0;
    this.dataSource.filter = '{}';
    this.name = '';
    this.selectedIsActive = undefined;
  }

  addUserGroup(): void {
    const dialogRef = this._matDialog.open(UserGroupModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: {
          defaultMenu: this.defaultMenu
        }
      }
    });
    dialogRef.afterClosed()
      .subscribe((isAdd: boolean) => {
        if (!isAdd) return; // cancel
        this.loadUserGroups();
      });
  }

  editUserGroup(element: UserGroup) {
    this._userGroupService.getUserGroup(element.id).subscribe({
      next: (userGroup: UserGroup) => {
        const dialogRef = this._matDialog.open(UserGroupModalComponent, {
          data: {
            mode: ModalMode.EDIT,
            data: {
              defaultMenu: this.defaultMenu,
              userGroup
            }
          }
        });
        dialogRef.afterClosed()
          .subscribe((isEdit: boolean) => {
            if (!isEdit) return; // cancel
            this.loadUserGroups();
          });
      },
      error: (e) => {
        this._snackBarService.error();
        console.error(e)
      }
    });
  }

  deleteUserGroup(element: UserGroup) {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this._userGroupService.deleteUserGroup(element.id).subscribe({
          next: (v) => {
            this._snackBarService.success();
            this.loadUserGroups()
          },
          error: (e) => {
            this._snackBarService.error();
            console.error(e)
          }
        });
      }
    });
  }

  loadUserGroups() {
    this._userGroupService.getUserGroups().subscribe({
      next: (userGroups: UserGroup[]) => this.dataSource.data = userGroups,
      error: (e) => console.log(e)
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ModalMode } from '../modals/modal.types';
import { UserGroupModalComponent } from '../modals/user-group-modal/user-group-modal.component';
import { SuperAdminService } from '../super-admin.service';
import { GroupStatus, UserGroup } from '../super-admin.types';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.scss']
})
export class UserGroupComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('userGroupTable') userGroupTable: MatTable<UserGroup>;
  userGroups: UserGroup[];

  // bind value
  dataSource: MatTableDataSource<UserGroup>;
  groupCode: string;
  groupDescription: string;
  sequence: string;
  selectedStatus: string;

  // select option
  statuses: any = [
    { title: 'Active', value: GroupStatus.ACTIVE },
    { title: 'Expired', value: GroupStatus.EXPIRED }
  ]

  // table setting
  displayedColumns: string[] = [
    'groupCode',
    'groupDescription',
    'sequence',
    'status',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'groupCode': 'Group Code',
    'groupDescription': 'Group Description',
    'sequence': 'Sequence',
    'status': 'status'
  };

  constructor(
    private _superAdminService: SuperAdminService,
    private _matDialog: MatDialog
  ) {
    this.userGroups = this._superAdminService.getGroups();
    this.dataSource = new MatTableDataSource(this.userGroups);
  }

  ngOnInit(): void {
    // default
    this.selectedStatus = GroupStatus.ACTIVE;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: UserGroup, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.groupCode || data.groupCode.toString().trim().toLowerCase().indexOf(searchString.groupCode.toLowerCase()) !== -1)
        && (!searchString.groupDescription || data.groupDescription.toString().trim().toLowerCase().indexOf(searchString.groupDescription.toLowerCase()) !== -1)
        && (!searchString.sequence || data.sequence.toString().trim().toLowerCase().indexOf(searchString.sequence.toLowerCase()) !== -1)
        && (!searchString.status || data.status.toString().trim().toLowerCase().indexOf(searchString.status.toLowerCase()) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      groupCode: this.groupCode,
      groupDescription: this.groupDescription,
      sequence: this.sequence,
      status: this.selectedStatus
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.groupCode = undefined;
    this.groupDescription = undefined;
    this.sequence = undefined;
    this.selectedStatus = undefined;
  }

  addUserGroup(): void {
    const dialogRef = this._matDialog.open(UserGroupModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((userGroup: UserGroup) => {
        if (!userGroup) return; // cancel
        this.userGroups.push(userGroup);
        this.dataSource.data = this.userGroups;
        this.userGroupTable.renderRows();
      });
  }

  editUserGroup(index: number) {
    const dialogRef = this._matDialog.open(UserGroupModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.userGroups[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((userGroup: UserGroup) => {
        if (!userGroup) return; // cancel
        this.userGroups[index] = userGroup;
        this.dataSource.data = this.userGroups;
        this.userGroupTable.renderRows();
      });
  }

  deleteUserGroup(index: number) {
    this.userGroups.splice(index, 1);
    this.dataSource.data = this.userGroups;
    this.userGroupTable.renderRows();
  }
}

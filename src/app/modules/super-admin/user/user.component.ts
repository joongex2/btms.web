import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ModalMode } from '../modals/modal.types';
import { UserModalComponent } from '../modals/user-modal/user-modal.component';
import { SuperAdminService } from '../super-admin.service';
import { User, UserStatus } from '../super-admin.types';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('userTable') userTable: MatTable<User>;
  users: User[];

  // bind value
  dataSource: MatTableDataSource<User>;
  userLogin: string;
  password: string;
  userName: string;
  email: string;
  selectedGroup: string;
  selectedStatus: UserStatus;

  // select option
  groups: any = [
    { title: '01', value: '01' },
    { title: '02', value: '02' },
    { title: '03', value: '03' },
    { title: '04', value: '04' },
    { title: '05', value: '05' },
    { title: '06', value: '06' },
  ]
  statuses: any = [
    { title: 'Active', value: UserStatus.ACTIVE },
    { title: 'Expired', value: UserStatus.EXPIRED }
  ]

  // table setting
  displayedColumns: string[] = [
    'detailIcon',
    'userLogin',
    'userName',
    'email',
    'group',
    'status',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'userLogin': 'User Login',
    'userName': 'Full Name',
    'email': 'Email',
    'group': 'Group',
    'status': 'Status'
  };

  constructor(
    private _superAdminService: SuperAdminService,
    private _matDialog: MatDialog
  ) {
    this.users = this._superAdminService.getUsers();
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnInit(): void {
    // default
    this.selectedStatus = UserStatus.ACTIVE;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: User, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.userLogin || data.userLogin.toString().trim().toLowerCase().indexOf(searchString.userLogin.toLowerCase()) !== -1)
        && (!searchString.userName || data.userName.toString().trim().toLowerCase().indexOf(searchString.userName.toLowerCase()) !== -1)
        && (!searchString.email || data.email.toString().trim().toLowerCase().indexOf(searchString.email.toLowerCase()) !== -1)
        && (!searchString.group || data.group.toString().trim().toLowerCase().indexOf(searchString.group.toLowerCase()) !== -1)
        && (!searchString.status || data.status.toString().trim().toLowerCase().indexOf(searchString.status.toLowerCase()) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      userLogin: this.userLogin,
      userName: this.userName,
      email: this.email,
      group: this.selectedGroup,
      status: this.selectedStatus
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.userLogin = undefined;
    this.userName = undefined;
    this.email = undefined;
    this.selectedGroup = undefined;
    this.selectedStatus = undefined;
  }

  addUser(): void {
    const dialogRef = this._matDialog.open(UserModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((user: User) => {
        if (!user) return; // cancel
        this.users.push(user);
        this.dataSource.data = this.users;
        this.userTable.renderRows();
      });
  }

  editUser(index: number) {
    const dialogRef = this._matDialog.open(UserModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.users[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((user: User) => {
        if (!user) return; // cancel
        this.users[index] = user;
        this.dataSource.data = this.users;
        this.userTable.renderRows();
      });
  }

  deleteUser(index: number) {
    this.users.splice(index, 1);
    this.dataSource.data = this.users;
    this.userTable.renderRows();
  }
}

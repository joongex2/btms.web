import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalMode } from 'app/shared/interfaces/modal.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { RoleModalComponent } from './modals/role-modal/role-modal.component';
import { RoleService } from './role.service';
import { Role } from './role.types';



@Component({
  selector: 'role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // bind value
  dataSource: MatTableDataSource<Role> = new MatTableDataSource([]);
  code: string;
  name: string;
  selectedIsActive: boolean;

  // select option
  isActives: any = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];

  // table setting
  displayedColumns: string[] = [
    'index',
    'code',
    'name',
    'isActive',
    'editDeleteIcon'
  ];

  keyToColumnName: any = {
    'index': 'ลำดับที่',
    'code': 'Code',
    'name': 'Name',
    'isActive': 'Status',
    'editDeleteIcon': 'จัดการ'
  };

  notSortColumn: string[] = [
    'index',
    'editDeleteIcon'
  ];

  constructor(
    private _roleService: RoleService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _matDialog: MatDialog
  ) {
    this.loadRoles();
  }

  ngOnInit(): void {
    // default
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Role, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.code || data.code.toString().trim().toLowerCase().indexOf(searchString.code.toLowerCase()) !== -1)
        && (!searchString.name || data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1)
        && (searchString.isActive == undefined || data.isActive == searchString.isActive);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      code: this.code,
      name: this.name,
      isActive: this.selectedIsActive
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.code = '';
    this.name = '';
    this.selectedIsActive = undefined;
  }

  addRole(): void {
    const dialogRef = this._matDialog.open(RoleModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((isAdd: boolean) => {
        if (!isAdd) return; // cancel
        this.loadRoles();
      });
  }

  editRole(element: Role) {
    this._roleService.getRole(element.id).subscribe({
      next: (role: Role) => {
        const dialogRef = this._matDialog.open(RoleModalComponent, {
          data: {
            mode: ModalMode.EDIT,
            data: role
          }
        });
        dialogRef.afterClosed()
          .subscribe((isEdit: boolean) => {
            if (!isEdit) return; // cancel
            this.loadRoles();
          });
      },
      error: (e) => {
        this._snackBarService.error();
        console.error(e)
      }
    });
  }

  deleteRole(element: Role) {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this._roleService.deleteRole(element.id).subscribe({
          next: (v) => {
            this._snackBarService.success();
            this.loadRoles()
          },
          error: (e) => {
            this._snackBarService.error();
            console.error(e)
          }
        });
      }
    });
  }

  loadRoles() {
    this._roleService.getRoles().subscribe({
      next: (roles: Role[]) => this.dataSource.data = roles,
      error: (e) => console.log(e)
    });
  }
}

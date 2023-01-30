import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalMode } from 'app/shared/interfaces/modal.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { MasterService } from './master.service';
import { Master } from './master.types';
import { MasterModalComponent } from './modals/master-modal/master-modal.component';



@Component({
  selector: 'master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  defaultPageSize = 10;

  // bind value
  dataSource: MatTableDataSource<Master> = new MatTableDataSource([]);
  code: string;
  name: string;
  selectedType: string;
  selectedIsActive: boolean;

  // select option
  types: any[];
  isActives: any[] = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];

  // table setting
  displayedColumns: string[] = [
    'index',
    'type',
    'code',
    'name',
    'isActive',
    'editDeleteIcon'
  ];

  keyToColumnName: any = {
    'index': 'No.',
    'type': 'Type',
    'code': 'Code',
    'name': 'Name',
    'isActive': 'Status',
    'editDeleteIcon': ''
  };

  notSortColumn: string[] = [
    'index',
    'editDeleteIcon'
  ];

  masterTypeMapper: { [key: string]: string };

  constructor(
    private _masterService: MasterService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _matDialog: MatDialog
  ) {
    this.loadMasters();
  }

  ngOnInit(): void {
    this._masterService.getMasterTypes().subscribe({
      next: (types: any[]) => {
        this.types = types.map((type) => ({ title: type.name, value: type.type }));
        this.masterTypeMapper = types.reduce((prev, cur) => {
          prev[cur.type] = cur.name;
          return prev;
        }, {});
      },
      error: (e) => console.log(e)
    });

    // default
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Master, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.code || data.code.toString().trim().toLowerCase().indexOf(searchString.code.toLowerCase()) !== -1)
        && (!searchString.name || data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1)
        && (searchString.type == undefined || data.type == searchString.type)
        && (searchString.isActive == undefined || data.isActive == searchString.isActive);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      code: this.code,
      name: this.name,
      type: this.selectedType,
      isActive: this.selectedIsActive
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.code = '';
    this.name = '';
    this.selectedType = undefined;
    this.selectedIsActive = undefined;
  }

  addMaster(): void {
    const dialogRef = this._matDialog.open(MasterModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((isAdd: boolean) => {
        if (!isAdd) return; // cancel
        this.loadMasters();
      });
  }

  editMaster(element: Master) {
    this._masterService.getMaster(element.id).subscribe({
      next: (master: Master) => {
        const dialogRef = this._matDialog.open(MasterModalComponent, {
          data: {
            mode: ModalMode.EDIT,
            data: master
          }
        });
        dialogRef.afterClosed()
          .subscribe((isEdit: boolean) => {
            if (!isEdit) return; // cancel
            this.loadMasters();
          });
      },
      error: (e) => {
        this._snackBarService.error();
        console.error(e)
      }
    });
  }

  deleteMaster(element: Master) {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this._masterService.deleteMaster(element.id).subscribe({
          next: (v) => {
            this._snackBarService.success();
            this.loadMasters()
          },
          error: (e) => {
            this._snackBarService.error();
            console.error(e)
          }
        });
      }
    });
  }

  loadMasters() {
    this._masterService.getMasters().subscribe({
      next: (masters: Master[]) => this.dataSource.data = masters,
      error: (e) => console.log(e)
    });
  }
}

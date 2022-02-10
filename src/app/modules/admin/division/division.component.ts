import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../admin.service';
import { Division, Status } from '../admin.types';
import { DivisionModalComponent } from '../modals/division-modal/division-modal.component';
import { ModalMode } from '../modals/modal.types';

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss']
})
export class DivisionComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('divisionTable') divisionTable: MatTable<Division>;
  divisions: Division[];

  // bind value
  dataSource: MatTableDataSource<Division>;
  divisionCode: string;
  divisionDescription: string;
  selectedStatus: Status;

  // select option
  statuses: any = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ]

  // table setting
  displayedColumns: string[] = [
    'divisionCode',
    'divisionDescription',
    'status',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'divisionCode': 'Division Code',
    'divisionDescription': 'Division Description',
    'status': 'Status'
  };

  constructor(
    private _adminService: AdminService,
    private _matDialog: MatDialog
  ) {
    this.divisions = this._adminService.getDivisions();
    this.dataSource = new MatTableDataSource(this.divisions);
  }

  ngOnInit(): void {
    // default
    this.selectedStatus = Status.ACTIVE;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Division, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.divisionCode || data.divisionCode.toString().trim().toLowerCase().indexOf(searchString.divisionCode.toLowerCase()) !== -1)
        && (!searchString.divisionDescription || data.divisionDescription.toString().trim().toLowerCase().indexOf(searchString.divisionDescription.toLowerCase()) !== -1)
        && (!searchString.status || data.status.toString().trim().toLowerCase().indexOf(searchString.status.toLowerCase()) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      divisionCode: this.divisionCode,
      divisionDescription: this.divisionDescription,
      status: this.selectedStatus
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.divisionCode = undefined;
    this.divisionDescription = undefined;
    this.selectedStatus = undefined;
  }

  addDivision(): void {
    const dialogRef = this._matDialog.open(DivisionModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((division: Division) => {
        if (!division) return; // cancel
        this.divisions.push(division);
        this.dataSource.data = this.divisions;
        this.divisionTable.renderRows();
      });
  }

  editDivision(index: number) {
    const dialogRef = this._matDialog.open(DivisionModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.divisions[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((division: Division) => {
        if (!division) return; // cancel
        this.divisions[index] = division;
        this.dataSource.data = this.divisions;
        this.divisionTable.renderRows();
      });
  }

  deleteDivision(index: number) {
    this.divisions.splice(index, 1);
    this.dataSource.data = this.divisions;
    this.divisionTable.renderRows();
  }
}

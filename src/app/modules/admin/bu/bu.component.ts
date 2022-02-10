import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../admin.service';
import { Bu, Status } from '../admin.types';
import { BuModalComponent } from '../modals/bu-modal/bu-modal.component';
import { ModalMode } from '../modals/modal.types';

@Component({
  selector: 'app-bu',
  templateUrl: './bu.component.html',
  styleUrls: ['./bu.component.scss']
})
export class BuComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('buTable') buTable: MatTable<Bu>;
  bus: Bu[];

  // bind value
  dataSource: MatTableDataSource<Bu>;
  buCode: string;
  buDescription: string;
  selectedStatus: Status;

  // select option
  statuses: any = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ]

  // table setting
  displayedColumns: string[] = [
    'buCode',
    'buDescription',
    'status',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'buCode': 'BU Code',
    'buDescription': 'BU Description',
    'status': 'Status'
  };

  constructor(
    private _adminService: AdminService,
    private _matDialog: MatDialog
  ) {
    this.bus = this._adminService.getBus();
    this.dataSource = new MatTableDataSource(this.bus);
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
    const myFilterPredicate = function (data: Bu, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.buCode || data.buCode.toString().trim().toLowerCase().indexOf(searchString.buCode.toLowerCase()) !== -1)
        && (!searchString.buDescription || data.buDescription.toString().trim().toLowerCase().indexOf(searchString.buDescription.toLowerCase()) !== -1)
        && (!searchString.status || data.status.toString().trim().toLowerCase().indexOf(searchString.status.toLowerCase()) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      buCode: this.buCode,
      buDescription: this.buDescription,
      status: this.selectedStatus
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.buCode = undefined;
    this.buDescription = undefined;
    this.selectedStatus = undefined;
  }

  addBu(): void {
    const dialogRef = this._matDialog.open(BuModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((bu: Bu) => {
        if (!bu) return; // cancel
        this.bus.push(bu);
        this.dataSource.data = this.bus;
        this.buTable.renderRows();
      });
  }

  editBu(element: Bu) {
    let buIndex = this.bus.findIndex((bu) => bu.buCode == element.buCode);
    const dialogRef = this._matDialog.open(BuModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.bus[buIndex]
      }
    });
    dialogRef.afterClosed()
      .subscribe((bu: Bu) => {
        if (!bu) return; // cancel
        this.bus[buIndex] = bu;
        this.dataSource.data = this.bus;
        this.buTable.renderRows();
      });
  }

  deleteBu(index: number) {
    this.bus.splice(index, 1);
    this.dataSource.data = this.bus;
    this.buTable.renderRows();
  }

}

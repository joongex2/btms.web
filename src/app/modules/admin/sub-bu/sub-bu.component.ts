import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../admin.service';
import { Status, SubBu } from '../admin.types';
import { ModalMode } from '../modals/modal.types';
import { SubBuModalComponent } from '../modals/sub-bu-modal/sub-bu-modal.component';

@Component({
  selector: 'app-sub-bu',
  templateUrl: './sub-bu.component.html',
  styleUrls: ['./sub-bu.component.scss']
})
export class SubBuComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('subBuTable') subBuTable: MatTable<SubBu>;
  subBus: SubBu[];

  // bind value
  dataSource: MatTableDataSource<SubBu>;
  subBuCode: string;
  subBuDescription: string;
  selectedStatus: Status;

  // select option
  statuses: any = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ]

  // table setting
  displayedColumns: string[] = [
    'subBuCode',
    'subBuDescription',
    'status',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'subBuCode': 'Sub-BU Code',
    'subBuDescription': 'Sub-BU Description',
    'status': 'Status'
  };

  constructor(
    private _adminService: AdminService,
    private _matDialog: MatDialog
  ) {
    this.subBus = this._adminService.getSubBus();
    this.dataSource = new MatTableDataSource(this.subBus);
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
    const myFilterPredicate = function (data: SubBu, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.subBuCode || data.subBuCode.toString().trim().toLowerCase().indexOf(searchString.subBuCode.toLowerCase()) !== -1)
        && (!searchString.subBuDescription || data.subBuDescription.toString().trim().toLowerCase().indexOf(searchString.subBuDescription.toLowerCase()) !== -1)
        && (!searchString.status || data.status.toString().trim().toLowerCase().indexOf(searchString.status.toLowerCase()) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      subBuCode: this.subBuCode,
      subBuDescription: this.subBuDescription,
      status: this.selectedStatus
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.subBuCode = undefined;
    this.subBuDescription = undefined;
    this.selectedStatus = undefined;
  }

  addSubBu(): void {
    const dialogRef = this._matDialog.open(SubBuModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((subBu: SubBu) => {
        if (!subBu) return; // cancel
        this.subBus.push(subBu);
        this.dataSource.data = this.subBus;
        this.subBuTable.renderRows();
      });
  }

  editSubBu(index: number) {
    const dialogRef = this._matDialog.open(SubBuModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.subBus[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((subBu: SubBu) => {
        if (!subBu) return; // cancel
        this.subBus[index] = subBu;
        this.dataSource.data = this.subBus;
        this.subBuTable.renderRows();
      });
  }

  deleteSubBu(index: number) {
    this.subBus.splice(index, 1);
    this.dataSource.data = this.subBus;
    this.subBuTable.renderRows();
  }

}

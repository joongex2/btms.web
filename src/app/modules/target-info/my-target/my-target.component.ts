import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TargetService } from '../target.service';
import { RunningNo } from '../target.types';

@Component({
  selector: 'my-target',
  templateUrl: './my-target.component.html',
  styleUrls: ['./my-target.component.scss'],
})
export class MyTargetComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;

  displayedColumns: string[] = [
    'runningNo',
    'revisionNo',
    'modifyNo',
    'createDate',
    'issuedDate',
    'year',
    'status',
    'creator',
    'detail'
  ];

  keyToColumnName: any = {
    'runningNo': 'Running No.',
    'revisionNo': 'Revision No.',
    'modifyNo': 'Modify No.',
    'createDate': 'Create Date',
    'issuedDate': 'Issued Date',
    'year': 'Year',
    'status': 'Status',
    'creator': 'Creator',
    'detail': 'Detail'
  };

  runningNos: RunningNo[];
  JSON: any;


  constructor(private _targetService: TargetService) {
    this.runningNos = this._targetService.getRunningNos();
    this.dataSource = new MatTableDataSource(this.runningNos);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.sortingDataAccessor = (item, property) => { return item.data[property] };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}

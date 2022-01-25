import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TargetService } from '../target.service';
import { RunningNoRecord } from '../target.types';

@Component({
  selector: 'my-target',
  templateUrl: './my-target.component.html',
  styleUrls: ['./my-target.component.scss'],
})
export class MyTargetComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  runningNoRecords: RunningNoRecord[];

  // bind value
  dataSource: any;
  selectedSite: string;
  selectedStatus: string;
  selectedDivision: string;
  runningNo: string;
  selectedDepartment: string;
  year: string;
  selectedTargetType: string;

  // select option
  sites = [
    { title: 'Site 1', value: 'site-1' },
    { title: 'Site 2', value: 'site-2' },
    { title: 'Site 3', value: 'site-3' }
  ];
  statuses = [
    { title: 'Status 1', value: 'status-1' },
    { title: 'Status 2', value: 'status-2' },
    { title: 'Status 3', value: 'status-3' }
  ];
  divisions = [
    { title: 'Division 1', value: 'division-1' },
    { title: 'Division 2', value: 'division-2' },
    { title: 'Division 3', value: 'division-3' }
  ];
  departments = [
    { title: 'Department 1', value: 'department-1' },
    { title: 'Department 2', value: 'department-2' },
    { title: 'Department 3', value: 'department-3' }
  ];
  targetTypes = [
    { title: 'Target Type 1', value: 'target-type-1' },
    { title: 'Target Type 2', value: 'target-type-2' },
    { title: 'Target Type 3', value: 'target-type-3' }
  ];

  // table setting
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

  constructor(private _targetService: TargetService) {
    this.runningNoRecords = this._targetService.getRunningNoRecords();
    this.dataSource = new MatTableDataSource(this.runningNoRecords);

    // default
    this.selectedSite = 'site-1';
    this.selectedStatus = 'status-1';
    this.selectedDivision = 'division-1';
    this.selectedDepartment = 'department-1';
    this.selectedTargetType = 'target-type-1';
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sortingDataAccessor = (item, property) => { return item.data[property] };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: RunningNoRecord, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.selectedSite || data.data.site.toString().trim().toLowerCase().indexOf(searchString.selectedSite.toLowerCase()) !== -1)
        && (!searchString.selectedStatus || data.data.status.toString().trim().toLowerCase().indexOf(searchString.selectedStatus.toLowerCase()) !== -1)
        && (!searchString.selectedDivision || data.data.division.indexOf(searchString.selectedDivision) !== -1)
        && (!searchString.runningNo || data.data.runningNo.indexOf(searchString.runningNo) !== -1)
        && (!searchString.selectedDepartment || data.data.department.indexOf(searchString.selectedDepartment) !== -1)
        && (!searchString.year || data.data.year.indexOf(searchString.year) !== -1)
        && (!searchString.selectedTargetType || data.data.targetType.indexOf(searchString.selectedTargetType) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      selectedSite: this.selectedSite,
      selectedStatus: this.selectedStatus,
      selectedDivision: this.selectedDivision,
      runningNo: this.runningNo,
      selectedDepartment: this.selectedDepartment,
      year: this.year,
      selectedTargetType: this.selectedTargetType
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.selectedSite = undefined;
    this.selectedStatus = undefined;
    this.selectedDivision = undefined;
    this.runningNo = undefined;
    this.selectedDepartment = undefined;
    this.year = undefined;
    this.selectedTargetType = undefined;
  }

}

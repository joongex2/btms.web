import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TargetService } from 'app/modules/target-info/target.service';
import { RunningNoRecord } from 'app/modules/target-info/target.types';

@Component({
  selector: 'app-target-entry',
  templateUrl: './target-entry.component.html',
  styleUrls: ['./target-entry.component.scss']
})
export class TargetEntryComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  runningNoRecords: RunningNoRecord[];

  // bind value
  dataSource: any;
  selectedSite: string;
  selectedTargetStatus: string;
  selectedDivision: string;
  runningNo: string;
  selectedDepartment: string;
  year: string;
  selectedDocumentType: string;

  // select option
  sites = [
    { title: 'Site 1', value: 'site-1' },
    { title: 'Site 2', value: 'site-2' },
    { title: 'Site 3', value: 'site-3' }
  ];
  targetStatuses = [
    { title: 'Target Status 1', value: 'target-status-1' },
    { title: 'Target Status 2', value: 'target-status-2' },
    { title: 'Target Status 3', value: 'target-status-3' }
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
  documentTypes = [
    { title: 'Document Type 1', value: 'document-type-1' },
    { title: 'Document Type 2', value: 'document-type-2' },
    { title: 'Document Type 3', value: 'document-type-3' }
  ];

  // table setting
  displayedColumns: string[] = [
    'runningNo',
    'revisionNo',
    'issuedDate',
    'year',
    'detail'
  ];

  keyToColumnName: any = {
    'runningNo': 'Running No.',
    'revisionNo': 'Revision No.',
    'issuedDate': 'Issued Date',
    'year': 'Year'
  };

  constructor(private _targetService: TargetService) {
    this.runningNoRecords = this._targetService.getRunningNoRecords();
    this.dataSource = new MatTableDataSource(this.runningNoRecords);

    // default
    this.selectedSite = 'site-1';
    this.selectedTargetStatus = 'target-status-1';
    this.selectedDivision = 'division-1';
    this.selectedDepartment = 'department-1';
    this.selectedDocumentType = 'document-type-1';
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
        && (!searchString.selectedDivision || data.data.division.indexOf(searchString.selectedDivision) !== -1)
        && (!searchString.runningNo || data.data.runningNo.indexOf(searchString.runningNo) !== -1)
        && (!searchString.selectedDepartment || data.data.department.indexOf(searchString.selectedDepartment) !== -1)
        && (!searchString.year || data.data.year.indexOf(searchString.year) !== -1)
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      selectedSite: this.selectedSite,
      selectedDivision: this.selectedDivision,
      runningNo: this.runningNo,
      selectedDepartment: this.selectedDepartment,
      year: this.year
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.selectedSite = undefined;
    this.selectedDivision = undefined;
    this.runningNo = undefined;
    this.selectedDepartment = undefined;
    this.year = undefined;
  }
}

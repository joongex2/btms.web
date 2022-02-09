import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TargetTableComponent } from '../../tables/target-table/target-table.component';
import { RunningNo, TargetRecord } from '../../target.types';

@Component({
  selector: 'target-management',
  templateUrl: './target-management.component.html',
  styleUrls: ['./target-management.component.scss']
})
export class TargetManagementComponent implements OnInit {
  @Input() targets: TargetRecord[];
  @Input() runningNo: RunningNo;
  @ViewChild('targetTable') targetTable: TargetTableComponent;

  // bind value
  selectedTargetType: string;
  selectedYear: string;

  // select option
  targetTypes = [
    { title: 'Target Type 1', value: 'target-type-1' },
    { title: 'Target Type 2', value: 'target-type-2' },
    { title: 'Target Type 3', value: 'target-type-3' }
  ];
  years = [
    { title: '2019', value: '2019' },
    { title: '2020', value: '2020' },
    { title: '2021', value: '2021' }
  ];

  constructor() { }

  ngOnInit(): void {
    // default value
    this.selectedTargetType = 'target-type-1';
    this.selectedYear = '2021';
  }
}

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { genMockSubTargetRecord } from '../mock-table-data';
import { TargetTableComponent } from '../target-table/target-table.component';
import { SubTargetRecord } from './../../target.types';

@Component({
  selector: 'app-sub-target-table',
  templateUrl: './sub-target-table.component.html',
  styleUrls: ['./sub-target-table.component.scss']
})
export class SubTargetTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetId: string;
  @Input() subTargets: SubTargetRecord[];
  @Output() refreshTable: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('subTargetTable') subTargetTable: TargetTableComponent;

  displayedColumns: string[] = [
    'expandIcon',
    'subTargetId',
    'subTargetName',
    'index',
    'value',
    'unit',
    'currentValue',
    'startMonth',
    'startYear',
    'finishMonth',
    'finishYear',
    'editIcon',
    'deleteIcon'
  ];

  constructor() { }

  ngOnInit(): void { }

  refreshMainTable(): void {
    this.refreshTable.next(1);
  }

  addSubTarget(): void {
    const mockSubTarget = genMockSubTargetRecord();
    this.subTargets.push(mockSubTarget);
    this.subTargetTable.table.renderRows();
  }

  editSubTarget(index: number): void {
    this.subTargets[index].data.startMonth = 'sfaarandom';
    this.subTargetTable.table.renderRows();
  }

  deleteSubTarget(index: number): void {
    this.subTargets.splice(index, 1);
    this.subTargetTable.table.renderRows();
  }

}

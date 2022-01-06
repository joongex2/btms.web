import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubTarget } from './../../target.types';

@Component({
  selector: 'app-sub-target-table',
  templateUrl: './sub-target-table.component.html',
  styleUrls: ['./sub-target-table.component.scss']
})
export class SubTargetTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetId: string;
  @Input() subTargets: SubTarget[];

  @Output() refreshTable: EventEmitter<number> = new EventEmitter<number>();

  displayedColumns: string[] = [
    'expandIcon', 
    'Sub Target ID',
    'Sub Target Name',
    'Index',
    'Value',
    'Unit',
    'Current Value',
    'Start Month',
    'Start Year',
    'Finish Month',
    'Finish Year',
    'deleteIcon'
  ];

  constructor() { }

  ngOnInit(): void {
  }

  refreshMainTable(): void {
    this.refreshTable.next(1);
  }

}

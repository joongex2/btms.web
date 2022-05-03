import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Condition, Plan, Topic } from 'app/shared/interfaces/document.interface';
import { MainMethod, MainMethodRecord } from '../../../target.types';
import { genMockMainMethodRecord } from '../mock-table-data';

@Component({
  selector: 'app-main-method-table',
  templateUrl: './main-method-table.component.html',
  styleUrls: ['./main-method-table.component.scss']
})
export class MainMethodTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetId: number;
  @Input() subTargetId: number;
  @Input() mainMethods: MainMethodRecord[];
  @Input() topics: Topic[];
  @Input() plans: Plan[];
  @Input() targetValue: string;
  @Input() isEdit: boolean;
  @Output() markForEdit: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('mainMethodTable') mainMethodTable: MatTable<MainMethod>;

  displayedColumns: string[] = [
    // 'mainMethodId',
    'mainMethodDetail',
    // 'deleteIcon'
  ];

  constructor() { }

  ngOnInit(): void { }

  addMainMethod(): void {
    const mockMainMethod = genMockMainMethodRecord();
    // this.mainMethods.push(mockMainMethod);
    this.mainMethodTable.renderRows();
  }

  deleteMainMethod(index: number): void {
    // this.mainMethods.splice(index, 1);
    this.mainMethodTable.renderRows();
  }

  markForEditHandler(subTargetId: number) {
    this.markForEdit.emit(subTargetId);
  }
}

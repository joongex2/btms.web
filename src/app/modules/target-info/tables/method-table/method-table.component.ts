import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { genMockMethodRecord } from '../mock-table-data';
import { TargetTableComponent } from '../target-table/target-table.component';
import { MethodRecord } from './../../target.types';

@Component({
  selector: 'app-method-table',
  templateUrl: './method-table.component.html',
  styleUrls: ['./method-table.component.scss']
})
export class MethodTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetId: string;
  @Input() methods: MethodRecord[];
  @ViewChild('methodTable') methodTable: TargetTableComponent;

  displayedColumns: string[] = [
    'methodId',
    'methodName',
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
    'owner',
    'editIcon',
    'deleteIcon'
  ];

  constructor() { }

  ngOnInit(): void { }

  addMethod(): void {
    const mockMethod = genMockMethodRecord();
    this.methods.push(mockMethod);
    this.methodTable.table.renderRows();
  }

  editMethod(index: number): void {
    this.methods[index].data.jan = 'randfkaljds';
    this.methodTable.table.renderRows();
  }

  deleteMethod(index: number): void {
    this.methods.splice(index, 1);
    this.methodTable.table.renderRows();
  }

}

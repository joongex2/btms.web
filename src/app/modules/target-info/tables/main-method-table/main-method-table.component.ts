import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MainMethod, MainMethodRecord } from '../../target.types';
import { genMockMainMethodRecord } from '../mock-table-data';

@Component({
  selector: 'app-main-method-table',
  templateUrl: './main-method-table.component.html',
  styleUrls: ['./main-method-table.component.scss']
})
export class MainMethodTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetIndex: string;
  @Input() subTargetIndex: string;
  @Input() mainMethods: MainMethodRecord[];
  @ViewChild('mainMethodTable') mainMethodTable: MatTable<MainMethod>;

  displayedColumns: string[] = [
    'mainMethodId',
    'mainMethodDetail',
    'deleteIcon'
  ];

  constructor() { }

  ngOnInit(): void { }

  addMainMethod(): void {
    const mockMainMethod = genMockMainMethodRecord();
    this.mainMethods.push(mockMainMethod);
    this.mainMethodTable.renderRows();
  }

  deleteMainMethod(index: number): void {
    this.mainMethods.splice(index, 1);
    this.mainMethodTable.renderRows();
  }
}

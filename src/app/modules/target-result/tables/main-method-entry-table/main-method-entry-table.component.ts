import { Component, Input, OnInit } from '@angular/core';
import { MainMethodRecord } from 'app/modules/target-info/target.types';

@Component({
  selector: 'app-main-method-entry-table',
  templateUrl: './main-method-entry-table.component.html',
  styleUrls: ['./main-method-entry-table.component.scss']
})
export class MainMethodEntryTableComponent implements OnInit {
  @Input() mainMethods: MainMethodRecord[];
  @Input() runningNo: string;
  @Input() targetIndex: number;
  @Input() subTargetIndex: number;

  mainMethodRow = ['methodDetail'];

  constructor() { }

  ngOnInit(): void {
  }

}

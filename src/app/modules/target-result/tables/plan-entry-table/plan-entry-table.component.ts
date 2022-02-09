import { Component, Input, OnInit } from '@angular/core';
import { PlanRecord } from 'app/modules/target-info/target.types';

@Component({
  selector: 'app-plan-entry-table',
  templateUrl: './plan-entry-table.component.html',
  styleUrls: ['./plan-entry-table.component.scss']
})
export class PlanEntryTableComponent implements OnInit {
  @Input() plans: PlanRecord[];
  @Input() runningNo: string;
  @Input() targetIndex: string;
  @Input() subTargetIndex: string;
  @Input() mainMethodIndex: string;

  planHeader = ['planNo', 'planName', 'planActual', 'planResource', 'planOwner'];
  planRow = ['planNo', 'planName', 'planActual', 'planResource', 'planOwner'];

  constructor() { }

  ngOnInit(): void {
  }

}

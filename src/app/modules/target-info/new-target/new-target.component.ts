import { Component, Input, OnInit } from '@angular/core';
import { RunningNoData, Target } from '../target.types';

@Component({
  selector: 'new-target',
  templateUrl: './new-target.component.html',
})
export class NewTargetComponent implements OnInit {
  targets: Target[];
  displayedColumns: string[] = [
    'expandIcon',
    'Target ID',
    'Name',
    'Standard',
    'Relative Target',
    'deleteIcon'
  ];  

  @Input()
  runningNo: string;
  @Input()
  runningNoData: RunningNoData;

  constructor() { }

  ngOnInit(): void {
  }

  deleteTarget(index: number) {
    console.log('delete target');
  }
}

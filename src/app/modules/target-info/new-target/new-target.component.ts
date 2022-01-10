import { Component, Input, OnInit } from '@angular/core';
import { RunningNo, TargetRecord } from '../target.types';

@Component({
  selector: 'new-target',
  templateUrl: './new-target.component.html',
})
export class NewTargetComponent implements OnInit {
  @Input() runningNo: string;
  @Input() runningNoData: RunningNo;

  targets: TargetRecord[];

  constructor() { }

  ngOnInit(): void {
  }

  deleteTarget(index: number) {
  }
}

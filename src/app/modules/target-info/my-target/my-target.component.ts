import { Component, OnInit } from '@angular/core';
import { TargetService } from '../target.service';
import { RunningNo } from '../target.types';

@Component({
  selector: 'my-target',
  templateUrl: './my-target.component.html',
  styleUrls: ['./my-target.component.scss'],
})
export class MyTargetComponent implements OnInit {
  displayedColumns: string[] = [
    'Running No.',
    'Revision No.',
    'Modify No.',
    'Create Date',
    'Issued Date',
    'Year',
    'Status',
    'Creator',
    'Detail'
  ];

  runningNos: RunningNo[];


  constructor(private _targetService: TargetService) {
    this.runningNos = this._targetService.getRunningNos();
    console.log('hello');
  }

  ngOnInit(): void {
    console.log('hello');
  }

}

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { TargetService } from 'app/modules/target-info/target.service';
import { RunningNo, SubTarget, Target, TargetRecord } from 'app/modules/target-info/target.types';

@Component({
  selector: 'app-target-entry',
  templateUrl: './target-entry.component.html',
  styleUrls: ['./target-entry.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TargetEntryComponent implements OnInit {
  runningNo: RunningNo;
  targets: TargetRecord[];

  dataColumns = [
    'detail',
    'owner',
    'blank-2',
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
  ];
  dataColumns2 = ['detail', 'owner'];
  dataColumns3 = ['detail', 'left'];
  dataColumns4 = [
    'blank-22',
    'jan2',
    'feb2',
    'mar2',
    'apr2',
    'may2',
    'jun2',
    'jul2',
    'aug2',
    'sep2',
    'oct2',
    'nov2',
    'dec2',
  ];

  dataSource: TargetRecord[];
  expandedElement: Target | null;
  expandedElement2: SubTarget | null;

  constructor(private _targetService: TargetService) { }

  ngOnInit(): void {
    const demoRunningCode = 'OBJ-ENPC-64-02'; // TODO: change later
    this.runningNo = this._targetService.getRunningNo(demoRunningCode);
    this.targets = this._targetService.getTargets(demoRunningCode);
    this.dataSource = this.targets;
  }

}

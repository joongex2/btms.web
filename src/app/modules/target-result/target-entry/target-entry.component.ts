import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TargetService } from 'app/modules/target-info/target.service';
import { RunningNo, SubTarget, Target, TargetRecord } from 'app/modules/target-info/target.types';
import { LastCommentModalComponent } from '../modal/last-comment-modal/last-comment-modal.component';
import { TargetEntryModalComponent } from '../modal/target-entry-modal/target-entry-modal.component';

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
  dataColumns2 = ['detail'];
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
  expandedTargets: Target[] = [];
  expandedSubtargets: SubTarget[] = [];

  constructor(
    private _targetService: TargetService,
    private _matDialog: MatDialog  
  ) { }

  ngOnInit(): void {
    const demoRunningCode = 'OBJ-ENPC-64-02'; // TODO: change later
    this.runningNo = this._targetService.getRunningNo(demoRunningCode);
    this.targets = this._targetService.getTargets(demoRunningCode);
    this.dataSource = this.targets;
  }

  checkExpanded(element, expandedElements): boolean {
    let flag = false;
    expandedElements.forEach(e => {
      if (e === element) {
        flag = true;
      }
    });
    return flag;
  }

  pushPopElement(element, expandedElements) {
    const index = expandedElements.indexOf(element);
    if (index === -1) {
      expandedElements.push(element);
    } else {
      expandedElements.splice(index, 1);
    }
  }

  openLastComment() {
    const dialogRef = this._matDialog.open(LastCommentModalComponent);
    dialogRef.afterClosed()
      .subscribe((result: any) => {

      });
  }

  openTargetEntryModal(i, j, k, month) {
    const dialogRef = this._matDialog.open(TargetEntryModalComponent, {
      data: {
        targets: this.targets,
        targetIndex: i,
        subTargetIndex: j,
        planIndex: k,
        month
      }
    });
    dialogRef.afterClosed()
      .subscribe((result: any) => {

      });
  }

}

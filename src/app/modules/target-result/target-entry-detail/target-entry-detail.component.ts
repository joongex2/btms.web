import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TargetService } from 'app/modules/target-info/target.service';
import { RunningNo, SubTargetRecord, TargetRecord } from 'app/modules/target-info/target.types';
import { LastCommentModalComponent } from '../modal/last-comment-modal/last-comment-modal.component';
import { TargetEntryDetailModalComponent } from '../modal/target-entry-detail-modal/target-entry-detail-modal.component';

@Component({
  selector: 'app-target-entry-detail',
  templateUrl: './target-entry-detail.component.html',
  styleUrls: ['./target-entry-detail.component.scss'],
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
export class TargetEntryDetailComponent implements OnInit {
  runningNo: RunningNo;
  targets: TargetRecord[];

  targetHeader1 = ['targetDetailSpanned', 'ownerSpanned', 'blankSpanned', 'year'];
  targetHeader2 = ['blank', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  targetRow1 = ['targetDetail'];
  targetRow2 = ['expandedDetail'];
  subTargetRow1 = ['subTargetDetail'];
  subTargetRow2 = ['expandedDetail'];
  planRow1 = ['planDetail', 'owner', 'blank', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  planRow2 = ['blank2', 'jan2', 'feb2', 'mar2', 'apr2', 'may2', 'jun2', 'jul2', 'aug2', 'sep2', 'oct2', 'nov2', 'dec2'];

  dataSource: TargetRecord[];
  expandedTargets: TargetRecord[] = [];
  expandedSubtargets: SubTargetRecord[] = [];

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

  expandAll() {
    for (let target of this.targets) {
      this.expandedTargets.push(target);
      for (let subTarget of target.kids.records) {
        this.expandedSubtargets.push(subTarget);
      }
    }
  }

  collapseAll() {
    this.expandedTargets = [];
    this.expandedSubtargets = [];
  }

  openLastComment() {
    const dialogRef = this._matDialog.open(LastCommentModalComponent);
    dialogRef.afterClosed()
      .subscribe((result: any) => {

      });
  }

  openTargetEntryModal(i, j, k, month) {
    const dialogRef = this._matDialog.open(TargetEntryDetailModalComponent, {
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

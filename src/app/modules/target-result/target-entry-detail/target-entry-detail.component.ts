import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from 'app/modules/target-info/target.service';
import { RunningNo, SubTargetRecord, TargetRecord } from 'app/modules/target-info/target.types';
import { LastCommentModalComponent } from '../modals/last-comment-modal/last-comment-modal.component';

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
  runningNoParam: string;
  runningNo: RunningNo;
  targets: TargetRecord[];

  targetHeader1 = ['targetDetailSpanned', 'ownerSpanned', 'year', 'blankSpanned', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  targetHeader2 = ['blank'];
  targetRow1 = ['targetDetail'];
  targetRow2 = ['expandedDetail'];
  subTargetRow1 = ['subTargetDetail'];
  subTargetRow2 = ['expandedDetail'];
  mainMethodRow = ['methodDetail'];

  dataSource: TargetRecord[];
  expandedTargets: TargetRecord[] = [];
  expandedSubtargets: SubTargetRecord[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _targetService: TargetService,
    private _matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) { }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges(); // temp fix ExpressionChangedAfterItHasBeenCheckedError
  }

  ngOnInit(): void {
    // const demoRunningCode = 'OBJ-ENPC-64-02'; // TODO: change later
    this.route.paramMap.subscribe(params => {
      this.runningNoParam = params.get('runningNo');
      this.runningNo = this._targetService.getRunningNo(this.runningNoParam);
      if (!this.runningNo) {
        this.router.navigate(['404-not-found']);
        return;
      }
      this.targets = this._targetService.getTargets(this.runningNoParam);
    });
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
}

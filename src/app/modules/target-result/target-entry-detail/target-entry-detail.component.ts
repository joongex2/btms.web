import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from 'app/modules/target-info/target.service';
import { RunningNo, TargetRecord } from 'app/modules/target-info/target.types';
import { LastCommentModalComponent } from '../../../shared/components/last-comment-modal/last-comment-modal.component';
import { TargetEntryTableComponent } from '../tables/target-entry-table/target-entry-table.component';

@Component({
  selector: 'app-target-entry-detail',
  templateUrl: './target-entry-detail.component.html',
  styleUrls: ['./target-entry-detail.component.scss']
})
export class TargetEntryDetailComponent implements OnInit {
  runningNoParam: string;
  runningNo: RunningNo;
  targets: TargetRecord[];

  @ViewChild(TargetEntryTableComponent) targetEntryTableComponent: TargetEntryTableComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _targetService: TargetService,
    private _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.runningNoParam = params.get('runningNo');
      this.runningNo = this._targetService.getRunningNo(this.runningNoParam);
      if (!this.runningNo) {
        this.router.navigate(['404-not-found']);
        return;
      }
      this.targets = this._targetService.getTargets(this.runningNoParam);
    });
  }

  openLastComment() {
    const dialogRef = this._matDialog.open(LastCommentModalComponent);
    dialogRef.afterClosed()
      .subscribe((result: any) => {

      });
  }

  expandAll() {
    this.targetEntryTableComponent.expandAll();
  }

  collapseAll() {
    this.targetEntryTableComponent.collapseAll();
  }
}

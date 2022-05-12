import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DocumentDetail, Target } from 'app/shared/interfaces/document.interface';
import { DocumentService } from 'app/shared/services/document.service';
import { LastCommentModalComponent } from '../../../shared/components/last-comment-modal/last-comment-modal.component';
import { TargetResultService } from '../target-result.service';
import { TargetEntryTableComponent } from './tables/target-entry-table/target-entry-table.component';


@Component({
  selector: 'app-target-entry-detail',
  templateUrl: './target-entry-detail.component.html',
  styleUrls: ['./target-entry-detail.component.scss']
})
export class TargetEntryDetailComponent implements OnInit {
  runningNoParam: string;
  targets: Target[];
  runningNo: string;
  document: Partial<DocumentDetail>;
  documentId: number;
  readonly = false;

  @ViewChild(TargetEntryTableComponent) targetEntryTableComponent: TargetEntryTableComponent;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _documentService: DocumentService,
    private _targetResultService: TargetResultService
  ) {
    this.readonly = _activatedRoute.snapshot.data['readonly'] ? true : false;
  }

  ngOnInit(): void {
    const id = parseInt(this._activatedRoute.snapshot.paramMap.get('id'));
    this.loadDocument(id);
  }

  openLastComment() {
    const dialogRef = this._matDialog.open(LastCommentModalComponent, {
      data: {
        comments: this.document.comments
      }
    });
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

  loadDocument(id: number) {
    this._documentService.getDocument(id).subscribe({
      next: (documentDetail: DocumentDetail) => {
        this.document = documentDetail;
        this.runningNo = this.document.documentNo;
        this.documentId = this.document.id;
        this.targets = this.document.targets;
        this.checkPlanVisited();
      },
      error: (e) => console.error(e)
    });
  }

  checkPlanVisited() {
    const planStatuses = this._targetResultService.PlanStatuses;
    if (!planStatuses) return;
    for (let status of planStatuses) {
      if (status.documentId !== this.document.id) continue;
      const target = this.document.targets.find(v => v.id === status.targetId);
      if (!target) continue;
      const subTarget = target.details.find(v => v.id === status.subTargetId);
      if (!subTarget) continue;
      const plan = subTarget.plans.find(v => v.id === status.planId);
      if (!plan) continue;
      plan[`flowMonth${status.month}`] = status.flow;
    }
  }
}

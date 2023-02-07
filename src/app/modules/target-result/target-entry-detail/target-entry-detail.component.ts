import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { DocumentDetail, Target } from 'app/shared/interfaces/document.interface';
import { DocumentService } from 'app/shared/services/document.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { skip, Subscription } from 'rxjs';
import { LastCommentModalComponent } from '../../../shared/components/last-comment-modal/last-comment-modal.component';
import { TargetResultService } from '../target-result.service';
import { PlanEntryTableComponent } from './tables/plan-entry-table/plan-entry-table.component';
import { TargetEntryTableComponent } from './tables/target-entry-table/target-entry-table.component';

@Component({
  selector: 'app-target-entry-detail',
  templateUrl: './target-entry-detail.component.html',
  styleUrls: ['./target-entry-detail.component.scss']
})
export class TargetEntryDetailComponent implements OnInit {
  user: User;
  runningNoParam: string;
  targets: Target[];
  runningNo: string;
  document: Partial<DocumentDetail>;
  documentId: number;
  readonly = false;
  
  canConfirm: boolean = true;
  canSubmit: boolean = false;
  canReject: boolean = false;

  planEntryTables: PlanEntryTableComponent[];
  @ViewChild(TargetEntryTableComponent) targetEntryTableComponent: TargetEntryTableComponent;

  planMonthToggleChangeSub: Subscription;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _matDialog: MatDialog,
    private _documentService: DocumentService,
    private _targetResultService: TargetResultService,
    private _snackBarService: SnackBarService
  ) {
    this.readonly = _activatedRoute.snapshot.data['readonly'] ? true : false;
  }

  ngOnInit(): void {
    this.user = this._activatedRoute.snapshot.data.user;
    const id = parseInt(this._activatedRoute.snapshot.paramMap.get('id'));
    this.loadDocument(id);

    this.planMonthToggleChangeSub = this._targetResultService.planMonthToggleChange$.pipe(skip(1)).subscribe(v => {
      // this.checkPrivillege();
    });
  }

  ngOnDestroy() {
    this.planMonthToggleChangeSub.unsubscribe();
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
    this._documentService.getTargetDocument(id).subscribe({
      next: (documentDetail: DocumentDetail) => {
        this.document = documentDetail;
        this.runningNo = this.document.documentNo;
        this.documentId = this.document.id;
        this.targets = this.document.targets;
        this.checkPlanStatus();

        let planEntryTables: PlanEntryTableComponent[] = [];
        setTimeout(() => {
          for (let subTarget of this.targetEntryTableComponent.subTargetEntryTables) {
            for (let plan of subTarget.planEntryTables) {
              planEntryTables.push(plan);
            }
          }
          this.planEntryTables = planEntryTables;
        });

        setTimeout(() => this.expandAll());
      },
      error: (e) => console.error(e)
    });
  }

  checkPlanStatus() {
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

  checkPrivillege() {
    // check
    this.canSubmit = false;
    this.canReject = false;
    if (this.checkAtleastOneAndSameStatus()) {
      this.canSubmit = true;
    }
    if (this.checkAtleastOneAndSameStatus() && this.checkAllCanReject()) {
      this.canReject = true;
    }
  }

  checkAtleastOne(): boolean {
    let checkNum = 0;

    for (let planTable of this.planEntryTables) {
      checkNum += planTable.selection.selected.length;
    }
    return checkNum > 0;
  }


  checkAtleastOneAndSameStatus(): boolean {
    let checkNum = 0;
    let latestAllSameStatus = true;
    let latestStatus = '';
    for (let planTable of this.planEntryTables) {
      checkNum += planTable.selection.selected.length;
      const { allSameStatus , status } = planTable.checkAllSameStatus();
      latestAllSameStatus = latestAllSameStatus && allSameStatus;
      if (latestStatus === '' && latestStatus !== status) {
        latestStatus = status;
      } else {
        return false;
      }
    }
    return checkNum > 0 && latestAllSameStatus;
  }

  checkAllCanReject(): boolean {
    let allCanReject = true;
    for (let planTable of this.planEntryTables) {
      allCanReject = allCanReject && planTable.checkAllCanReject();
    }
    return allCanReject;
  }

  checkAtleastOneAndAllAcceptAndSameStatus(): boolean {
    let checkNum = 0;
    let allAcceptAndSameStatus = true;
    for (let planTable of this.planEntryTables) {
      checkNum += planTable.selection.selected.length;
      allAcceptAndSameStatus = allAcceptAndSameStatus && planTable.checkAllAcceptAndSameStatus();
    }
    return checkNum > 0 && allAcceptAndSameStatus;
  }

  checkAtleaseOneAndAllRejectAndSameStatus(): boolean {
    let checkNum = 0;
    let allRejectAndSameStatus = true;
    for (let planTable of this.planEntryTables) {
      checkNum += planTable.selection.selected.length;
      allRejectAndSameStatus = allRejectAndSameStatus && planTable.checkAllRejectAndSameStatus();
    }
    return checkNum > 0 && allRejectAndSameStatus;
  }

  getActualIds(): number[] {
    const actualTargetIds = [];
    for (let planTable of this.planEntryTables) {
      actualTargetIds.push(planTable.selection.selected.map(v => v.plan.actuals.find(a => a.targetMonth === v.month).id))
    }
    return actualTargetIds;
  }

  confirm() {
    if (!this.checkAtleastOne()) {
      this._snackBarService.error('กรุณาเลือกผลการดำเนินงานอย่างน้อยหนึ่งรายการ');
      return;
    }
    if (!this.checkAtleastOneAndSameStatus()) {
      this._snackBarService.error('กรุณาเลือกสถานะของผลดำเนินการให้เหมือนกัน');
      return;
    }
    for (let planTable of this.planEntryTables) {
      planTable.filter();
    }
    for (let subTarget of this.targetEntryTableComponent.subTargetEntryTables) {
      const hideSubTargetIds = [];
      for (let plan of subTarget.planEntryTables) {
        const atleastOneSelected = plan.filter();
        if (!atleastOneSelected) {
          hideSubTargetIds.push(plan.subTargetId);
          subTarget.hideSubTargetIds.push(plan.subTargetId);
        }
      }
      if (hideSubTargetIds.length === this.targets.find(v => v.id === subTarget.targetId).details.length) {
        this.targetEntryTableComponent.hideTargetIds.push(subTarget.targetId);
      }
    }

    this.addQueryParam({ filter: true });
    this.checkPrivillege();
    this.canConfirm = false;
  }

  submit() {
    let actualTargetIds = this.getActualIds();
    this._router.navigate(['./multi/confirm-submit'], { relativeTo: this._activatedRoute, queryParams: { actualTargetIds } });
  }

  reject() {
    let actualTargetIds = this.getActualIds();
    this._router.navigate(['./multi/confirm-reject'], { relativeTo: this._activatedRoute, queryParams: { actualTargetIds } });
  }

  private addQueryParam(param?: object): void {
    this._router.navigate(['./'], {
      relativeTo: this._activatedRoute,
      queryParams: param,
      queryParamsHandling: 'merge'
    })
  }

  back() {
    if (this._activatedRoute.snapshot.queryParams.filter) {
      this.addQueryParam({ filter: undefined });
      for (let planTable of this.planEntryTables) {
        planTable.cancelFilter();
      }
      // clear hide of subtargets, targets
      for (let subTarget of this.targetEntryTableComponent.subTargetEntryTables) {
        subTarget.hideSubTargetIds = [];
      }
      this.targetEntryTableComponent.hideTargetIds = [];
      this.canConfirm = true;
      this.canSubmit = false;
      this.canReject = false;
    } else {
      this._router.navigate(['./..'], { relativeTo: this._activatedRoute });
    }
  }
}

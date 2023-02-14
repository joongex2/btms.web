import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { User } from 'app/core/user/user.types';
import { FileUploadTableComponent } from 'app/shared/components/file-upload-table/file-upload-table.component';
import { LastCommentModalComponent } from 'app/shared/components/last-comment-modal/last-comment-modal.component';
import { Actual, DocumentDetail, Plan, SubTarget, Target } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { DocumentService } from 'app/shared/services/document.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { UrlService } from 'app/shared/services/url.service';
import { firstValueFrom } from 'rxjs';
import { PlanFlow } from '../target-result.interface';
import { TargetResultService } from '../target-result.service';
import { Attachment } from '../target-result.types';

@Component({
  selector: 'target-save',
  templateUrl: './target-save.component.html',
  styleUrls: ['./target-save.component.scss'],
  animations: fuseAnimations
})
export class TargetSaveComponent implements OnInit {
  @ViewChild('f') form: NgForm;
  @ViewChild(FileUploadTableComponent) fileUploadTable: FileUploadTableComponent;
  user: User;
  mode: string;
  readonly = false;
  previousUrl: string;

  //bind value
  targetResult: number | string;
  naCheckBox: boolean = false;
  attachments: Attachment[];

  document: Partial<DocumentDetail>;
  target: Target;
  subTarget: SubTarget;
  plan: Plan;
  month: number;
  actual: Actual;

  isEdit: boolean = false; // true when press edit button
  // check privillege
  canSave: boolean = false;
  canEdit: boolean = false;
  canSubmit: boolean = false;
  canReject: boolean = false;

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    private _targetResultService: TargetResultService,
    private _documentService: DocumentService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _urlService: UrlService,
    private _location: Location,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService
  ) {
    this.readonly = _activatedRoute.snapshot.data['readonly'] ? true : false;
    const documentId = parseInt(this._activatedRoute.snapshot.params.id);
    const planId = parseInt(this._activatedRoute.snapshot.params.planId);
    const month = parseInt(this._activatedRoute.snapshot.params.month);
    this.setData(documentId, planId, month);
  }

  ngOnInit(): void {
    this.user = this._activatedRoute.snapshot.data.user;
    this.mode = this._activatedRoute.snapshot.data['mode'];
    this.checkPrivillege();

    this._urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
    });
  }

  setData(documentId: number, planId: number, month: number) {
    this._documentService.getDocument(documentId).subscribe({
      next: (documentDetail: DocumentDetail) => {
        this.document = documentDetail;
        for (let target of this.document.targets) {
          for (let subTarget of target.details) {
            for (let plan of subTarget.plans) {
              if (plan.id === planId) {
                this.target = target;
                this.subTarget = subTarget;
                this.plan = plan;
              }
            }
          }
        }
        const currentPlanFlow: PlanFlow = this.getPlanStatus().planStatus?.flow;
        if (![PlanFlow.ACCEPT, PlanFlow.REJECT].includes(currentPlanFlow)) this.setPlanFlow(PlanFlow.VISITED);
        this.mode = this._activatedRoute.snapshot.data.actual ? 'edit' : 'add';
        if (this.mode === 'edit') {
          this.actual = this._activatedRoute.snapshot.data.actual;
          this.targetResult = this.subTarget.measureType === '1' ? this.actual.targetActualValue : this.actual.targetActualResult;
          this.naCheckBox = this.subTarget.measureType === '1' && this.actual.targetActualResult === 'N';
          this.attachments = JSON.parse(JSON.stringify(this.actual.attachments));
        } else {
          this.attachments = [];
        }
        this.checkPrivillege();
      },
      error: (e) => console.error(e)
    });

    this.month = month;
  }

  getPlanStatus(): any {
    let planStatuses = this._targetResultService.PlanStatuses;
    planStatuses = planStatuses ? planStatuses : [];
    const planStatus = planStatuses.find(v =>
      v.documentId === this.document.id &&
      v.targetId === this.target.id &&
      v.subTargetId === this.subTarget.id &&
      v.planId === this.plan.id &&
      v.month === this.month
    );
    return { planStatus, planStatuses };
  }

  setPlanFlow(planFlow: PlanFlow) {
    const { planStatus, planStatuses } = this.getPlanStatus();
    if (planStatus) {
      planStatus.flow = planFlow;
    } else {
      planStatuses.push({
        documentId: this.document.id,
        targetId: this.target.id,
        subTargetId: this.subTarget.id,
        planId: this.plan.id,
        month: this.month,
        flow: planFlow
      });
    }
    this._targetResultService.PlanStatuses = planStatuses;
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

  checkPrivillege() {
    if (this.user && this.user.organizes && this.document) {
      let haveT01 = false;
      let haveT02 = false;
      let haveT03 = false;
      let haveT04 = false;
      const organize = this.user.organizes.find((v) => v.organizeCode === this.document.organizeCode);
      for (let role of organize.roles) {
        if (role.roleCode === 'T01') haveT01 = true;
        if (role.roleCode === 'T02') haveT02 = true;
        if (role.roleCode === 'T03') haveT03 = true;
        if (role.roleCode === 'T04') haveT04 = true;
      }
      this.canSave = false;
      this.canEdit = false;
      this.canSubmit = false;
      this.canReject = false;

      if (this.mode === 'add') {
        // add
        this.canSave = haveT01;
        this.canEdit = false;
        this.canSubmit = false;
        this.canReject = false;
      } else {
        // edit
        if (this.isEdit && haveT01) this.canSave = true;
        if (!this.isEdit && this.actual.targetActualStatus === 'TARGET_REPORTING' && haveT01) this.canEdit = true;
        if (!this.isEdit && this.actual.targetActualStatus === 'TARGET_WAIT_FOR_VERIFY' && haveT02) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.actual.targetActualStatus === 'TARGET_WAIT_FOR_APPROVE' && haveT03) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.actual.targetActualStatus === 'TARGET_WAIT_FOR_RELEASE' && haveT04) {
          this.canSubmit = true;
          this.canReject = true;
        }
      }
    } else {
      this.canSave = false;
      this.canEdit = false;
      this.canSubmit = false;
      this.canReject = false;
    }
  }

  goBack() {
    if (!this.previousUrl
      || this.previousUrl.includes('redirectURL')
      || this.previousUrl.includes('/confirm-submit')
      || this.previousUrl.includes('/confirm-reject')
    ) {
      // if from refresh/ redirect or other page -> check from current url
      this._router.navigate(['./../../../..'], { relativeTo: this._activatedRoute })
    } else {
      this._location.back();
    }
  }

  save() {
    if (!this.form.valid) {
      this.form.form.markAllAsTouched();
      document.getElementById('resultForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      this._confirmationService.save().afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            let res = await firstValueFrom(this._targetResultService.postActual(
              this.plan.id,
              this.plan.planYear,
              this.month,
              this.subTarget.measureType === '1' && !this.naCheckBox ? this.targetResult as number : null,
              this.calculateTargetActualResult(),
              null,
              this.attachments
            ));
            this.actual = await firstValueFrom(this._targetResultService.getActual(this.plan.id, this.month));
            this.attachments = JSON.parse(JSON.stringify(this.actual.attachments));
            if (this.mode === 'add') {
              this.mode = 'edit';
            }
            if (!res.didError) {
              this._snackBarService.success(res.message);
              this.isEdit = false;
              this.checkPrivillege();
            } else {
              this._snackBarService.error();
              this.showError(res.errorMessage, true);
              return;
            }
          } catch (e) {
            console.log(e);
            this._snackBarService.error();
            this.showError(e.error, true);
            return;
          }
          this.hideError();
        }
      });
    }
  }

  edit() {
    this.isEdit = true;
    this.checkPrivillege();
  }

  async cancelEdit() {
    // bring back data
    this.targetResult = this.subTarget.measureType === '1' ? this.actual.targetActualValue : this.actual.targetActualResult;
    this.naCheckBox = this.subTarget.measureType === '1' && this.actual.targetActualResult === 'N';
    await this.fileUploadTable.deleteUnsavedAttachments();
    this.attachments = JSON.parse(JSON.stringify(this.actual.attachments));

    this.isEdit = false;
    this.checkPrivillege();
  }

  submit() {
    this.setPlanFlow(PlanFlow.ACCEPT);
    this._router.navigate(['./../../../..'], { relativeTo: this._activatedRoute });
  }

  reject() {
    this.setPlanFlow(PlanFlow.REJECT);
    this._router.navigate(['./../../../..'], { relativeTo: this._activatedRoute });
  }

  calculateTargetActualResult(): string {
    if (this.subTarget.measureType === '1') {
      // quantity
      if (this.naCheckBox) return 'N';
      if (this.subTarget.targetCondition === '1') {
        // single
        const targetOperator = this.subTarget.conditions[0].targetOperator;
        const targetValue = this.plan[`valueMonth${this.month}`];
        const targetResultNum = this.targetResult;
        if (targetOperator === '>') {
          if (targetResultNum > targetValue) {
            return 'A';
          } else {
            return 'U';
          }
        } else if (targetOperator === '<') {
          if (targetResultNum < targetValue) {
            return 'A';
          } else {
            return 'U';
          }
        } else if (targetOperator === '=') {
          if (targetResultNum === targetValue) {
            return 'A';
          } else {
            return 'U';
          }
        } else if (targetOperator === '>=') {
          if (targetResultNum >= targetValue) {
            return 'A';
          } else {
            return 'U';
          }
        } else if (targetOperator === '<=') {
          if (targetResultNum <= targetValue) {
            return 'A';
          } else {
            return 'U';
          }
        }
      } else {
        // range
        for (let condition of this.subTarget.conditions) {
          const targetOperator = condition.targetOperator;
          const targetValue = condition.targetValue;
          const targetResultNum = this.targetResult;
          if (targetOperator === '>' && targetResultNum > targetValue) {
            return 'U';
          } else if (targetOperator === '<' && targetResultNum < targetValue) {
            return 'U';
          } else if (targetOperator === '=' && targetResultNum === targetValue) {
            return 'U';
          } else if (targetOperator === '>=' && targetResultNum >= targetValue) {
            return 'U';
          } else if (targetOperator === '<=' && targetResultNum <= targetValue) {
            return 'U';
          }
        }
        return 'A';
      }
    } else {
      // quality
      return this.targetResult as string;
    }
  }

  naCheckboxTick(isTick: boolean) {
    if (isTick) this.targetResult = null;
  }

  showError(error: string, hasApiError?: boolean) {
    this.showAlert = true;
    this.alert = {
      type: 'error',
      message: error
    };
    if (hasApiError) this.hasApiError = true;
  }

  hideError() {
    this.showAlert = false;
    this.hasApiError = false;
    this.alert = {
      type: 'success',
      message: ''
    };
  }

  isShowError() {
    return (this.showAlert && !this.form.valid) || this.hasApiError;
  }

  onBlur(evt) {
    if (evt?.target?.valueAsNumber) {
      this.targetResult = Math.round(evt.target.valueAsNumber * 10 ** 4) / 10 ** 4;
    }
  }
}

import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { LastCommentModalComponent } from 'app/shared/components/last-comment-modal/last-comment-modal.component';
import { ActualTarget, DocumentDetail, Plan, SubTarget, Target } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { DocumentService } from 'app/shared/services/document.service';
import { UrlService } from 'app/shared/services/url.service';
import { PlanFlow } from '../target-result.interface';
import { TargetResultService } from '../target-result.service';
import { FileUpload } from '../target-result.types';

@Component({
  selector: 'target-save',
  templateUrl: './target-save.component.html',
  styleUrls: ['./target-save.component.scss']
})
export class TargetSaveComponent implements OnInit {
  @ViewChild('f') form: NgForm;
  user: User;
  mode: string;
  saveResultFileUploads: FileUpload[];
  showRefDocument: boolean = false;
  readonly = false;
  previousUrl: string;

  //bind value
  targetResult: string;
  naCheckBox: boolean = false;
  acceptReject: string;

  document: Partial<DocumentDetail>;
  target: Target;
  subTarget: SubTarget;
  plan: Plan;
  month: number;
  actualTarget: ActualTarget;

  isEdit: boolean = false; // true when press edit button
  // check privillege
  canSave: boolean = false;
  canEdit: boolean = false;
  canSubmit: boolean = false;
  canReject: boolean = false;

  constructor(
    private _targetResultService: TargetResultService,
    private _documentService: DocumentService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _urlService: UrlService,
    private _location: Location,
    private _confirmationService: ConfirmationService
  ) {
    this.readonly = _activatedRoute.snapshot.data['readonly'] ? true : false;
    const documentId = parseInt(this._activatedRoute.snapshot.params.id);
    const planId = parseInt(this._activatedRoute.snapshot.params.planId);
    const month = parseInt(this._activatedRoute.snapshot.params.month);
    // this.setData(this._targetResultService.targetSaveData);
    this.setData(documentId, planId, month);
  }

  ngOnInit(): void {
    this.user = this._activatedRoute.snapshot.data.user;
    this.mode = this._activatedRoute.snapshot.data['mode'];
    this.checkPrivillege();
    this.saveResultFileUploads = this._targetResultService.getSaveResultFileUploads();
    // this.causeAndFixFileUploads = this._targetResultService.getCauseAndFixFileUploads();

    this._urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
    });
  }

  // setData(data: TargetSaveData): void {
  setData(documentId: number, planId: number, month: number) {
    // const documentId = data.documentId;
    // const targetId = data.targetId;
    // const subTargetId = data.subTargetId;
    // const planId = data.planId;
    this._documentService.getDocument(documentId).subscribe({
      next: (documentDetail: DocumentDetail) => {
        // this.document = documentDetail;
        if (!this._documentService.getMockDocument()) {
          this._documentService.setMockDocument(documentDetail);
        }
        this.document = this._documentService.getMockDocument();
        // this.target = documentDetail.targets.find(v => v.id === targetId);
        // if (this.target) {
        //   this.subTarget = this.target.details.find(v => v.id === subTargetId);
        //   if (this.subTarget) {
        //     this.plan = this.subTarget.plans.find(v => v.id === planId);
        //   }
        // }
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
        this.mode = this.plan[`actualTarget${this.month}`] ? 'edit' : 'add';
        if (this.mode === 'edit') {
          this.actualTarget = this.plan[`actualTarget${this.month}`];
          this.targetResult = this.subTarget.measureType === '1' ? this.actualTarget.value : this.actualTarget.valueStatus;
          this.naCheckBox = this.subTarget.measureType === '1' && this.actualTarget.valueStatus === 'na';
          this.acceptReject = [PlanFlow.ACCEPT, PlanFlow.REJECT].includes(currentPlanFlow) ? currentPlanFlow : null;
        } else {
          this.isEdit = true;
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

  setShowRefDocument(): void {
    if (this.subTarget.measureType === '1') {
      this.showRefDocument = parseFloat(this.targetResult) < 70; // TODO:
    } else {
      if (this.targetResult === 'unarchive') {
        this.showRefDocument = true;
      } else {
        this.showRefDocument = false;
      }
    }
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

  backToDetail(): void {
    this._router.navigate(['../'], { relativeTo: this._activatedRoute });
  }

  backToArchive(): void {
    this.mode = 'saveResult';
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
        if (!this.isEdit && this.actualTarget.status === 'TARGET_REPORTING' && haveT01) this.canEdit = true;
        if (!this.isEdit && this.actualTarget.status === 'TARGET_REPORTING' && haveT01) {
          this.canSubmit = true;
        }
        if (!this.isEdit && this.actualTarget.status === 'TARGET_WAIT_FOR_VERIFY' && haveT02) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.actualTarget.status === 'TARGET_WAIT_FOR_APPROVE' && haveT03) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.actualTarget.status === 'TARGET_WAIT_FOR_RELEASE' && haveT04) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.actualTarget.status === 'TARGET_RELEASED' && haveT04) {
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
          if (this.mode === 'add') {
            this.plan[`actualTarget${this.month}`] = {
              id: Math.floor(Math.random() * 1000) + 1,
              status: 'TARGET_REPORTING',
              value: this.subTarget.measureType === '1' && !this.naCheckBox ? this.targetResult : null,
              valueStatus: this.calculateValueStatus()
            };
            this.actualTarget = this.plan[`actualTarget${this.month}`]
            this.mode = 'edit';
          } else {
            this.actualTarget.value = this.subTarget.measureType === '1' && !this.naCheckBox ? this.targetResult : null;
            this.actualTarget.valueStatus = this.calculateValueStatus();
          }
          this.isEdit = false;
          this.checkPrivillege();
        }
      });
    }
  }

  edit() {
    this.isEdit = true;
    this.checkPrivillege();
  }

  cancelEdit() {
    this.isEdit = false;
    this.checkPrivillege();
  }

  submit() {
    this._router.navigate(['./confirm-submit'], { relativeTo: this._activatedRoute })
  }

  reject() {
    this._router.navigate(['./confirm-reject'], { relativeTo: this._activatedRoute })
  }

  calculateValueStatus(): string {
    if (this.subTarget.measureType === '1') {
      // quality
      if (this.naCheckBox) return 'na';
      if (this.subTarget.targetCondition === '1') {
        // single
        const targetOperator = this.subTarget.conditions[0].targetOperator;
        const targetValue = this.subTarget.conditions[0].targetValue;
        const targetResultNum = parseInt(this.targetResult);
        if (targetOperator === '>') {
          if (targetResultNum > targetValue) {
            return 'archive';
          } else {
            return 'unarchive';
          }
        } else if (targetOperator === '<') {
          if (targetResultNum < targetValue) {
            return 'archive';
          } else {
            return 'unarchive';
          }
        } else if (targetOperator === '=') {
          if (targetResultNum === targetValue) {
            return 'archive';
          } else {
            return 'unarchive';
          }
        } else if (targetOperator === '>=') {
          if (targetResultNum >= targetValue) {
            return 'archive';
          } else {
            return 'unarchive';
          }
        } else if (targetOperator === '<=') {
          if (targetResultNum <= targetValue) {
            return 'archive';
          } else {
            return 'unarchive';
          }
        }
      } else {
        // range
        for (let condition of this.subTarget.conditions) {
          const targetOperator = condition.targetOperator;
          const targetValue = condition.targetValue;
          const targetResultNum = parseInt(this.targetResult);
          if (targetOperator === '>' && targetResultNum > targetValue) {
            return 'unarchive';
          } else if (targetOperator === '<' && targetResultNum < targetValue) {
            return 'unarchive';
          } else if (targetOperator === '=' && targetResultNum === targetValue) {
            return 'unarchive';
          } else if (targetOperator === '>=' && targetResultNum >= targetValue) {
            return 'unarchive';
          } else if (targetOperator === '<=' && targetResultNum <= targetValue) {
            return 'unarchive';
          }
        }
        return 'archive';
      }
    } else {
      // quantity
      return this.targetResult;
    }
  }

  naCheckboxTick(isTick: boolean) {
    if (isTick) this.targetResult = null;
  }

  acceptRejectChange(acceptReject: string) {
    if (acceptReject === 'accept') {
      this.setPlanFlow(PlanFlow.ACCEPT);
    } else if (acceptReject === 'reject') {
      this.setPlanFlow(PlanFlow.REJECT);
    }
  }
}

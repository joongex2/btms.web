import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { User } from 'app/core/user/user.types';
import { FileUploadTableComponent } from 'app/shared/components/file-upload-table/file-upload-table.component';
import { LastCommentModalComponent } from 'app/shared/components/last-comment-modal/last-comment-modal.component';
import { Actual, Cause, DocumentDetail, Plan, ReferenceDetail, SubTarget, Target, TargetReference } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { UrlService } from 'app/shared/services/url.service';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { TARGET_SOLUTION_TYPE } from '../target-result.interface';
import { TargetResultService } from '../target-result.service';
import { Attachment } from '../target-result.types';
import { CauseTableComponent } from './tables/cause-table/cause-table.component';

@Component({
  selector: 'target-cause-fix',
  templateUrl: './target-cause-fix.component.html',
  styleUrls: ['./target-cause-fix.component.scss'],
  animations: fuseAnimations
})
export class TargetCauseFixComponent implements OnInit {
  user: User;
  // document
  document: Partial<DocumentDetail>;
  target: Target;
  subTarget: SubTarget;
  plan: Plan;
  month: number;
  // actual
  actual: Actual;
  // reference
  reference: ReferenceDetail;
  targetReference: TargetReference;

  //bind value
  causes: Cause[];
  attachments: Attachment[];
  result: string;
  resultValue: number;
  resultApprovedDate: any;

  mode: string;
  readonly = false;
  previousUrl: string;

  isEdit: boolean = false; // true when press edit button
  // check privillege
  canSave: boolean = false;
  canEdit: boolean = false;
  canSubmit: boolean = false;
  canReject: boolean = false;

  fromUrl: string; // target-entry/ cause-edit-target

  @ViewChild(CauseTableComponent) causeTable: CauseTableComponent;
  @ViewChild(FileUploadTableComponent) fileUploadTable: FileUploadTableComponent;

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _urlService: UrlService,
    private _location: Location,
    private _targetResultService: TargetResultService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService
  ) {
    this.readonly = _activatedRoute.snapshot.data['readonly'] ? true : false;
  }

  ngOnInit(): void {
    if (this._router.url.includes('target-entry')) {
      this.fromUrl = 'target-entry';
    } else {
      this.fromUrl = 'cause-edit-target';
    }

    this.user = this._activatedRoute.snapshot.data.user;
    this.document = this._activatedRoute.snapshot.data.document;
    this.actual = this.fromUrl === 'target-entry' ? this._activatedRoute.snapshot.data.actual : this._activatedRoute.snapshot.data.referenceData.actual;
    this.mode = this._activatedRoute.snapshot.data['mode'];

    for (let target of this.document.targets) {
      for (let subTarget of target.details) {
        for (let plan of subTarget.plans) {
          if (plan.id === this.actual.targetDetailPlanId) {
            this.target = target;
            this.subTarget = subTarget;
            this.plan = plan;
          }
        }
      }
    }

    if (this.mode === 'edit') {
      if (this.fromUrl === 'target-entry') this.reference = this._activatedRoute.snapshot.data.reference;
      if (this.fromUrl === 'cause-edit-target') this.reference = this._activatedRoute.snapshot.data.referenceData.reference;
      this.targetReference = this.reference.targetReference;
      this.causes = JSON.parse(JSON.stringify(this.targetReference.causes));
      this.attachments = JSON.parse(JSON.stringify(this.reference.attachments));
      this.result = this.targetReference.result;
      this.resultValue = this.targetReference.resultValue;
      this.resultApprovedDate = this.targetReference.resultApprovedDate ? moment(this.targetReference.resultApprovedDate, 'YYYY-MM-DD') : null;
    } else {
      this.causes = [];
      this.attachments = [];
    }

    this._urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
    });

    this.checkPrivillege();
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

  ngOnDestroy(): void {
    // this._targetResultService.clear();
  }

  checkAtLeaseOneCauseOneFix(): boolean {
    const notDeleteCauses = this.causes?.filter(v => !v.markForDelete);
    if (!notDeleteCauses || notDeleteCauses?.length === 0) return false;
    for (let cause of notDeleteCauses) {
      const notDeleteFixes = cause.solutions.filter(v => !v.markForDelete && v.targetSolutionType === TARGET_SOLUTION_TYPE.SOLUTION);
      if (!notDeleteFixes || notDeleteFixes?.length === 0) return false;
    }
    return true;
  }


  save() {
    // check
    if (!this.checkAtLeaseOneCauseOneFix()) {
      this._snackBarService.warn('กรุณาระบุสาเหตุ และการแก้ไขอย่างน้อย 1 รายการ!');
      //this.showError('กรุณาระบุอย่างน้อย 1 สาเหตุที่มี 1 การแก้ไข!');
      document.getElementById('causeTable').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    this._confirmationService.save().afterClosed().subscribe(async (result) => {
      if (result == 'confirmed') {
        try {
          let res = await firstValueFrom(this._targetResultService.postReference(
            this.mode === 'edit' ? this.reference.targetReference.id : 0,
            this.actual.targetDetailPlanId,
            this.actual.targetMonth,
            this.causes,
            this.attachments,
            this.result,
            this.resultValue,
            this.resultApprovedDate ? this.resultApprovedDate.format('YYYY-MM-DD') : null
          ));
          if (!res.didError) {
            if (this.mode === 'add') {
              this._router.navigate([`./../cause-and-fix/${res.model}`], { relativeTo: this._activatedRoute });
            } else {
              // to refresh createdBy, createdDate of attachments
              this.reference = await firstValueFrom(this._targetResultService.getReference(this.targetReference.id));
              this.targetReference = this.reference.targetReference;
              this.attachments = JSON.parse(JSON.stringify(this.reference.attachments));
            }
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

  edit() {
    this.isEdit = true;
    this.checkPrivillege();
  }

  async cancelEdit() {
    // bring back data
    this.causes = JSON.parse(JSON.stringify(this.targetReference.causes));
    await this.fileUploadTable.deleteUnsavedAttachments();
    this.attachments = JSON.parse(JSON.stringify(this.reference.attachments));
    this.result = this.targetReference.result;
    this.resultValue = this.targetReference.resultValue;
    this.resultApprovedDate = this.targetReference.resultApprovedDate ? moment(this.targetReference.resultApprovedDate) : null;

    this.isEdit = false;
    this.checkPrivillege();
  }

  submit() {
    this._router.navigate(['./confirm-submit'], { relativeTo: this._activatedRoute })
  }

  reject() {
    this._router.navigate(['./confirm-reject'], { relativeTo: this._activatedRoute })
  }

  goBack() {
    if (!this.previousUrl
      || this.previousUrl.includes('redirectURL')
    ) {
      // if from refresh/ redirect or other page -> check from current url
      if (this.fromUrl === 'target-entry') {
        this._router.navigate(['./../..'], { relativeTo: this._activatedRoute })
      } else {
        this._router.navigate(['./../../../..'], { relativeTo: this._activatedRoute })
      }
    } else if (this.previousUrl.includes('add-cause-and-fix')) {
      this._location.historyGo(-2);
    } else {
      this._location.back();
    }
  }

  checkPrivillege() {
    // check 
    if (this.user?.organizes && this.document) {
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
        if (!this.isEdit && this.targetReference.targetReferenceStatus === 'SOLVE_DRAFT' && haveT01) this.canEdit = true;
        if (!this.isEdit && this.targetReference.targetReferenceStatus === 'SOLVE_INPROCESS' && haveT01) {
          this.canEdit = true;
          this.canSubmit = true;
          // this.canReject = true;
        }
        if (!this.isEdit && this.targetReference.targetReferenceStatus === 'SOLVE_WAIT_FOR_VERIFY' && haveT02) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.targetReference.targetReferenceStatus === 'SOLVE_WAIT_FOR_APPROVE' && haveT03) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.targetReference.targetReferenceStatus === 'SOLVE_CLOSED' && haveT04) {
          // this.canSubmit = true;
          // this.canReject = true;
        }
        if (!this.isEdit && this.targetReference.targetReferenceStatus === 'SOLVE_CLOSED(NEW)' && haveT04) {
          // this.canReject = true;
        }
      }
    } else {
      this.canSave = false;
      this.canEdit = false;
      this.canSubmit = false;
      this.canReject = false;
    }
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
    return this.showAlert || this.hasApiError;
  }

  onBlur(evt) {
    if (evt?.target?.valueAsNumber) {
      this.resultValue = Math.round(evt.target.valueAsNumber * 10 ** 4) / 10 ** 4;
    }
  }
}

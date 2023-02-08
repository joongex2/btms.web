import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { User } from 'app/core/user/user.types';
import { LastCommentModalComponent } from 'app/shared/components/last-comment-modal/last-comment-modal.component';
import { Actual, Cause, DocumentDetail, Plan, ReferenceDetail, SubTarget, Target, TargetReference } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { UrlService } from 'app/shared/services/url.service';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { TargetResultService } from '../target-result.service';
import { Attachment, FileUpload } from '../target-result.types';
import { CauseTableComponent } from './tables/cause-table/cause-table.component';

@Component({
  selector: 'target-cause-fix',
  templateUrl: './target-cause-fix.component.html',
  styleUrls: ['./target-cause-fix.component.scss'],
  animations: fuseAnimations
})
export class TargetCauseFixComponent implements OnInit {
  mode: string;
  user: User;
  // document
  document: Partial<DocumentDetail>;
  target: Target;
  subTarget: SubTarget;
  plan: Plan;
  month: number;
  actual: Actual;
  reference: ReferenceDetail;
  targetReference: TargetReference;

  //bind value
  result: string;
  resultValue: number;
  resultApprovedDate: any;

  saveResultFileUploads: FileUpload[];
  causes: Cause[];
  attachments: Attachment[];
  showRefDocument: boolean = false;
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
      this.causes = this.targetReference.causes;
      this.attachments = this.reference.attachments;
      this.result = this.targetReference.result;
      this.resultValue = this.targetReference.resultValue;
      this.resultApprovedDate = this.targetReference.resultApprovedDate ? moment(this.targetReference.resultApprovedDate) : null;
    } else {
      this.causes = [];
      this.attachments = [];
    }

    this._urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
    });
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

  save() {
    for (let cause of this.causes) {
      const fixTable = this.causeTable.fixTables.find(fixTable => fixTable.causeId === cause.id);
      const protectTable = this.causeTable.protectTables.find(protectTable => protectTable.causeId === cause.id);
      cause.solutions = [...fixTable.fixs, ...protectTable.protects];
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
              const reference: ReferenceDetail = await firstValueFrom(this._targetResultService.getReference(this.targetReference.id));
              this.attachments = reference.attachments;
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
    } else {
      this._location.back();
    }
  }

  checkPrivillege() {
    // check 
    if (this.user?.organizes && this.document) {
      let haveS01 = false;
      let haveS02 = false;
      let haveS03 = false;
      let haveS04 = false;
      const organize = this.user.organizes.find((v) => v.organizeCode === this.document.organizeCode);
      for (let role of organize.roles) {
        if (role.roleCode === 'S01') haveS01 = true;
        if (role.roleCode === 'S02') haveS02 = true;
        if (role.roleCode === 'S03') haveS03 = true;
        if (role.roleCode === 'S04') haveS04 = true;
      }
      this.canSave = false;
      this.canEdit = false;
      this.canSubmit = false;
      this.canReject = false;

      if (this.mode === 'add') {
        // add
        this.canSave = haveS01;
        this.canEdit = false;
        this.canSubmit = false;
        this.canReject = false;
      } else {
        // edit
        if (this.isEdit && haveS01) this.canSave = true;
        if (!this.isEdit && this.document.documentStatus === 'SOLVE_DRAFT' && haveS01) this.canEdit = true;
        if (!this.isEdit && this.document.documentStatus === 'SOLVE_INPROCESS' && haveS01) {
          this.canEdit = true;
          this.canSubmit = true;
        }
        // if (!this.isEdit && this.document.documentStatus === 'DOCUMENT_CANCEL' && haveD01) {
        //   // can do nothing
        // }
        // if (!this.isEdit && this.document.documentStatus === 'DOCUMENT_MODIFY' && haveD01) {
        //   this.canEdit = true;
        //   this.canSubmit = true;
        // }
        // document_wait_for_print
        if (!this.isEdit && this.document.documentStatus === 'SOLVE_DRAFT' && haveS01) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.document.documentStatus === 'SOLVE_WAIT_FOR_VERIFY' && haveS02) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.document.documentStatus === 'SOLVE_WAIT_FOR_APPROVE' && haveS03) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.document.documentStatus === 'SOLVE_CLOSED' && haveS04) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.document.documentStatus === 'SOLVE_CLOSED (NEW)' && haveS04) {
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

}

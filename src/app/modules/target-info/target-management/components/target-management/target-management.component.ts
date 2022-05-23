import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { TargetManagementStatus } from 'app/modules/target-info/target-management/target-management.interface';
import { TargetService } from 'app/modules/target-info/target.service';
import { LastCommentModalComponent } from 'app/shared/components/last-comment-modal/last-comment-modal.component';
import { DocumentDetail, Target } from 'app/shared/interfaces/document.interface';
import { Lookup } from 'app/shared/interfaces/lookup.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { DocumentService } from 'app/shared/services/document.service';
import { LookupService } from 'app/shared/services/lookup.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { UrlService } from 'app/shared/services/url.service';
import * as moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { TargetTableComponent } from '../../tables/target-table/target-table.component';
import { TargetManagementService } from '../../target-management.service';


@Component({
  selector: 'target-management',
  templateUrl: './target-management.component.html',
  styleUrls: ['./target-management.component.scss'],
  animations: fuseAnimations
})
export class TargetManagementComponent implements OnInit {
  @Input() targets: Target[] = [];
  @Input() runningNo: string;
  @ViewChild('targetTable') targetTable: TargetTableComponent;
  @ViewChild(NgForm) f: NgForm;
  user: User;
  mode: string;
  document: Partial<DocumentDetail>;
  previousUrl: string;
  documentId: number;
  isEdit: boolean = false; // true when press edit button
  isMyTargetUrl: boolean = false;

  // check privillege
  canSubmit: boolean = false;
  canEdit: boolean = false;
  canPrint: boolean = false;
  canNextStep: boolean = false;
  canReject: boolean = false;

  // bind value
  selectedDocumentType: string;
  selectedTargetType: string;
  selectedYear: string;

  // select option
  documentTypes: any[] = [];
  targetTypes: any[] = [];
  years: any[] = [];
  standards: any[] = [];

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _targetService: TargetService,
    private _router: Router,
    private _location: Location,
    private _userService: UserService,
    private _lookupService: LookupService,
    private _documentService: DocumentService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _urlService: UrlService,
    private _targetManagementService: TargetManagementService,
    private _matDialog: MatDialog
  ) {
    this.mode = _activatedRoute.snapshot.data['mode'];
  }

  ngOnInit(): void {
    this.user = this._activatedRoute.snapshot.data.user;

    this._urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
    });

    if (this.mode === 'add') {
      const id = this._targetManagementService.documentId;
      if (id) {
        // from confirmation
        this.loadDocument(parseInt(id));
        this.mode = 'edit';
      } else {
        // from new-target-list
        const organizeCode = this._activatedRoute.snapshot.paramMap.get('organizeCode');
        const organize = this.user.organizes.find((v) => v.organizeCode === organizeCode);
        this.document = {};
        this.document.businessUnit = organize.businessUnit;
        this.document.subBusinessUnit = organize.subBusinessUnit;
        this.document.plant = organize.plant;
        this.document.division = organize.division;
        this.document.userHolder = this.user.name;
        this.document.documentNo = '';
        this.document.documentStatusDescription = 'New';
        this.document.revisionNo = '';
        this.document.modifyNo = '';
        this.document.documentDate = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
        this.document.dueDate = '';

        this.document.organizeCode = organize.organizeCode;
        this.document.businessUnitCode = organize.businessUnitCode;
        this.document.subBusinessUnitCode = organize.subBusinessUnitCode;
        this.document.plantCode = organize.plantCode;
        this.document.divisionCode = organize.divisionCode;

        this.targets = [];

        this.isEdit = true;
        this.checkPrivillege();
        this._targetManagementService.targetManagementStatus = TargetManagementStatus.NEW;
      }

      this.selectedDocumentType = undefined;
      this.selectedYear = moment().year().toString();

      this._lookupService.getLookups('DOCUMENT_YEAR', 'DEFAULT').subscribe({
        next: (lookups: Lookup[]) => {
          const defaultYear = parseInt(lookups.find((v) => v.lookupCode === 'DEFAULT').lookupDescription);
          const currentYear = moment().year();
          this.years.push(currentYear);
          for (let i = 1; i <= defaultYear; i++) {
            this.years.push(currentYear + i);
            this.years.push(currentYear - i);
          }
          this.years.sort(function (a, b) { return b - a });
          this.years = this.years.map((v) => ({ title: v.toString(), value: v.toString() }));
        },
        error: (e) => console.error(e)
      });

      this._lookupService.getLookups('DOCUMENT_TYPE').subscribe({
        next: (lookups: Lookup[]) => {
          this.documentTypes = lookups.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
        },
        error: (e) => console.error(e)
      });

      this._lookupService.getLookups('TARGET_TYPE').subscribe({
        next: (lookups: Lookup[]) => {
          this.targetTypes = lookups.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
        },
        error: (e) => console.error(e)
      });
    } else {
      this.isMyTargetUrl = true;
      // from my-target or confirmation
      const id = parseInt(this._activatedRoute.snapshot.paramMap.get('id'));
      this.loadDocument(id);
      this._targetManagementService.documentId = id.toString();
      this._targetManagementService.targetManagementStatus = TargetManagementStatus.SUBMITTED;
    }
  }

  submit() {
    if (!this.f.valid) {
      this.f.control.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else if (!this.checkAtLeastOneEach()) {
      this.showError('แต่ละ document ต้องมี 1 ขั้นต่ำเป้าหมายหลักที่มี 1 ขึ้นต่ำเป้าหมายย่อยที่มี 1 ขั้นต่ำ แผนงานและการวัดผลเป้าหมาย', true);
    } else {
      this._confirmationService.save().afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            let res;
            if (this.mode === 'add') {
              res = await firstValueFrom(this._documentService.createDocument(
                0,
                this.document.organizeCode,
                this.document.businessUnitCode,
                this.document.subBusinessUnitCode,
                this.document.plantCode,
                this.document.divisionCode,
                this.selectedDocumentType,
                this.selectedTargetType,
                this.selectedYear,
                this.targets
              ));
            } else {
              // edit
              res = await firstValueFrom(this._documentService.editDocument(
                this.document.id,
                this.document.documentStatus,
                this.targets
              ));
            }
            if (!res.didError) {
              const id = res?.model;
              if (id) {
                this.mode = 'edit';
                this.isEdit = false;
                this._targetManagementService.documentId = id;
                this._targetManagementService.targetManagementStatus = TargetManagementStatus.SUBMITTED;
                this.loadDocument(id);
              }
              this._snackBarService.success(res.message);
            } else {
              this._snackBarService.error();
              this.showError(res.errorMessage, true);
              return;
            }
          } catch (e) {
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
    this._targetManagementService.targetManagementStatus = TargetManagementStatus.EDIT;
    this.checkPrivillege();
  }

  print() {
    console.log('print');
  }

  nextStep() {
    this._targetManagementService.targetManagementStatus = TargetManagementStatus.CONFIRM;
    this._router.navigate(['confirmation'], { relativeTo: this._activatedRoute });
  }

  reject() {
    this._targetManagementService.targetManagementStatus = TargetManagementStatus.REJECT;
    this._router.navigate(['confirmation'], { relativeTo: this._activatedRoute });
  }

  getDocumentType() {
    if (this.mode === 'add') {
      return this.selectedDocumentType;
    } else {
      return this.document ? this.document.documentType : undefined;
    }
  }

  getTargetType() {
    if (this.mode === 'add') {
      return this.selectedTargetType;
    } else {
      return this.document ? this.document.targetType : undefined;
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
    return (this.showAlert && !this.f.valid) || this.hasApiError;
  }

  goBack() {
    this._targetManagementService.clear();
    if (!this.previousUrl
      || this.previousUrl.includes('redirectURL')
      || (!this.previousUrl.includes('/target-info/new-target')
        && !this.previousUrl.includes('/target-info/my-target')
        )
      || this.previousUrl.includes('/confirmation')) {
      // if from refresh/ redirect or other page -> check from current url
      this.navigateByCurrentUrl();
    } else {
      this._location.back();
    }
  }

  navigateByCurrentUrl() {
    if (this._router.url.includes('/target-info/new-target')) {
      this._router.navigate(['/target-info/new-target']);
    } else {
      this._router.navigate(['/target-info/my-target']);
    }
  }

  markForEditHandler(targetId: number) {
    // TODO: markforedit document
  }

  loadDocument(id: number) {
    this._documentService.getDocument(id).subscribe({
      next: (documentDetail: DocumentDetail) => {
        this.document = documentDetail;
        this.runningNo = this.document.documentNo;
        this.documentId = this.document.id;
        this.targets = this.document.targets;

        this.selectedDocumentType = this.document.documentType;
        this.selectedYear = this.document.documentYear;
        this.selectedTargetType = this.document.targetType;

        this.loadStandards(this.document.documentType);
        this.checkPrivillege();
      },
      error: (e) => console.error(e)
    });
  }

  checkPrivillege() {
    if (this.user && this.user.organizes && this.document) {
      let haveD01 = false;
      const organize = this.user.organizes.find((v) => v.organizeCode === this.document.organizeCode);
      for (let role of organize.roles) {
        if (role.roleCode === 'D01') haveD01 = true;
      }
      this.canSubmit = this.isEdit && haveD01;
      this.canEdit = !this.isEdit && this.document && this.document.documentStatus === 'DOCUMENT_DRAFT';
      this.canPrint = !this.isEdit && this.document && this.document.documentStatus === 'DOCUMENT_DRAFT';
      this.canNextStep = !this.isEdit && this.document && this.document.documentStatus === 'DOCUMENT_DRAFT';
      this.canReject = !this.isEdit && this.document && this.document.documentStatus === 'DOCUMENT_DRAFT';
    } else {
      this.canSubmit = false;
      this.canEdit = false;
      this.canPrint = false;
      this.canNextStep = false;
      this.canReject = false;
    }
  }

  checkAtLeastOneEach(): boolean {
    const targets = this.targets.filter((v) => !v.markForDelete);
    if (targets.length === 0) return false;
    for (let target of targets) {
      const subTargets = target.details.filter((v) => !v.markForDelete);
      if (subTargets.length === 0) return false;
      for (let subTarget of subTargets) {
        const topics = subTarget.topics.filter((v) => !v.markForDelete);
        const plans = subTarget.plans.filter((v) => !v.markForDelete);
        if (topics.length === 0) return false;
        if (plans.length === 0) return false;
      }
    }
    return true;
  }

  documentTypeChange(documentType: string) {
    this.loadStandards(documentType);
  }

  loadStandards(documentType: string) {
    // load standards use in target-modal
    this._lookupService.getLookups('STANDARD', documentType).subscribe({
      next: (lookups: Lookup[]) => {
        this.standards = lookups
          .filter((v) => v.lookupType === 'STANDARD')
          .map((v) => ({ title: v.lookupDescription, value: v.lookupDescription }));
      },
      error: (e) => console.error(e)
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
}

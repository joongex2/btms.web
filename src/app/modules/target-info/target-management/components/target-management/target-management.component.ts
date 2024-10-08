import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { User } from 'app/core/user/user.types';
import { LastCommentModalComponent } from 'app/shared/components/last-comment-modal/last-comment-modal.component';
import { isNullOrUndefined } from 'app/shared/helpers/is-null-or-undefined';
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
  document: Partial<DocumentDetail>;
  documentId: number;
  isOneOrganizeNewTarget: boolean;

  mode: string;
  previousUrl: string;

  isEdit: boolean = false; // true when press edit button
  // check privillege
  canSave: boolean = false;
  canEdit: boolean = false;
  canSubmit: boolean = false;
  canReject: boolean = false;
  canRevise: boolean = false;

  // bind value
  selectedDocumentType: string;
  selectedTargetType = null; // TODO
  selectedYear: string;

  // select option
  documentTypes: any[] = [];
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
    private _router: Router,
    private _location: Location,
    private _lookupService: LookupService,
    private _documentService: DocumentService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _urlService: UrlService,
    private _matDialog: MatDialog
  ) {
    this.mode = _activatedRoute.snapshot.data['mode'];
    // console.log('mode=>',this.mode)
  }

  ngOnInit(): void {
    this.user = this._activatedRoute.snapshot.data.user;
    this.isOneOrganizeNewTarget = (this.user.organizes?.length === 1 && this.user.organizes?.[0]?.roles?.findIndex(v => v.roleCode === 'D01') !== -1);

    this._urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
    });

    // initial documentTypes
    this._lookupService.getLookups('DOCUMENT_TYPE').subscribe({
      next: (lookups: Lookup[]) => {
        
        if(this.mode == 'add') {
          // let activeDocumentTypes = lookups.filter(n => n.isActive == true);
          // console.log('documentTypes=>',activeDocumentTypes)
          this.documentTypes = lookups.filter(n => n.isActive == true).map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
        }
        else
          this.documentTypes = lookups.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
      },
      error: (e) => console.error(e)
    });

    // initial documentYears
    const currentYear = moment().year();
    this.years.push(currentYear - 1);
    this.years.push(currentYear);
    this.years.push(currentYear + 1);
    this.years.push(currentYear + 2);
    this.years.sort(function (a, b) {
        return b - a;
    });
    this.years = this.years.map((v) => ({
        title: v.toString(),
        value: v.toString(),
    }));

    if (this.mode === 'add') {
      // default value
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

      this.selectedDocumentType = undefined;
      this.selectedYear = moment().year().toString();

      this.checkPrivillege();
    } else {
      // from my-target or confirmation
      const id = parseInt(this._activatedRoute.snapshot.paramMap.get('id'));
      this.loadDocument(id);
    }
  }

  save() {
    this.hideError();
    const quantityPlanErrors = this.checkQuantityPlanHaveValueErrors();
    if (!this.f.valid) {
      this.f.control.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else if (!this.checkAtLeastOneEach()) {
      this.showError('กรุณาป้อนเป้าหมายหลัก เป้าหมายย่อย แผนงานและการวัดผลเป้าหมายอย่างน้อย 1 รายการ!', true);
    } else if (quantityPlanErrors) {
      this.showError(quantityPlanErrors.join('\n'), true);
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
              this._snackBarService.success(res.message);
              const id = res?.model;
              if (this.mode === 'add') {
                this._router.navigate([`target-info/my-target/${id}`]);
              } else {
                this.isEdit = false;
                this.targetTable.collapseAll();
                this.checkPrivillege();
                this.loadDocument(this.documentId);
              }
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
    //this.mode = 'edit';
    //this.selectedYear = this.document.documentYear.toString(); //console.log(this.selectedYear)
    this.checkPrivillege();
  }

  cancelEdit() {
    this.hideError();
    // bring back data
    this.targets = JSON.parse(JSON.stringify(this.document.targets));

    this.isEdit = false;
    this.checkPrivillege();
  }

  submit() {
    this._router.navigate(['confirm-submit'], { relativeTo: this._activatedRoute });
  }

  reject() {
    this._router.navigate(['confirm-reject'], { relativeTo: this._activatedRoute });
  }

  getDocumentType() {
    if (this.mode === 'add') {
      return this.selectedDocumentType;
    } else {
      return this.document ? this.document.documentType : undefined;
    }
  }

  showError(error: string, hasApiError?: boolean) {
    this.showAlert = true;
    this.alert = {
      type: 'error',
      message: error
    };
    if (hasApiError) this.hasApiError = true;
    document.getElementById('errorMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    if (!this.previousUrl
      || this.previousUrl.includes('redirectURL')
      || (!this.previousUrl.includes('/target-info/new-target') && !this.previousUrl.includes('/target-info/my-target'))
      || this.previousUrl.includes('/confirm-submit')
      || this.previousUrl.includes('/confirm-reject')
      || (this.mode === 'edit' && this.previousUrl.includes('/target-info/new-target'))
    ) {
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

  loadDocument(id: number) {
    this._documentService.getDocument(id).subscribe({
      next: (documentDetail: DocumentDetail) => {
        this.document = documentDetail;
        this.runningNo = this.document.documentNo;
        this.documentId = this.document.id;
        this.targets = JSON.parse(JSON.stringify(this.document.targets));

        this.selectedDocumentType = this.document.documentType;
        this.selectedYear = this.document.documentYear;

        this.loadStandards(this.document.documentType);
        this.checkPrivillege();
      },
      error: (e) => console.error(e)
    });
  }

  checkPrivillege() {
    // check 
    if (this.user?.organizes && this.document) {
      let haveD01 = false;
      let haveD02 = false;
      let haveD03 = false;
      let haveD04 = false;
      const organize = this.user.organizes.find((v) => v.organizeCode === this.document.organizeCode);
      if (organize) {
        for (let role of organize.roles) {
          if (role.roleCode === 'D01') haveD01 = true;
          if (role.roleCode === 'D02') haveD02 = true;
          if (role.roleCode === 'D03') haveD03 = true;
          if (role.roleCode === 'D04') haveD04 = true;
        }
      }

      this.canSave = false;
      this.canEdit = false;
      this.canSubmit = false;
      this.canReject = false;
      this.canRevise = false;

      if (this.mode === 'add') {
        // add
        this.canSave = haveD01;
        this.canEdit = false;
        this.canSubmit = false;
        this.canReject = false;
      } else {
        // edit
        if (this.isEdit && haveD01) this.canSave = true;
        if (!this.isEdit && this.document.documentStatus === 'DOCUMENT_DRAFT' && haveD01) this.canEdit = true;
        if (!this.isEdit && this.document.documentStatus === 'DOCUMENT_REVISE' && haveD01) {
          this.canEdit = true;
          this.canSubmit = true;
        }
        if (!this.isEdit && this.document.documentStatus === 'DOCUMENT_CANCEL' && haveD01) {
          // can do nothing
        }
        if (!this.isEdit && this.document.documentStatus === 'DOCUMENT_MODIFY' && haveD01) {
          this.canEdit = true;
          this.canSubmit = true;
        }
        // document_wait_for_print
        if (!this.isEdit && this.document.documentStatus === 'DOCUMENT_DRAFT' && haveD01) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.document.documentStatus === 'DOCUMENT_WAIT_FOR_VERIFY' && haveD02) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.document.documentStatus === 'DOCUMENT_WAIT_FOR_APPROVE' && haveD03) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.document.documentStatus === 'DOCUMENT_WAIT_FOR_ISSUE' && haveD04) {
          this.canSubmit = true;
          this.canReject = true;
        }
        if (!this.isEdit && this.document.documentStatus === 'DOCUMENT_ISSUED' && haveD01) {
          this.canRevise = true;
        }
      }
    } else {
      this.canSave = false;
      this.canEdit = false;
      this.canSubmit = false;
      this.canReject = false;
      this.canRevise = false;
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

  checkQuantityPlanHaveValueErrors(): string[] {
    const messages: string[] = [];
    const targets = this.targets.filter((v) => !v.markForDelete);
    for (let i = 0; i < targets.length; i++) {
      const quantitySubTargets = targets[i].details.filter((v) => !v.markForDelete);
      for (let j = 0; j < quantitySubTargets.length; j++) {
        if (quantitySubTargets[j].measureType !== '1' || quantitySubTargets[j].targetCondition === '2') continue;
        let isFailed = false;
        const plans = quantitySubTargets[j].plans.filter((v) => !v.markForDelete);
        for (let plan of plans) {
          for (let k = 1; k <= 12; k++) {
            if (plan[`useMonth${k}`] && isNullOrUndefined(plan[`valueMonth${k}`])) isFailed = true;
          }
        }
        if (isFailed) {
          messages.push(`กรุณาตรวจสอบประเภทการวัดผลของหัวข้อเป้าหมายย่อยที่ No ${j + 1}. ในเป้าหมายหลัก No ${i + 1}`);
        }
      }
    }
    return messages.length > 0 ? messages : null;
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
          .map((v) => ({ title: v.lookupDescription, value: v.lookupDescription, active: v.isActive }));

        // console.log(this.standards)
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

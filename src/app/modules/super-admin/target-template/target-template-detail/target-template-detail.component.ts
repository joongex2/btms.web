import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { User } from 'app/core/user/user.types';
import { TargetTableComponent } from 'app/modules/target-info/target-management/tables/target-table/target-table.component';
import { Target } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { LookupService } from 'app/shared/services/lookup.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { UrlService } from 'app/shared/services/url.service';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { Lookup } from '../../lookup/lookup.interface';
import { TargetTemplate } from '../target-template.interface';
import { TargetTemplateService } from '../target-template.service';

@Component({
  selector: 'target-template-detail',
  templateUrl: './target-template-detail.component.html',
  styleUrls: ['./target-template-detail.component.scss'],
  animations: fuseAnimations
})
export class TargetTemplateDetailComponent implements OnInit {
  @ViewChild('targetTable') targetTable: TargetTableComponent;
  @ViewChild(NgForm) f: NgForm;
  user: User;
  targetTemplate: TargetTemplate;
  isEdit: boolean = false;
  previousUrl: string;

  // bind value
  documentName: string;
  selectedDocumentType: string;
  selectedYear: number;
  targets: Target[] = [];

  // select option
  documentTypes: any[] = [];
  documentStatuses: any[] = [];
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
    private _targetTemplateService: TargetTemplateService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _urlService: UrlService,
    private _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    let routeId = this._activatedRoute.snapshot.paramMap.get('id') as any;
    if (routeId) routeId = parseInt(routeId);
    this.isEdit = routeId ? true : false;
    this.user = this._activatedRoute.snapshot.data.user;

    this._urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
    });

    // load select
    // years
    this.selectedYear = moment().year();
    const currentYear = moment().year();
    this.years.push(currentYear);
    this.years.push(currentYear + 1);
    this.years.push(currentYear + 2);
    this.years.sort(function (a, b) { return b - a });
    this.years = this.years.map((v) => ({ title: v.toString(), value: v }));

    // documentTypes
    this._lookupService.getLookups('DOCUMENT_TYPE').subscribe({
      next: (lookups: Lookup[]) => {
        this.documentTypes = lookups.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
      },
      error: (e) => console.error(e)
    });

    // documentStatuses
    this._lookupService.getLookups('BTMS_01_STATUS').subscribe({
      next: (lookups: Lookup[]) => {
        this.documentStatuses = lookups.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
      },
      error: (e) => console.error(e)
    });

    if (!this.isEdit) {
      // add
      // default value
      this.targetTemplate = {} as any;
      this.targetTemplate.id = 0;
      this.targetTemplate.documentName = null;
      this.targetTemplate.documentType = null;
      this.targetTemplate.documentYear = null;
      this.targets = [];
    } else {
      // edit
      this.loadTargetTemplate(routeId);
    }
  }

  save() {
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
            if (!this.isEdit) {
              res = await firstValueFrom(this._targetTemplateService.createTargetTemplate(
                this.documentName,
                this.selectedDocumentType,
                this.selectedYear,
                this.targets
              ));
            } else {
              // edit
              res = await firstValueFrom(this._targetTemplateService.editTargetTemplate(
                this.targetTemplate.id,
                this.documentName,
                this.selectedDocumentType,
                this.selectedYear,
                this.targets
              ));
            }
            if (!res.didError) {
              this._snackBarService.success(res.message);
              const id = res?.model;
              if (!this.isEdit) {
                this._router.navigate([`super-admin/target-template/${id}`]);
              } else {
                this.targetTable.collapseAll();
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
    if (!this.previousUrl
      || this.previousUrl.includes('redirectURL')
      || this.previousUrl.includes('add-template')
      || !this.previousUrl.includes('/super-admin/target-template')
    ) {
      // if from refresh/ redirect or other page -> check from current url
      this._router.navigate(['/super-admin/target-template'])
    } else {
      this._location.back();
    }
  }

  loadTargetTemplate(id: number) {
    this._targetTemplateService.getTargetTemplate(id).subscribe({
      next: (targetTemplate: TargetTemplate) => {
        this.targetTemplate = targetTemplate;
        this.documentName = this.targetTemplate.documentName
        this.selectedDocumentType = this.targetTemplate.documentType;
        this.selectedYear = this.targetTemplate.documentYear;
        this.targets = this.targetTemplate.targets;

        this.loadStandards(this.targetTemplate.documentType);
      },
      error: (e) => console.error(e)
    });
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
}

import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { DocumentDetail } from 'app/shared/interfaces/document.interface';
import { Lookup } from 'app/shared/interfaces/lookup.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { DocumentService } from 'app/shared/services/document.service';
import { LookupService } from 'app/shared/services/lookup.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { UrlService } from 'app/shared/services/url.service';
import * as moment from 'moment';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { TargetService } from '../target.service';
import { RunningNo, TargetRecord } from '../target.types';
import { TargetTableComponent } from './tables/target-table/target-table.component';

@Component({
  selector: 'target-management',
  templateUrl: './target-management.component.html',
  styleUrls: ['./target-management.component.scss'],
  animations: fuseAnimations
})
export class TargetManagementComponent implements OnInit {
  @Input() targets: TargetRecord[];
  @Input() runningNo: RunningNo;
  @ViewChild('targetTable') targetTable: TargetTableComponent;
  @ViewChild(NgForm) f: NgForm;
  mode: string;
  document: Partial<DocumentDetail>;
  previousUrl: string;

  // bind value
  selectedDocumentType: string;
  selectedYear: string;

  // select option
  documentTypes: any[] = [];
  years: any[] = [];

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  private _unsubscribeAll: Subject<any> = new Subject<any>();

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
    private _urlService: UrlService
  ) {
    this.mode = _activatedRoute.snapshot.data['mode'];
  }

  ngOnInit(): void {
    this._urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
    });

    if (this.mode === 'add') {
      // from new-target
      this.selectedDocumentType = undefined;
      this.selectedYear = moment().year().toString();

      this._lookupService.getLookups('DOCUMENT_TYPE', 'DEFAULT').subscribe({
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

      const organizeCode = this._activatedRoute.snapshot.paramMap.get('organizeCode');
      this._userService.user$
        .pipe((takeUntil(this._unsubscribeAll)))
        .subscribe((user: User) => {
          const organize = user.organizes.find((v) => v.organizeCode === organizeCode);
          this.document = {};
          this.document.businessUnit = organize.businessUnit;
          this.document.subBusinessUnit = organize.subBusinessUnit;
          this.document.plant = organize.plant;
          this.document.division = organize.division;
          this.document.userHolder = user.name;
          this.document.documentNo = '';
          this.document.documentStatusDescription = 'New';
          this.document.revisionNo = 'NONE';
          this.document.modifyNo = '';
          this.document.documentDate = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
          this.document.dueDate = '';

          this.document.organizeCode = organize.organizeCode;
          this.document.businessUnitCode = organize.businessUnitCode;
          this.document.subBusinessUnitCode = organize.subBusinessUnitCode;
          this.document.plantCode = organize.plantCode;
          this.document.divisionCode = organize.divisionCode;
        });
    } else {
      // from my-target
      const id = parseInt(this._activatedRoute.snapshot.paramMap.get('id'));
      this._documentService.getDocument(id).subscribe({
        next: (documentDetail: DocumentDetail) => {
          this.document = documentDetail;
        },
        error: (e) => console.error(e)
      });
      this.runningNo = this._targetService.getRunningNo('OBJ-ENPC-64-02'); // TODO: replace real data
      this.targets = this._targetService.getTargets('OBJ-ENPC-64-02'); // TODO: replace real data
    }
  }

  save() {
    if (!this.f.valid) {
      this.f.control.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      this._confirmationService.save().afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            const res = await firstValueFrom(this._documentService.createDocument(
              this.document.organizeCode,
              this.document.businessUnitCode,
              this.document.subBusinessUnitCode,
              this.document.plantCode,
              this.document.divisionCode,
              this.selectedDocumentType,
              this.selectedYear
            ));
            if (!res.didError) {
              const id = res?.model?.id;
              if (id) this._router.navigate([`/target-info/my-target/${id}`]);
              this._snackBarService.success();
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
    this.alert = {
      type: 'success',
      message: ''
    };
  }

  isShowError() {
    return (this.showAlert && !this.f.valid) || this.hasApiError;
  }

  goBack() {
    if (
      !this.previousUrl
      || this.previousUrl.includes('redirectURL')
      || (this.mode === 'edit' && this.previousUrl.includes('/target-info/new-target'))
    ) {
      // if come from or refresh/redirect/new-target (when create) need to back to my-target
      this._router.navigate(['/target-info/my-target']);
    } else {
      this._location.back();
    }
  }

  /**
     * On destroy
     */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}

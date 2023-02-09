import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { TargetResultService } from 'app/modules/target-result/target-result.service';
import { ConfirmationInfo, InformEmail, ReceiveEmail } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { DocumentService } from 'app/shared/services/document.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { firstValueFrom, Observer } from 'rxjs';
import { InformMailTableComponent } from '../../tables/inform-mail-table/inform-mail-table.component';
import { ReceiveMailTableComponent } from '../../tables/receive-mail-table/receive-mail-table.component';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  animations: fuseAnimations
})
export class ConfirmationComponent implements OnInit {
  @ViewChild(ReceiveMailTableComponent) receiveMailTable: ReceiveMailTableComponent;
  @ViewChild(InformMailTableComponent) informMailTable: InformMailTableComponent;
  @ViewChild(NgForm) f: NgForm;
  mode: string;
  documentId: number;
  actualTargetIds: number[];
  referenceId: number;
  fromUrl: string; // to display different breadcrumb reference-submit/reject mode

  // bind value
  title: string;
  from: string;
  dueDate: string;
  comment: string;
  informEmails: InformEmail[];
  receiveEmails: ReceiveEmail[];

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
    private _documentService: DocumentService,
    private _targetResultService: TargetResultService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.mode = this._activatedRoute.snapshot.data['mode'];
    if (['document-submit', 'document-reject'].includes(this.mode)) {
      this.documentId = parseInt(this._activatedRoute.snapshot.paramMap.get('id'));
    }
    if (['actual-submit', 'actual-reject'].includes(this.mode)) {
      this.actualTargetIds = this._activatedRoute.snapshot.queryParamMap.get('actualTargetIds').split(',').map(v => parseInt(v));
    }
    if (['reference-submit', 'reference-reject'].includes(this.mode)) {
      this.referenceId = parseInt(this._activatedRoute.snapshot.params.referenceId);
      if (this._router.url.includes('target-entry')) {
        this.fromUrl = 'target-entry';
      } else if (this._router.url.includes('cause-edit-target')) {
        this.fromUrl = 'cause-edit-target';
      }
    }

    const bindInfoObserver: Partial<Observer<ConfirmationInfo>> = {
      next: (v: ConfirmationInfo) => { this.bindInfo(v); },
      error: (e) => console.error(e)
    };
    if (this.mode === 'document-submit') {
      this._documentService.getSubmitEmail(this.documentId).subscribe(bindInfoObserver);
    } else if (this.mode === 'document-reject') {
      this._documentService.getRejectEmail(this.documentId).subscribe(bindInfoObserver);
    } else if (this.mode === 'actual-submit') {
      const id = this.actualTargetIds?.[0];
      this._targetResultService.getActualSubmitEmail(id).subscribe(bindInfoObserver);
    } else if (this.mode === 'actual-reject') {
      const id = this.actualTargetIds?.[0];
      this._targetResultService.getActualRejectEmail(id).subscribe(bindInfoObserver);
    } else if (this.mode === 'reference-submit') {
      this._targetResultService.getReferenceSubmitEmail(this.referenceId).subscribe(bindInfoObserver);
    } else if (this.mode === 'reference-reject') {
      this._targetResultService.getReferenceRejectEmail(this.referenceId).subscribe(bindInfoObserver);
    }
  }

  bindInfo(v: ConfirmationInfo) {
    this.title = v.title;
    this.from = v.from;
    this.dueDate = v.dueDate;
    this.informEmails = v.emails.filter(v => v.type === 'inform') as InformEmail[];
    this.receiveEmails = v.emails.filter(v => v.type === 'receive') as ReceiveEmail[];
  }

  ngAfterViewInit() { }

  goBack() {
    this._location.back();
  }

  send() {
    if (!this.f.valid) {
      this.f.control.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else if (this.receiveMailTable.selection.selected.length === 0) {
      this._snackBarService.warn('กรุณาเลือก user receive mail อย่างน้อย 1 รายการ');
      this.showError('users receive mail, list of users inform mail must have atleast 1 email checked', true);
    } else {
      this._confirmationService.send('ต้องการ' + this.title + 'ใช่หรือไม่').afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            let res;
            if (this.mode === 'document-submit') {
              res = await firstValueFrom(this._documentService.patchSubmitEmail(
                this.documentId,
                this.comment,
                this.informMailTable.selection.selected.map(v => v.email),
                this.receiveMailTable.selection.selected.map(v => v.email)
              ));
            } else if (this.mode === 'document-reject') {
              res = await firstValueFrom(this._documentService.patchRejectEmail(
                this.documentId,
                this.comment,
                this.informMailTable.selection.selected.map(v => v.email),
                this.receiveMailTable.selection.selected.map(v => v.email)
              ));
            } else if (this.mode === 'actual-submit') {
              res = await firstValueFrom(this._targetResultService.patchActualSubmitEmail(
                this.actualTargetIds,
                this.comment,
                this.informMailTable.selection.selected.map(v => v.email),
                this.receiveMailTable.selection.selected.map(v => v.email)
              ));
            } else if (this.mode === 'actual-reject') {
              res = await firstValueFrom(this._targetResultService.patchActualRejectEmail(
                this.actualTargetIds,
                this.comment,
                this.informMailTable.selection.selected.map(v => v.email),
                this.receiveMailTable.selection.selected.map(v => v.email)
              ));
            } else if (this.mode === 'reference-submit') {
              res = await firstValueFrom(this._targetResultService.patchReferenceSubmitEmail(
                this.referenceId,
                this.comment,
                this.informMailTable.selection.selected.map(v => v.email),
                this.receiveMailTable.selection.selected.map(v => v.email)
              ))
            } else if (this.mode === 'reference-reject') {
              res = await firstValueFrom(this._targetResultService.patchReferenceRejectEmail(
                this.referenceId,
                this.comment,
                this.informMailTable.selection.selected.map(v => v.email),
                this.receiveMailTable.selection.selected.map(v => v.email)
              ))
            }
            if (!res.didError) {
              this._snackBarService.success(res.message);
              this.goBack();
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
}

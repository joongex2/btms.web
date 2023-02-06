import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { TargetResultService } from 'app/modules/target-result/target-result.service';
import { DocumentConfirm, DocumentDetail, InformEmail, ReceiveEmail } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { DocumentService } from 'app/shared/services/document.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { firstValueFrom } from 'rxjs';
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
  documentId: number;
  document: DocumentDetail;
  mode: string;
  actualTargetId: number;
  actualTargetIds: number[];

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
    private _userService: UserService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _documentService: DocumentService,
    private _targetResultService: TargetResultService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.documentId = parseInt(this._activatedRoute.snapshot.paramMap.get('id'));
    this.mode = this._activatedRoute.snapshot.data['mode'];
    if (['single-target-submit', 'single-target-reject'].includes(this.mode)) {
      this.actualTargetId = parseInt(this._activatedRoute.snapshot.params.actualTargetId);
    }
    if (['multi-target-submit', 'multi-target-reject'].includes(this.mode)) {
      this.actualTargetIds = this._activatedRoute.snapshot.queryParamMap.get('actualTargetIds').split(',').map(v => parseInt(v));
    }
    this.loadDocument(this.documentId);

    if (['submit'].includes(this.mode)) {
      this._documentService.getSubmitEmail(this.documentId).subscribe({
        next: (v: DocumentConfirm) => {
          this.bindInfo(v);
        },
        error: (e) => console.error(e)
      });
    } else if (['reject'].includes(this.mode)) {
      this._documentService.getRejectEmail(this.documentId).subscribe({
        next: (v: DocumentConfirm) => {
          this.bindInfo(v);
        },
        error: (e) => console.error(e)
      });
    } else if (['single-target-submit', 'multi-target-submit'].includes(this.mode)) {
      const id = this.mode === 'single-target-submit' ? this.actualTargetId : this.actualTargetIds?.[0];
      this._targetResultService.getActualSubmitEmail(id).subscribe({
        next: (v: DocumentConfirm) => {
          this.bindInfo(v);
        },
        error: (e) => console.error(e)
      });
    } else if (['single-target-reject', 'multi-target-reject'].includes(this.mode)) {
      const id = this.mode === 'single-target-reject' ? this.actualTargetId : this.actualTargetIds?.[0];
      this._targetResultService.getActualRejectEmail(id).subscribe({
        next: (v: DocumentConfirm) => {
          this.bindInfo(v);
        },
        error: (e) => console.error(e)
      });
    }
  }

  bindInfo(v: DocumentConfirm) {
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
    } else if (this.receiveMailTable.selection.selected.length === 0) //|| this.informMailTable.selection.selected.length === 0
    {
      this._confirmationService.warning('กรุณาเลือก user receive mail อย่างน้อย 1 รายการ');
      this.showError('users receive mail, list of users inform mail must have atleast 1 email checked', true);
    } else {
      this._confirmationService.send('ต้องการ' + this.title + 'ใช่หรือไม่').afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            let res;
            if (this.mode === 'submit') {
              res = await firstValueFrom(this._documentService.patchSubmitEmail(
                this.documentId,
                this.comment,
                this.informMailTable.selection.selected.map(v => v.email),
                this.receiveMailTable.selection.selected.map(v => v.email)
              ));
            } else if (this.mode === 'reject') {
              res = await firstValueFrom(this._documentService.patchRejectEmail(
                this.documentId,
                this.comment,
                this.informMailTable.selection.selected.map(v => v.email),
                this.receiveMailTable.selection.selected.map(v => v.email)
              ));
            } else if (['single-target-submit', 'multi-target-submit'].includes(this.mode)) {
              res = await firstValueFrom(this._targetResultService.patchActualSubmitEmail(
                this.mode === 'single-target-submit' ? [this.actualTargetId] : this.actualTargetIds,
                this.comment,
                this.informMailTable.selection.selected.map(v => v.email),
                this.receiveMailTable.selection.selected.map(v => v.email)
              ));
            } else if (['single-target-reject', 'multi-target-reject'].includes(this.mode)) {
              res = await firstValueFrom(this._targetResultService.patchActualRejectEmail(
                this.mode === 'single-target-reject' ? [this.actualTargetId] : this.actualTargetIds,
                this.comment,
                this.informMailTable.selection.selected.map(v => v.email),
                this.receiveMailTable.selection.selected.map(v => v.email)
              ));
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
            this._snackBarService.error();
            this.showError(e.error, true);
            return;
          }
          this.hideError();
        }
      });
    }
  }

  loadDocument(id: number) {
    this._documentService.getDocument(id).subscribe({
      next: (documentDetail: DocumentDetail) => {
        this.document = documentDetail;
      },
      error: (e) => console.error(e)
    });
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

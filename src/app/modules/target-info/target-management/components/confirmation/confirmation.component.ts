import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { DocumentConfirm, InformEmail, ReceiveEmail } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { DocumentService } from 'app/shared/services/document.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { firstValueFrom } from 'rxjs';
import { InformMailTableComponent } from '../../tables/inform-mail-table/inform-mail-table.component';
import { ReceiveMailTableComponent } from '../../tables/receive-mail-table/receive-mail-table.component';
import { TargetManagementStatus } from '../../target-management.interface';
import { TargetManagementService } from '../../target-management.service';

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
  targetManagementStatus: TargetManagementStatus;
  TargetManagementStatus = TargetManagementStatus;
  isMyTargetUrl: boolean = false;

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
    private _targetManagementService: TargetManagementService,
    private _documentService: DocumentService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    if (this._router.url.includes('/target-info/my-target')) {
      this.isMyTargetUrl = true;
    }
    this.documentId = parseInt(this._targetManagementService.documentId);
    this.targetManagementStatus = this._targetManagementService.targetManagementStatus;
    if (this.targetManagementStatus === TargetManagementStatus.CONFIRM) {
      this._documentService.getSubmitEmail(this.documentId).subscribe({
        next: (v: DocumentConfirm) => {
          this.bindInfo(v);
        },
        error: (e) => console.error(e)
      });
    } else {
      this._documentService.getRejectEmail(this.documentId).subscribe({
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
    this._targetManagementService.targetManagementStatus = TargetManagementStatus.SUBMITTED;
    this._router.navigate(['../'], { relativeTo: this._activatedRoute });
  }

  send() {
    if (!this.f.valid) {
      this.f.control.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else if (this.receiveMailTable.selection.selected.length === 0) //|| this.informMailTable.selection.selected.length === 0
    {
      this.showError('users receive mail, list of users inform mail must have atleast 1 email checked', true);
    } else {
      this._confirmationService.send('ต้องการ' + this.title + 'ใช่หรือไม่').afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            let res;
            if (this.targetManagementStatus === TargetManagementStatus.CONFIRM) {
              res = await firstValueFrom(this._documentService.patchSubmitEmail(
                this.documentId,
                this.comment,
                this.informMailTable.selection.selected.map(v => v.email),
                this.receiveMailTable.selection.selected.map(v => v.email)
              ));
            } else {
              // reject
              res = await firstValueFrom(this._documentService.patchRejectEmail(
                this.documentId,
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

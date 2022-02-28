import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { OrganizationService } from 'app/modules/admin/organization/organization.service';
import { Organization } from 'app/modules/admin/organization/organization.types';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { firstValueFrom } from 'rxjs';
import { ModalData, ModalMode } from '../../../../super-admin/modals/modal.types';
import { DocumentControlService } from '../../document-control.service';
import { DocumentControl } from '../../document-control.types';




@Component({
  selector: 'document-control-modal',
  templateUrl: './document-control-modal.component.html',
  styleUrls: ['./document-control-modal.component.scss'],
  animations: fuseAnimations
})
export class DocumentControlModalComponent implements OnInit {
  isEdit: boolean = false;
  documentControl: DocumentControl;
  documentControlForm: FormGroup;
  statuses: any[] = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];
  organizeCodes: any[];
  documentTypes: any[] = [
    { title: 'BTMS_01', value: 'BTMS_01' },
    { title: 'BTMS_02', value: 'BTMS_02' },
    { title: 'BTMS_03', value: 'BTMS_03' }
  ];
  isActives: any = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<DocumentControlModalComponent>,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _organizationService: OrganizationService,
    private _documentControlService: DocumentControlService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this._organizationService.getOrganizations().subscribe({
      next: (v: Organization[]) => { this.organizeCodes = v.map((v) => ({ title: v.code, value: v.code })) },
      error: (e) => console.error(e)
    });

    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.documentControl = this.modalData.data;
    const organizeCode = this.isEdit ? this.modalData.data.organizeCode : undefined;
    const documentCode = this.isEdit ? this.modalData.data.documentCode : undefined;
    const documentType = this.isEdit ? this.modalData.data.documentType : undefined;
    const prefix = this.isEdit ? this.modalData.data.prefix : '';
    const suffix = this.isEdit ? this.modalData.data.suffix : '';
    const lengthOfRunningNo = this.isEdit ? this.modalData.data.lengthOfRunningNo : '';
    const lastDocumentNo = this.isEdit ? this.modalData.data.lastDocumentNo : '';
    const lastRunningNo = this.isEdit ? this.modalData.data.lastRunningNo : '';
    const isActive = this.isEdit ? this.modalData.data.isActive : undefined;

    this.documentControlForm = this._formBuilder.group({
      organizeCode: [organizeCode, [Validators.required]],
      documentCode: [documentCode, [Validators.required]],
      documentType: [documentType, [Validators.required]],
      prefix: [prefix, [Validators.required]],
      suffix: [suffix, [Validators.required]],
      lengthOfRunningNo: [lengthOfRunningNo, [Validators.required]],
      lastDocumentNo: [lastDocumentNo, [Validators.required]],
      lastRunningNo: [lastRunningNo, [Validators.required]],
      isActive: [isActive, [Validators.required]]
    });
  }

  async saveAndClose() {
    if (!this.documentControlForm.valid) {
      this.documentControlForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      this._confirmationService.save().afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            if (this.isEdit) {
              await firstValueFrom(this._documentControlService.updateDocumentControl(
                this.documentControl.id,
                this.documentControlForm.get('organizeCode').value,
                this.documentControlForm.get('documentCode').value,
                this.documentControlForm.get('documentType').value,
                this.documentControlForm.get('prefix').value,
                this.documentControlForm.get('suffix').value,
                this.documentControlForm.get('lengthOfRunningNo').value,
                this.documentControlForm.get('lastDocumentNo').value,
                this.documentControlForm.get('lastRunningNo').value,
                this.documentControlForm.get('isActive').value
              ));
            } else {
              // add
              await firstValueFrom(this._documentControlService.createDocumentControl(
                this.documentControlForm.get('organizeCode').value,
                this.documentControlForm.get('documentCode').value,
                this.documentControlForm.get('documentType').value,
                this.documentControlForm.get('prefix').value,
                this.documentControlForm.get('suffix').value,
                this.documentControlForm.get('lengthOfRunningNo').value,
                this.documentControlForm.get('lastDocumentNo').value,
                this.documentControlForm.get('lastRunningNo').value,
                this.documentControlForm.get('isActive').value
              ));
            }
            this._snackBarService.success();
            this.matDialogRef.close(true);
          } catch (e) {
            this._snackBarService.error();
            this.showError(e, true);
          }
        }
      });
    }
  }

  close(): void {
    this.matDialogRef.close();
  }

  showError(error: string, hasApiError?: boolean) {
    this.showAlert = true;
    this.alert = {
      type: 'error',
      message: error
    };
    if (hasApiError) this.hasApiError = true;
  }

  isShowError() {
    return (this.showAlert && !this.documentControlForm.valid) || this.hasApiError;
  }
}

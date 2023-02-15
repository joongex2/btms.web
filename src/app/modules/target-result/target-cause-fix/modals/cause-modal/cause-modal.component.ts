import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { ModalData, ModalMode } from 'app/modules/target-info/target-management/modals/modal.type';
import { Cause } from 'app/shared/interfaces/document.interface';

@Component({
  selector: 'app-cause-modal',
  templateUrl: './cause-modal.component.html',
  styleUrls: ['./cause-modal.component.scss'],
  animations: fuseAnimations
})
export class CauseModalComponent implements OnInit {
  isEdit: boolean = false;
  cause: Cause;
  causeForm: FormGroup;
  causeStatuses: any[] = [
    { title: 'On process', value: 'On process' },
    { title: 'Revise', value: 'Revise' },
    { title: 'Completed', value: 'Completed' },
    { title: 'In Completed', value: 'In Completed' }
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
    public matDialogRef: MatDialogRef<CauseModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.cause = this.isEdit ? this.modalData.data : null;
    const sequenceNo = this.isEdit ? this.cause.sequenceNo : this.modalData.index;

    this.causeForm = this._formBuilder.group({
      sequenceNo: [{ value: sequenceNo, disabled: true }],
      causeTopic: [this.cause?.causeTopic || null, [Validators.required]],
      causeDescription: [this.cause?.causeDescription || null, null],
      causeStatus: [this.cause?.causeStatus || 'On process', [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): void {
    if (!this.causeForm.valid) {
      this.causeForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      this.matDialogRef.close(this.causeForm.getRawValue());
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

  isShowError() {
    return (this.showAlert && !this.causeForm.valid) || this.hasApiError;
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { ModalData, ModalMode } from 'app/modules/target-info/target-management/modals/modal.type';
import { Solution } from 'app/shared/interfaces/document.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-protect-modal',
  templateUrl: './protect-modal.component.html',
  styleUrls: ['./protect-modal.component.scss'],
  animations: fuseAnimations
})
export class ProtectModalComponent implements OnInit {
  protect: Solution;
  isEdit: boolean = false;
  protectForm: FormGroup;

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<ProtectModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.protect = this.isEdit ? this.modalData.data : null;
    const targetReferenceStatus = this.modalData.targetReferenceStatus;
    const sequenceNo = this.isEdit ? this.protect.sequenceNo : this.modalData.index;
    const finishDate = this.isEdit && this.protect.finishDate ? moment(this.protect.finishDate, 'YYYY-MM-DD') : moment();
    const actionDate = this.isEdit && this.protect.actionDate ? moment(this.protect.actionDate, 'YYYY-MM-DD') : null;

    this.protectForm = this._formBuilder.group({
      sequenceNo: [{ value: sequenceNo, disabled: true }],
      solutionTopic: [this.protect?.solutionTopic || null, [Validators.required]],
      userResponsibility: [this.protect?.userResponsibility || null, [Validators.required]],
      finishDate: [finishDate, [Validators.required]],
      solutionDescription: [{ value: this.protect?.solutionDescription || null, disabled: targetReferenceStatus !== 'SOLVE_INPROCESS' }, [Validators.required]],
      actionDate: [{ value: actionDate, disabled: targetReferenceStatus !== 'SOLVE_INPROCESS' }, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): void {
    if (!this.protectForm.valid) {
      this.protectForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      const protectForm = this.protectForm.getRawValue();
      this.matDialogRef.close({
        ...protectForm,
        finishDate: protectForm.finishDate.format('YYYY-MM-DD'),
        actionDate: protectForm.actionDate?.format('YYYY-MM-DD') || null
      })
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
    return (this.showAlert && !this.protectForm.valid) || this.hasApiError;
  }
}

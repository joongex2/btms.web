import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { ModalMode } from 'app/modules/target-info/target-management/modals/modal.type';
import { Solution } from 'app/shared/interfaces/document.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-fix-modal',
  templateUrl: './fix-modal.component.html',
  styleUrls: ['./fix-modal.component.scss'],
  animations: fuseAnimations
})
export class FixModalComponent implements OnInit {
  isEdit: boolean = false;
  fix: Solution;
  fixForm: FormGroup;

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<FixModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.fix = this.isEdit ? this.modalData.data : null;
    const targetReferenceStatus = this.modalData.targetReferenceStatus;
    const sequenceNo = this.isEdit ? this.fix.sequenceNo : this.modalData.index;
    const finishDate = this.isEdit ? moment(this.fix.finishDate, 'YYYY-MM-DD') : moment();
    const actionDate = this.isEdit ? moment(this.fix.actionDate, 'YYYY-MM-DD') : null;

    this.fixForm = this._formBuilder.group({
      sequenceNo: [{ value: sequenceNo, disabled: true }],
      solutionTopic: [this.fix?.solutionTopic || null, [Validators.required]],
      userResponsibility: [this.fix?.userResponsibility || null, [Validators.required]],
      finishDate: [finishDate, [Validators.required]],
      solutionDescription: [{ value: this.fix?.solutionDescription || null, disabled: targetReferenceStatus !== 'SOLVE_INPROCESS' }, [Validators.required]],
      actionDate: [{ value: actionDate, disabled: targetReferenceStatus !== 'SOLVE_INPROCESS' }, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): void {
    if (!this.fixForm.valid) {
      this.fixForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      const fixForm = this.fixForm.getRawValue();
      this.matDialogRef.close({
        ...fixForm,
        finishDate: fixForm.finishDate.format('YYYY-MM-DD'),
        actionDate: fixForm.actionDate?.format('YYYY-MM-DD') || null
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

  isShowError() {
    return (this.showAlert && !this.fixForm.valid) || this.hasApiError;
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import * as moment from 'moment';
import { ModalMode } from '../modal.type';

@Component({
  selector: 'app-plan-modal',
  templateUrl: './plan-modal.component.html',
  styleUrls: ['./plan-modal.component.scss'],
  animations: [fuseAnimations]
})
export class PlanModalComponent implements OnInit {
  isEdit: boolean = false;
  planForm: FormGroup;

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<PlanModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const priority = this.isEdit ? this.modalData.data.priority : this.modalData.index;
    const planDescription = this.isEdit ? this.modalData.data.planDescription : '';
    const planTargetDateSelect = this.isEdit ? moment(this.modalData.data.planTargetDate, 'YYYY-MM-DD') : moment();
    const resource = this.isEdit ? this.modalData.data.resource : '';
    const undertaker = this.isEdit ? this.modalData.data.undertaker : '';

    this.planForm = this._formBuilder.group({
      priority: [{ value: priority, disabled: true }, [Validators.required]],
      planDescription: [planDescription],
      planTargetDateSelect: [planTargetDateSelect],
      resource: [resource, [Validators.required]],
      undertaker: [undertaker]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): void {
    if (!this.planForm.valid) {
      this.planForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      const planForm = this.planForm.getRawValue();
      this.matDialogRef.close({
        ...planForm,
        planTargetDate: planForm.planTargetDateSelect.format('YYYY-MM-DD')
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
    return (this.showAlert && !this.planForm.valid) || this.hasApiError;
  }
}

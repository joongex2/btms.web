import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import * as moment from 'moment';
import { ModalMode } from '../modal.type';

@Component({
  selector: 'app-topic-modal',
  templateUrl: './topic-modal.component.html',
  styleUrls: ['./topic-modal.component.scss'],
  animations: fuseAnimations
})
export class TopicModalComponent implements OnInit {
  isEdit: boolean = false;
  topicForm: FormGroup;

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<TopicModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const priority = this.isEdit ? this.modalData.data.priority : this.modalData.index;
    const planDescription = this.isEdit ? this.modalData.data.planDescription : '';
    const planTargetDateSelect = this.isEdit ? (this.modalData.data.planTargetDate ? moment(this.modalData.data.planTargetDate, 'YYYY-MM-DD') : null) : moment();
    const resource = this.isEdit ? this.modalData.data.resource : '';
    const undertaker = this.isEdit ? this.modalData.data.undertaker : '';

    this.topicForm = this._formBuilder.group({
      priority: [{ value: priority, disabled: true }, [Validators.required]],
      planDescription: [planDescription],
      planTargetDateSelect: [planTargetDateSelect],
      resource: [resource, [Validators.required]],
      undertaker: [undertaker, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): void {
    if (!this.topicForm.valid) {
      this.topicForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      const topicForm = this.topicForm.getRawValue();
      this.matDialogRef.close({
        ...topicForm,
        planTargetDate: topicForm.planTargetDateSelect ? topicForm.planTargetDateSelect.format('YYYY-MM-DD'): null
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
    return (this.showAlert && !this.topicForm.valid) || this.hasApiError;
  }
}

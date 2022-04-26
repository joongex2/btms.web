import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumberString } from '../../tables/mock-table-data';
import { ModalData, ModalMode } from '../modal.type';
import * as moment from 'moment';

@Component({
  selector: 'app-plan-modal',
  templateUrl: './plan-modal.component.html',
  styleUrls: ['./plan-modal.component.scss']
})
export class PlanModalComponent implements OnInit {
  isEdit: boolean = false;
  planForm: FormGroup;

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
      return;
    }
    const planForm = this.planForm.getRawValue();
    this.matDialogRef.close({
      ...planForm,
      planTargetDate: planForm.planTargetDateSelect.format('YYYY-MM-DD')
    })
  }
}

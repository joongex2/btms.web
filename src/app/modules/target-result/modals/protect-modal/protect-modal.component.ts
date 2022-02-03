import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumber } from 'app/modules/super-admin/mock-super-admin-data';
import { ModalData, ModalMode } from 'app/modules/target-info/modals/modal.type';
import * as moment from 'moment';


@Component({
  selector: 'app-protect-modal',
  templateUrl: './protect-modal.component.html',
  styleUrls: ['./protect-modal.component.scss']
})
export class ProtectModalComponent implements OnInit {
  isEdit: boolean = false;
  protectForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<ProtectModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const protectNo = this.isEdit ? this.modalData.data.protectNo : genRandomNumber();
    const protectDetail = this.isEdit ? this.modalData.data.protectDetail : '';
    const protectOwner = this.isEdit ? this.modalData.data.protectOwner : '';
    const protectDueDateSelect = this.isEdit ? moment(this.modalData.data.protectDueDate, 'YYYY-MM-DD') : '';
    const protectFollow = this.isEdit ? this.modalData.data.protectFollow : '';
    const protectStartDateSelect = this.isEdit ? moment(this.modalData.data.protectStartDate, 'YYYY-MM-DD') : '';

    this.protectForm = this._formBuilder.group({
      protectNo: [protectNo, [Validators.required]],
      protectDetail: [protectDetail, [Validators.required]],
      protectOwner: [protectOwner, [Validators.required]],
      protectDueDateSelect: [protectDueDateSelect, [Validators.required]],
      protectFollow: [protectFollow, [Validators.required]],
      protectStartDateSelect: [protectStartDateSelect, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): void {
    const protectForm = this.protectForm.getRawValue();
    this.matDialogRef.close({
      ...protectForm,
      protectDueDate: protectForm.protectDueDateSelect.format('YYYY-MM-DD'),
      protectStartDate: protectForm.protectStartDateSelect.format('YYYY-MM-DD')
    })
  }
}

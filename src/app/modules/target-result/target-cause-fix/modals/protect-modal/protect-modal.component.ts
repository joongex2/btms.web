import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalData, ModalMode } from 'app/modules/target-info/target-management/modals/modal.type';
import { Solution } from 'app/shared/interfaces/document.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-protect-modal',
  templateUrl: './protect-modal.component.html',
  styleUrls: ['./protect-modal.component.scss']
})
export class ProtectModalComponent implements OnInit {
  protect: Solution;
  isEdit: boolean = false;
  protectForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<ProtectModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.protect = this.isEdit ? this.modalData.data : null;
    const sequenceNo = this.isEdit ? this.protect.sequenceNo : this.modalData.index;
    const finishDate = this.isEdit ? moment(this.protect.finishDate, 'YYYY-MM-DD') : moment();
    const actionDate = this.isEdit ? moment(this.protect.actionDate, 'YYYY-MM-DD') : moment();

    this.protectForm = this._formBuilder.group({
      sequenceNo: [{ value: sequenceNo, disabled: true }],
      solutionTopic: [this.protect?.solutionTopic || null, [Validators.required]],
      userResponsibility: [this.protect?.userResponsibility || null, [Validators.required]],
      finishDate: [finishDate, [Validators.required]],
      solutionDescription: [this.protect?.solutionDescription || null, [Validators.required]],
      actionDate: [actionDate, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): void {
    const protectForm = this.protectForm.getRawValue();
    this.matDialogRef.close({
      ...protectForm,
      finishDate: protectForm.finishDate.format('YYYY-MM-DD'),
      actionDate: protectForm.actionDate.format('YYYY-MM-DD')
    })
  }
}

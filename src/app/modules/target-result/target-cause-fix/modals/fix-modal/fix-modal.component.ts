import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalData, ModalMode } from 'app/modules/target-info/target-management/modals/modal.type';
import { Solution } from 'app/shared/interfaces/document.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-fix-modal',
  templateUrl: './fix-modal.component.html',
  styleUrls: ['./fix-modal.component.scss']
})
export class FixModalComponent implements OnInit {
  isEdit: boolean = false;
  fix: Solution;
  fixForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<FixModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.fix = this.isEdit ? this.modalData.data : null;
    const sequenceNo = this.isEdit ? this.fix.sequenceNo : this.modalData.index;
    const finishDate = this.isEdit ? moment(this.fix.finishDate, 'YYYY-MM-DD') : moment();
    const actionDate = this.isEdit ? moment(this.fix.actionDate, 'YYYY-MM-DD') : moment();

    this.fixForm = this._formBuilder.group({
      sequenceNo: [{ value: sequenceNo, disabled: true }],
      solutionTopic: [this.fix?.solutionTopic || null, [Validators.required]],
      userResponsibility: [this.fix?.userResponsibility || null, [Validators.required]],
      finishDate: [finishDate, [Validators.required]],
      solutionDescription: [this.fix?.solutionDescription || null, [Validators.required]],
      actionDate: [actionDate, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): void {
    const fixForm = this.fixForm.getRawValue();
    this.matDialogRef.close({
      ...fixForm,
      finishDate: fixForm.finishDate.format('YYYY-MM-DD'),
      actionDate: fixForm.actionDate.format('YYYY-MM-DD')
    });
  }
}

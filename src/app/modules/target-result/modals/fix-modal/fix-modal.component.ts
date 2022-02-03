import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumber } from 'app/modules/super-admin/mock-super-admin-data';
import { ModalData, ModalMode } from 'app/modules/target-info/modals/modal.type';
import * as moment from 'moment';


@Component({
  selector: 'app-fix-modal',
  templateUrl: './fix-modal.component.html',
  styleUrls: ['./fix-modal.component.scss']
})
export class FixModalComponent implements OnInit {
  isEdit: boolean = false;
  fixForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<FixModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const fixNo = this.isEdit ? this.modalData.data.fixNo : genRandomNumber();
    const fixDetail = this.isEdit ? this.modalData.data.fixDetail : '';
    const fixOwner = this.isEdit ? this.modalData.data.fixOwner : '';
    const fixDueDateSelect = this.isEdit ? moment(this.modalData.data.fixDueDate, 'YYYY-MM-DD') : moment();
    const fixFollow = this.isEdit ? this.modalData.data.fixFollow : '';
    const fixStartDateSelect = this.isEdit ? moment(this.modalData.data.fixStartDate, 'YYYY-MM-DD') : moment();

    this.fixForm = this._formBuilder.group({
      fixNo: [fixNo, [Validators.required]],
      fixDetail: [fixDetail, [Validators.required]],
      fixOwner: [fixOwner, [Validators.required]],
      fixDueDateSelect: [fixDueDateSelect, [Validators.required]],
      fixFollow: [fixFollow, [Validators.required]],
      fixStartDateSelect: [fixStartDateSelect, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): void {
    const fixForm = this.fixForm.getRawValue();
    this.matDialogRef.close({ 
      ...fixForm, 
      fixDueDate: fixForm.fixDueDateSelect.format('YYYY-MM-DD'),
      fixStartDate: fixForm.fixStartDateSelect.format('YYYY-MM-DD')
    });
  }
}

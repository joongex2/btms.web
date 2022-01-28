import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumber } from 'app/modules/super-admin/mock-super-admin-data';
import { ModalData, ModalMode } from 'app/modules/target-info/modals/modal.type';


@Component({
  selector: 'app-cause-modal',
  templateUrl: './cause-modal.component.html',
  styleUrls: ['./cause-modal.component.scss']
})
export class CauseModalComponent implements OnInit {
  isEdit: boolean = false;
  causeForm: FormGroup;
  causeStatuses: any[] = [
    { title: 'Completed', value: 'complete' },
    { title: 'Not Complete', value: 'notComplete' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<CauseModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const causeNo = this.isEdit ? this.modalData.data.causeNo : genRandomNumber();
    const causeDetail = this.isEdit ? this.modalData.data.causeDetail : '';
    const causeNote = this.isEdit ? this.modalData.data.causeNote : '';
    const causeStatus = this.isEdit ? this.modalData.data.causeStatus : '';

    this.causeForm = this._formBuilder.group({
      causeNo: [causeNo, [Validators.required]],
      causeDetail: [causeDetail, [Validators.required]],
      causeNote: [causeNote, [Validators.required]],
      causeStatus: [causeStatus, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

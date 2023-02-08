import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalData, ModalMode } from 'app/modules/target-info/target-management/modals/modal.type';
import { Cause } from 'app/shared/interfaces/document.interface';

@Component({
  selector: 'app-cause-modal',
  templateUrl: './cause-modal.component.html',
  styleUrls: ['./cause-modal.component.scss']
})
export class CauseModalComponent implements OnInit {
  isEdit: boolean = false;
  cause: Cause;
  causeForm: FormGroup;
  causeStatuses: any[] = [
    { title: 'On process', value: 'On process' },
    { title: 'Revise', value: 'Revise' },
    { title: 'Completed', value: 'Completed' },
    { title: 'In Completed', value: 'In Completed' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<CauseModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.cause = this.isEdit ? this.modalData.data.causeNo : null;
    const sequenceNo = this.isEdit ? this.cause.sequenceNo : this.modalData.index;

    this.causeForm = this._formBuilder.group({
      sequenceNo: [{ value: sequenceNo, disabled: true }],
      causeTopic: [this.cause?.causeTopic || null, [Validators.required]],
      causeDescription: [this.cause?.causeDescription || null, [Validators.required]],
      causeStatus: [this.cause?.causeStatus || null, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

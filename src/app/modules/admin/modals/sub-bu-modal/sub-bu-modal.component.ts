import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Status } from '../../admin.types';
import { genRandomNumber } from '../../mock-admin-data';
import { ModalData, ModalMode } from '../modal.types';



@Component({
  selector: 'app-sub-bu-modal',
  templateUrl: './sub-bu-modal.component.html',
  styleUrls: ['./sub-bu-modal.component.scss']
})
export class SubBuModalComponent implements OnInit {
  isEdit: boolean = false;
  subBuForm: FormGroup;
  statuses: any[] = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<SubBuModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const subBuCode = this.isEdit ? this.modalData.data.subBuCode : genRandomNumber();
    const subBuDescription = this.isEdit ? this.modalData.data.subBuDescription : '';
    const status = this.isEdit ? this.modalData.data.status : '';

    this.subBuForm = this._formBuilder.group({
      subBuCode: [subBuCode, [Validators.required]],
      subBuDescription: [subBuDescription, [Validators.required]],
      status: [status, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

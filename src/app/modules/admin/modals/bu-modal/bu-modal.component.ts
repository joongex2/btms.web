import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Status } from '../../admin.types';
import { genRandomNumber } from '../../mock-admin-data';
import { ModalData, ModalMode } from '../modal.types';



@Component({
  selector: 'app-bu-modal',
  templateUrl: './bu-modal.component.html',
  styleUrls: ['./bu-modal.component.scss']
})
export class BuModalComponent implements OnInit {
  isEdit: boolean = false;
  buForm: FormGroup;
  statuses: any[] = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<BuModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const buCode = this.isEdit ? this.modalData.data.buCode : genRandomNumber();
    const buDescription = this.isEdit ? this.modalData.data.buDescription : '';
    const status = this.isEdit ? this.modalData.data.status : '';

    this.buForm = this._formBuilder.group({
      buCode: [buCode, [Validators.required]],
      buDescription: [buDescription, [Validators.required]],
      status: [status, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

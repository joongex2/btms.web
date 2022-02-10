import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Status } from '../../admin.types';
import { genRandomNumber } from '../../mock-admin-data';
import { ModalData, ModalMode } from '../modal.types';



@Component({
  selector: 'app-division-modal',
  templateUrl: './division-modal.component.html',
  styleUrls: ['./division-modal.component.scss']
})
export class DivisionModalComponent implements OnInit {
  isEdit: boolean = false;
  divisionForm: FormGroup;
  statuses: any[] = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<DivisionModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const divisionCode = this.isEdit ? this.modalData.data.divisionCode : genRandomNumber();
    const divisionDescription = this.isEdit ? this.modalData.data.divisionDescription : '';
    const status = this.isEdit ? this.modalData.data.status : '';

    this.divisionForm = this._formBuilder.group({
      divisionCode: [divisionCode, [Validators.required]],
      divisionDescription: [divisionDescription, [Validators.required]],
      status: [status, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Status } from '../../admin.types';
import { genRandomNumber } from '../../mock-admin-data';
import { ModalData, ModalMode } from '../modal.types';



@Component({
  selector: 'app-plant-modal',
  templateUrl: './plant-modal.component.html',
  styleUrls: ['./plant-modal.component.scss']
})
export class PlantModalComponent implements OnInit {
  isEdit: boolean = false;
  plantForm: FormGroup;
  statuses: any[] = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<PlantModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const plantCode = this.isEdit ? this.modalData.data.plantCode : genRandomNumber();
    const plantDescription = this.isEdit ? this.modalData.data.plantDescription : '';
    const status = this.isEdit ? this.modalData.data.status : '';

    this.plantForm = this._formBuilder.group({
      plantCode: [plantCode, [Validators.required]],
      plantDescription: [plantDescription, [Validators.required]],
      status: [status, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

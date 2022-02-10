import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Status } from '../../admin.types';
import { genRandomNumber } from '../../mock-admin-data';
import { ModalData, ModalMode } from '../modal.types';



@Component({
  selector: 'app-department-modal',
  templateUrl: './department-modal.component.html',
  styleUrls: ['./department-modal.component.scss']
})
export class DepartmentModalComponent implements OnInit {
  isEdit: boolean = false;
  departmentForm: FormGroup;
  statuses: any[] = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<DepartmentModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const departmentCode = this.isEdit ? this.modalData.data.departmentCode : genRandomNumber();
    const departmentDescription = this.isEdit ? this.modalData.data.departmentDescription : '';
    const status = this.isEdit ? this.modalData.data.status : '';

    this.departmentForm = this._formBuilder.group({
      departmentCode: [departmentCode, [Validators.required]],
      departmentDescription: [departmentDescription, [Validators.required]],
      status: [status, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumber } from '../../mock-super-admin-data';
import { RoleStatus } from '../../super-admin.types';
import { ModalData, ModalMode } from '../modal.types';


@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss']
})
export class RoleModalComponent implements OnInit {
  isEdit: boolean = false;
  roleForm: FormGroup;
  statuses: any[] = [
    { title: 'Active', value: RoleStatus.ACTIVE },
    { title: 'Expired', value: RoleStatus.EXPIRED }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<RoleModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const roleCode = this.isEdit ? this.modalData.data.roleCode : genRandomNumber();
    const roleDescription = this.isEdit ? this.modalData.data.roleDescription : '';
    const sequence = this.isEdit ? this.modalData.data.sequence : '';
    const status = this.isEdit ? this.modalData.data.status : '';

    this.roleForm = this._formBuilder.group({
      roleCode: [roleCode, [Validators.required]],
      roleDescription: [roleDescription, [Validators.required]],
      sequence: [sequence, [Validators.required]],
      status: [status, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

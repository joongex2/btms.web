import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumber } from '../../mock-super-admin-data';
import { GroupStatus } from '../../super-admin.types';
import { ModalData, ModalMode } from '../modal.types';


@Component({
  selector: 'app-user-group-modal',
  templateUrl: './user-group-modal.component.html',
  styleUrls: ['./user-group-modal.component.scss']
})
export class UserGroupModalComponent implements OnInit {
  isEdit: boolean = false;
  userGroupForm: FormGroup;
  statuses: any[] = [
    { title: 'Active', value: GroupStatus.ACTIVE },
    { title: 'Expired', value: GroupStatus.EXPIRED }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<UserGroupModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const groupCode = this.isEdit ? this.modalData.data.groupCode : genRandomNumber();
    const groupDescription = this.isEdit ? this.modalData.data.groupDescription : '';
    const sequence = this.isEdit ? this.modalData.data.sequence : '';
    const status = this.isEdit ? this.modalData.data.status : '';

    this.userGroupForm = this._formBuilder.group({
      groupCode: [groupCode, [Validators.required]],
      groupDescription: [groupDescription, [Validators.required]],
      sequence: [sequence, [Validators.required]],
      status: [status, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

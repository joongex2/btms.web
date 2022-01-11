import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumber } from '../../mock-super-admin-data';
import { UserStatus } from '../../super-admin.types';
import { ModalData, ModalMode } from '../modal.types';


@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {
  isEdit: boolean = false;
  userForm: FormGroup;
  groups: any = [
    { title: '01', value: '01' },
    { title: '02', value: '02' },
    { title: '03', value: '03' },
    { title: '04', value: '04' },
    { title: '05', value: '05' },
    { title: '06', value: '06' }
  ];
  statuses: any[] = [
    { title: 'Active', value: UserStatus.ACTIVE },
    { title: 'Expired', value: UserStatus.EXPIRED }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<UserModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const userLogin = this.isEdit ? this.modalData.data.userLogin : genRandomNumber();
    const password = this.isEdit ? this.modalData.data.password : '';
    const userName = this.isEdit ? this.modalData.data.userName : '';
    const email = this.isEdit ? this.modalData.data.email : '';
    const group = this.isEdit ? this.modalData.data.group : '';
    const status = this.isEdit ? this.modalData.data.status : '';

    this.userForm = this._formBuilder.group({
      userLogin: [userLogin, [Validators.required]],
      password: [password, [Validators.required]],
      userName: [userName, [Validators.required]],
      email: [email, [Validators.required]],
      group: [group, [Validators.required]],
      status: [status, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

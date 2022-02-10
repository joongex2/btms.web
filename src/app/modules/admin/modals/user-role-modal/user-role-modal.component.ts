import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuperAdminService } from 'app/modules/super-admin/super-admin.service';
import { AdminService } from '../../admin.service';
import { Status } from '../../admin.types';
import { ModalData, ModalMode } from '../modal.types';



@Component({
  selector: 'app-user-role-modal',
  templateUrl: './user-role-modal.component.html',
  styleUrls: ['./user-role-modal.component.scss']
})
export class UserRoleModalComponent implements OnInit {
  isEdit: boolean = false;
  userRoleForm: FormGroup;
  roles: any[];
  users: any[];
  statuses: any[] = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<UserRoleModalComponent>,
    private _formBuilder: FormBuilder,
    private _adminService: AdminService,
    private _superAdminService: SuperAdminService
  ) { }

  ngOnInit(): void {
    this.roles = this._superAdminService.getRoles().map((role) => ({ title: role.roleDescription, value: role }));
    this.users = this._adminService.getUsers().map((user) => ({ title: user.userName, value: user }));

    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const user = this.isEdit ? this.modalData.data.user : undefined;
    const role = this.isEdit ? this.modalData.data.role : undefined;
    const status = this.isEdit ? this.modalData.data.status : '';

    this.userRoleForm = this._formBuilder.group({
      user: [user, [Validators.required]],
      role: [role, [Validators.required]],
      status: [status, [Validators.required]]
    });

    // disable user, role if in edit mode
    if (this.isEdit) {
      this.userRoleForm.get('user').disable();
      this.userRoleForm.get('role').disable();
    }
  }

  compareRoleCodeFn(obj1, obj2): boolean {
    if (obj1 && obj2) {
      return obj1['roleCode'] == obj2['roleCode'];
    } else {
      return false;
    }
  }

  compareUserLoginFn(obj1, obj2): boolean {
    if (obj1 && obj2) {
      return obj1['userLogin'] == obj2['userLogin'];
    } else {
      return false;
    }
  }

  close(): void {
    this.matDialogRef.close();
  }
}

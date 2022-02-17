import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Status } from 'app/modules/admin/admin.types';
import { SuperAdminService } from '../../super-admin.service';
import { ModalData, ModalMode } from '../modal.types';


@Component({
  selector: 'app-group-menu-modal',
  templateUrl: './group-menu-modal.component.html',
  styleUrls: ['./group-menu-modal.component.scss']
})
export class GroupMenuModalComponent implements OnInit {
  isEdit: boolean = false;
  groupMenuForm: FormGroup;
  groups: any[];
  menus: any[];
  statuses: any[] = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<GroupMenuModalComponent>,
    private _formBuilder: FormBuilder,
    private _superAdminService: SuperAdminService
  ) { }

  ngOnInit(): void {
    this.groups = this._superAdminService.getGroups().map((g) => ({ title: g.groupDescription, value: g }));
    this.menus = this._superAdminService.getMenus().map((m) => ({ title: m.menuTitle, value: m }));

    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const group = this.isEdit ? this.modalData.data.group : undefined;
    const menu = this.isEdit ? this.modalData.data.menu : undefined;
    const status = this.isEdit ? this.modalData.data.status : undefined;

    this.groupMenuForm = this._formBuilder.group({
      group: [group, [Validators.required]],
      menu: [menu, [Validators.required]],
      status: [status, [Validators.required]]
    });
  }

  compareGroupCodeFn(obj1, obj2): boolean {
    if (obj1 && obj2) {
      return obj1['groupCode'] == obj2['groupCode'];
    } else {
      return false;
    }
  }

  compareMenuIdFn(obj1, obj2): boolean {
    if (obj1 && obj2) {
      return obj1['menuId'] == obj2['menuId'];
    } else {
      return false;
    }
  }

  close(): void {
    this.matDialogRef.close();
  }
}

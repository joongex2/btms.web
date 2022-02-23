import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { firstValueFrom } from 'rxjs';
import { ModalData, ModalMode } from '../../../modals/modal.types';
import { UserGroupService } from '../../user-group.service';
import { UserGroup } from '../../user-group.types';


@Component({
  selector: 'user-group-modal',
  templateUrl: './user-group-modal.component.html',
  styleUrls: ['./user-group-modal.component.scss']
})
export class UserGroupModalComponent implements OnInit {
  isEdit: boolean = false;
  userGroup: UserGroup;
  userGroupForm: FormGroup;
  defaultMenu: FuseNavigationItem[];
  isActives: any[] = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<UserGroupModalComponent>,
    private _userGroupService: UserGroupService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.userGroup = this.isEdit ? this.modalData.data.userGroup : undefined;
    this.defaultMenu = this.isEdit ? JSON.parse(this.userGroup.menu) : JSON.parse(this.modalData.data.defaultMenu);
    const name = this.isEdit ? this.userGroup.name : '';
    const isActive = this.isEdit ? this.userGroup.isActive : false;

    const menuGroups = new FormArray([]);
    for (let menuGroup of this.defaultMenu) {
      const menus = new FormArray([]);
      for (let menu of menuGroup.children) {
        menus.push(this._formBuilder.group({
          id: menu.id,
          title: menu.title,
          check: menu.check
        }))
      }
      menuGroups.push(this._formBuilder.group({
        id: menuGroup.id,
        title: menuGroup.title,
        menus: menus
      }))
    }

    const menuGroupsIndex = menuGroups.length > 0 ? 0 : undefined;
    this.userGroupForm = this._formBuilder.group({
      name: [name, [Validators.required]],
      isActive: [isActive, [Validators.required]],
      menuGroupsIndex: [menuGroupsIndex],
      menuGroups
    });
  }

  createMenuString(): string {
    const newMenu = JSON.parse(JSON.stringify(this.defaultMenu));
    for (let groupMenu of this.userGroupForm.get('menuGroups')['controls']) {
      for (let menu of groupMenu.get('menus')['controls']) {
        this.findMenu(newMenu, groupMenu.get('id').value, menu.get('id').value).check = menu.get('check').value;
      }
    }
    return JSON.stringify(newMenu);
  }

  findMenu(defaultMenu: FuseNavigationItem[], groupMenuId: string, menuId: string) {
    const groupMenu = defaultMenu.find((gm) => gm.id == groupMenuId);
    const menu = groupMenu.children.find((m) => m.id == menuId);
    return menu;
  }

  async saveAndClose() {
    if (!this.userGroupForm.valid) {
      this.userGroupForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      this._fuseConfirmationService.open({
        title: 'ต้องการบันทึกข้อมูลใช่หรือไม่?',
        // message: 'ต้องการลบข้อมูลใช่หรือไม่',
        icon: { name: 'heroicons_outline:question-mark-circle', color: 'primary'},
        actions: { 
          confirm: { show: true, label: 'ตกลง', color: 'primary'},
          cancel: { show: true, label: 'ยกเลิก'}
        }
      }).afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            const menuString = this.createMenuString();
            if (this.isEdit) {
              await firstValueFrom(this._userGroupService.updateUserGroup(
                this.userGroup.id, 
                this.userGroupForm.get('name').value,
                menuString,
                this.userGroupForm.get('isActive').value
              ));
            } else {
              // add
              await firstValueFrom(this._userGroupService.createUserGroup(
                this.userGroupForm.get('name').value,
                menuString,
                this.userGroupForm.get('isActive').value
              ));
            }
            this.matDialogRef.close(true);
          } catch (e) {
            this.showError(e, true);
          }
        }
      });
    }
  }

  close(): void {
    this.matDialogRef.close();
  }

  showError(error: string, hasApiError?: boolean) {
    this.showAlert = true;
    this.alert = {
      type   : 'error',
      message: error
    };
    if (hasApiError) this.hasApiError = true;
  }

  isShowError() {
    return (this.showAlert && !this.userGroupForm.valid) || this.hasApiError;
  }
}

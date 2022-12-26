import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { ModalData, ModalMode } from 'app/shared/interfaces/modal.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { firstValueFrom } from 'rxjs';
import { UserGroupService } from '../../user-group.service';
import { UserGroup } from '../../user-group.types';



@Component({
  selector: 'user-group-modal',
  templateUrl: './user-group-modal.component.html',
  styleUrls: ['./user-group-modal.component.scss'],
  animations: fuseAnimations
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
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.userGroup = this.isEdit ? this.modalData.data.userGroup : undefined;
    this.defaultMenu = this.modalData.data.defaultMenu;
    const name = this.isEdit ? this.userGroup.name : '';
    const isActive = this.isEdit ? this.userGroup.isActive : false;

    const menuGroups = new FormArray([]);
    for (let menuGroup of this.defaultMenu) {
      const menus = new FormArray([]);
      for (let menu of menuGroup.children) {
        menus.push(this._formBuilder.group({
          id: menu.id,
          title: menu.title,
          check: this.isEdit ? (this.findMenu(this.userGroup.menus, menuGroup.id, menu.id)?.check || false) : menu.check
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

  createMenus(): any {
    const newMenu = JSON.parse(JSON.stringify(this.defaultMenu));
    for (let groupMenu of this.userGroupForm.get('menuGroups')['controls']) {
      for (let menu of groupMenu.get('menus')['controls']) {
        this.findMenu(newMenu, groupMenu.get('id').value, menu.get('id').value).check = menu.get('check').value;
      }
    }
    return newMenu;
  }

  findMenu(menu: FuseNavigationItem[], groupMenuId: string, menuId: string) {
    const groupMenu = menu.find((gm) => gm.id == groupMenuId);
    const _menu = groupMenu.children.find((m) => m.id == menuId);
    return _menu;
  }

  async saveAndClose() {
    if (!this.userGroupForm.valid) {
      this.userGroupForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      this._confirmationService.save().afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            const menus = this.createMenus();
            if (this.isEdit) {
              await firstValueFrom(this._userGroupService.updateUserGroup(
                this.userGroup.id,
                this.userGroupForm.get('name').value,
                menus,
                this.userGroupForm.get('isActive').value
              ));
            } else {
              // add
              await firstValueFrom(this._userGroupService.createUserGroup(
                this.userGroupForm.get('name').value,
                menus,
                this.userGroupForm.get('isActive').value
              ));
            }
            this._snackBarService.success();
            this.matDialogRef.close(true);
          } catch (e) {
            this._snackBarService.error();
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
      type: 'error',
      message: error
    };
    if (hasApiError) this.hasApiError = true;
  }

  isShowError() {
    return (this.showAlert && !this.userGroupForm.valid) || this.hasApiError;
  }
}

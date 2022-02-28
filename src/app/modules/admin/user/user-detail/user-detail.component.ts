import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { RoleService } from 'app/modules/super-admin/role/role.service';
import { UserGroupService } from 'app/modules/super-admin/user-group/user-group.service';
import { UserGroup } from 'app/modules/super-admin/user-group/user-group.types';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { firstValueFrom } from 'rxjs';
import { OrganizationService } from '../../organization/organization.service';
import { TreeChecklistComponent } from '../tree-check-list/tree-checklist';
import { UserService } from '../user.service';
import { User } from '../user.types';




@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  animations: fuseAnimations
})
export class UserDetailComponent implements OnInit {
  @ViewChild(NgForm) f: NgForm;
  @ViewChild(TreeChecklistComponent) tcl: TreeChecklistComponent;

  isEdit: boolean = true;
  id: number;
  user: User;
  userGroups: any[];
  isActives = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];
  defaultPageSize = 5;
  resultsLength = 0;

  // bind value
  username: string;
  name: string;
  email: string;
  selectedUserGroup: number;
  selectedIsActive: boolean;
  organizes: any;

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    private route: ActivatedRoute,
    private _userGroupService: UserGroupService,
    private _organizationService: OrganizationService,
    private _roleService: RoleService,
    private _userService: UserService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    // this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));

    this._userService.getUser(this.id).subscribe({
      next: (v: User) => {
        this.user = v;
        this.username = this.isEdit ? this.user.username : '';
        this.name = this.isEdit ? this.user.name : '';
        this.email = this.isEdit ? this.user.email : '';
        this.selectedUserGroup = this.isEdit ? this.user.groupId : undefined;
        this.selectedIsActive = this.isEdit ? this.user.isActive : undefined;
        this.organizes = this.isEdit ? this.user.organizes : [];
        this.tcl.setOrganizes(this.organizes);
      },
      error: (e) => console.error(e)
    });

    this._userGroupService.getUserGroups().subscribe({
      next: (v: UserGroup[]) => { this.userGroups = v.map((v) => ({ title: v.name, value: v.id })) },
      error: (e) => console.error(e)
    });
  }

  async save() {
    if (!this.f.valid) {
      this.f.control.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      this._confirmationService.save().afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            if (this.isEdit) {
              await firstValueFrom(this._userService.updateUser(
                this.user.id,
                this.name,
                this.email,
                this.selectedUserGroup,
                this.selectedIsActive,
                this.tcl.getOrganizes()
              ));
            } else {
              // add
              await firstValueFrom(this._userService.createUser(
                this.name,
                this.email,
                this.username,
                this.selectedUserGroup,
                this.selectedIsActive,
                this.tcl.getOrganizes(),
              ));
            }
            this._snackBarService.success();
          } catch (e) {
            this._snackBarService.error();
            this.showError(e, true);
          }
        }
      });
    }
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
    return (this.showAlert && !this.f.valid) || this.hasApiError;
  }
}

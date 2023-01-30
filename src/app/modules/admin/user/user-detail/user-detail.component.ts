import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService as CurrentUserService } from 'app/core/user/user.service';
import { User as CurrentUser } from 'app/core/user/user.types';
import { UserGroupService } from 'app/modules/super-admin/user-group/user-group.service';
import { UserGroup } from 'app/modules/super-admin/user-group/user-group.types';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { firstValueFrom } from 'rxjs';
import { OrgRoleTreeComponent } from '../org-role-tree/org-role-tree.component';
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
  @ViewChild(OrgRoleTreeComponent) orgRoleTree: OrgRoleTreeComponent;


  isEdit: boolean = true;
  id: number;
  user: User;
  currentUser: CurrentUser;
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
    private _location: Location,
    private _userGroupService: UserGroupService,
    private _userService: UserService,
    private _currentUserService: CurrentUserService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
  ) { }

  async ngOnInit(): Promise<void> {
    const routeId = this.route.snapshot.paramMap.get('id');
    this.currentUser = await firstValueFrom(this._currentUserService.user$);
    this.id = routeId ? parseInt(routeId) : null;
    this.isEdit = routeId ? true : false;

    if (this.isEdit) {
      this.loadUser(this.id);
    } else {
      this.username = '';
      this.name = '';
      this.email = '';
      this.selectedUserGroup = undefined;
      this.selectedIsActive = true;
      this.organizes = [];
    }

    this._userGroupService.getUserGroups().subscribe({
      next: (v: UserGroup[]) => {
        this.userGroups = v
          .filter((v) => { return !(this.currentUser.groupId !== 1 && [1, 2].includes(v.id)) })
          .map((v) => ({ title: v.name, value: v.id }))
      },
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
                this.orgRoleTree.getOutput()
              ));
            } else {
              // add
              await firstValueFrom(this._userService.createUser(
                this.name,
                this.email,
                this.username,
                this.selectedUserGroup,
                this.selectedIsActive,
                this.orgRoleTree.getOutput(),
              ));
            }
            this._snackBarService.success();
            this.loadUser(this.id);
          } catch (e) {
            this._snackBarService.error();
            this.showError(e.error, true);
            return;
          }
          this.hideError();
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

  hideError() {
    this.showAlert = false;
    this.hasApiError = false;
    this.alert = {
      type: 'success',
      message: ''
    };
  }

  isShowError() {
    return (this.showAlert && !this.f.valid) || this.hasApiError;
  }

  loadUser(id: number) {
    this._userService.getUser(id).subscribe({
      next: (v: User) => {
        this.user = v;
        this.username = this.user.username;
        this.name = this.user.name;
        this.email = this.user.email;
        this.selectedUserGroup = this.user.groupId;
        this.selectedIsActive = this.user.isActive;
        this.organizes = this.user.organizes;
      },
      error: (e) => console.error(e)
    });
  }

  back() {
    this._location.back();
  }
}

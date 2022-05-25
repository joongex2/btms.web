import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { UserGroupService } from 'app/modules/super-admin/user-group/user-group.service';
import { UserGroup } from 'app/modules/super-admin/user-group/user-group.types';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { UrlService } from 'app/shared/services/url.service';
import { AdminUserService } from '../admin-user.service';
import { AdminUser } from '../admin-user.types';




@Component({
  selector: 'admin-user-detail',
  templateUrl: './admin-user-detail.component.html',
  styleUrls: ['./admin-user-detail.component.scss'],
  animations: fuseAnimations
})
export class AdminUserDetailComponent implements OnInit {
  @ViewChild(NgForm) f: NgForm;
  previousUrl: string;

  isEdit: boolean = true;
  id: number;
  user: AdminUser;
  userGroups: any[];
  isActives = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];
  defaultPageSize = 5;
  resultsLength = 0;

  organizes: any[] = [];
  filteredOrganizes: any[] = [];
  selectedOrganize: any;
  organizeForm: FormArray;

  // bind value
  username: string;
  name: string;
  email: string;
  selectedUserGroup: number;
  selectedIsActive: boolean;

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _userGroupService: UserGroupService,
    private _userService: AdminUserService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _urlService: UrlService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
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
      // this.organizes = [];
    }

    this._userGroupService.getUserGroups().subscribe({
      next: (v: UserGroup[]) => { this.userGroups = v.map((v) => ({ title: v.name, value: v.id })) },
      error: (e) => console.error(e)
    });

    this._urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
    });

    const organizes = this.route.snapshot.data.organizes;
    this.organizes = organizes.map((org) => ({ title: org.organizeName, value: org.organizeCode }));
    this.filteredOrganizes = organizes.map((org) => ({ title: org.organizeName, value: org.organizeCode }));

    this.organizeForm = this._formBuilder.array([]);
    // if (this.isEdit) {
    for (let orgCode of ['org1', 'org2', 'org3']) {
      this.organizeForm.push(this._formBuilder.group({
        organizeCode: orgCode
      }));
    }
    // }
  }

  organizeFilter(value: any) {
    const filterValue = typeof value === 'string' ? value : value.title;
    this.filteredOrganizes = this.organizes.filter(v => v.title.toLowerCase().includes(filterValue.toLowerCase()));
  }

  displayFn(value: any): string {
    return value && value.title ? value.title : '';
  }

  addOrganize() {
    this.organizeForm.push(this._formBuilder.group({ organizeCode: this.selectedOrganize.value }));
  }

  removeOrganize(index: number) {
    this.organizeForm.removeAt(index);
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
            // TODO: wait for api
            if (this.isEdit) {
              // await firstValueFrom(this._userService.updateUser(
              //   this.user.id,
              //   this.name,
              //   this.email,
              //   this.selectedUserGroup,
              //   this.selectedIsActive,
              //   this.tcl.getOrganizes()
              // ));
            } else {
              // add
              // await firstValueFrom(this._userService.createUser(
              //   this.name,
              //   this.email,
              //   this.username,
              //   this.selectedUserGroup,
              //   this.selectedIsActive,
              //   this.tcl.getOrganizes(),
              // ));
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
      next: (v: AdminUser) => {
        this.user = v;
        this.username = this.user.username;
        this.name = this.user.name;
        this.email = this.user.email;
        this.selectedUserGroup = this.user.groupId;
        this.selectedIsActive = this.user.isActive;
        // this.organizes = this.user.organizes;
        // this.tcl.setOrganizes(this.organizes);
      },
      error: (e) => console.error(e)
    });
  }

  back() {
    if (!this.previousUrl.includes('/admin-user')) {
      this._router.navigate(['/super-admin/admin-user']);
    } else {
      this._location.back();
    }
  }
}

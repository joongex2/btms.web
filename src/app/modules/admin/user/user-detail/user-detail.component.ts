import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RoleService } from 'app/modules/super-admin/role/role.service';
import { Role } from 'app/modules/super-admin/role/role.types';
import { UserGroupService } from 'app/modules/super-admin/user-group/user-group.service';
import { UserGroup } from 'app/modules/super-admin/user-group/user-group.types';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { OrganizationService } from '../../organization/organization.service';
import { Organization } from '../../organization/organization.types';
import { UserService } from '../user.service';
import { User } from '../user.types';




@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  id: number;
  user: User;
  userGroups: any[];
  organizations: any[];
  roles: any[];
  isActives = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];
  defaultPageSize = 5;
  resultsLength = 0;

  // bind value
  selectedUserGroup: string;
  selectedOrganization: string;
  selectedRole: string;
  selectedIsActive: string;

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
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));

    this._userService.getUser(this.id).subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: (e) => console.error(e)
    });

    this._userGroupService.getUserGroups().subscribe({
      next: (v: UserGroup[]) => { this.userGroups = v.map((v) => ({ title: v.name, value: v.id })) },
      error: (e) => console.error(e)
    });

    this._organizationService.getOrganizations().subscribe({
      next: (v: Organization[]) => { this.organizations = v.map((v) => ({ title: v.name, value: v.id })) },
      error: (e) => console.error(e)
    });

    this._roleService.getRoles().subscribe({
      next: (v: Role[]) => { this.roles = v.map((v) => ({ title: v.name, value: v.id })) },
      error: (e) => console.error(e)
    });
  }

  search() {

  }

  clear() {
    this.selectedUserGroup = undefined;
    this.selectedOrganization = undefined;
    this.selectedRole = undefined;
    this.selectedIsActive = undefined;
  }

  // addUser(): void {
  //   const dialogRef = this._matDialog.open(UserModalComponent, {
  //     data: {
  //       mode: ModalMode.ADD,
  //       data: undefined
  //     }
  //   });
  //   dialogRef.afterClosed()
  //     .subscribe((master: Master) => {
  //       if (!master) return; // cancel
  //       // this.refreshTableSubject.next(true);
  //     });
  // }

  // editUser(element: User) {
  //   const dialogRef = this._matDialog.open(UserModalComponent, {
  //     data: {
  //       mode: ModalMode.EDIT,
  //       data: element
  //     }
  //   });
  //   dialogRef.afterClosed()
  //     .subscribe((isEdit: boolean) => {
  //       if (!isEdit) return; // cancel
  //       // this.refreshTableSubject.next(true);
  //     });
  // }

  // deleteUser(element: User) {
  //   this._confirmationService.delete().afterClosed().subscribe(async (result) => {
  //     if (result == 'confirmed') {
  //       this._userService.deleteUser(element.id).subscribe({
  //         next: (v) => {
  //           this._snackBarService.success();
  //           // this.refreshTableSubject.next(true);
  //         },
  //         error: (e) => {
  //           this._snackBarService.error();
  //           console.error(e);
  //         }
  //       });
  //     }
  //   });
  // }
}

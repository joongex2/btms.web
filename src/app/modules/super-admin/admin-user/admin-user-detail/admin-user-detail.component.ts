import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { UserGroupService } from 'app/modules/super-admin/user-group/user-group.service';
import { UserGroup } from 'app/modules/super-admin/user-group/user-group.types';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { UrlService } from 'app/shared/services/url.service';
import { firstValueFrom } from 'rxjs';
import { MasterService } from '../../master/master.service';
import { AdminUserService } from '../admin-user.service';
import { AdminUser } from '../admin-user.types';
import { AdminPermissionModalComponent } from '../modals/admin-permission-modal/admin-permission-modal.component';

export interface AdminPermission {
  id: number;
  businessUnitCode: string;
  subBusinessUnitCode: string;
  plantCode: string;
  isActive: boolean;
}

@Component({
  selector: 'admin-user-detail',
  templateUrl: './admin-user-detail.component.html',
  styleUrls: ['./admin-user-detail.component.scss'],
  animations: fuseAnimations
})
export class AdminUserDetailComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('f') f: NgForm;
  @ViewChild('adminPermissionForm') adminPermissionForm: NgForm;
  previousUrl: string;

  isEdit: boolean = true;
  id: number;
  user: AdminUser;
  userGroups: any[];
  isActives = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];
  defaultPageSize = 10;
  resultsLength = 0;
  organizes: any[] = [];

  bus: any[] = [];
  subBus: any[] = [];
  plants: any[] = [];
  selectedBu: string | any;
  selectedSubBu: string | any;
  selectedPlant: string | any;
  busMap: any[] = [];
  subBusMap: any[] = [];
  plantsMap: any[] = [];

  organizeForm: FormArray;

  // bind value
  dataSource: MatTableDataSource<AdminPermission> = new MatTableDataSource([]);
  username: string;
  name: string;
  email: string;
  selectedUserGroup: number;
  selectedIsActive: boolean;

  // table setting
  displayedColumns: string[] = [
    'businessUnitCode',
    'subBusinessUnitCode',
    'plantCode',
    'isActive',
    'editIcon'
  ];

  keyToColumnName: any = {
    'businessUnitCode': 'Business Unit',
    'subBusinessUnitCode': 'Sub-Business Unit',
    'plantCode': 'Plant',
    'isActive': 'Status'
  };

  notSortColumn: string[] = [
    'index',
    'editIcon'
  ];

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _userGroupService: UserGroupService,
    private _adminUserService: AdminUserService,
    private _masterService: MasterService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _urlService: UrlService,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    const routeId = this._activatedRoute.snapshot.paramMap.get('id');
    this.id = routeId ? parseInt(routeId) : null;
    this.isEdit = routeId ? true : false;

    if (this.isEdit) {
      this.loadUser(this.id);
    } else {
      this.username = '';
      this.name = '';
      this.email = '';
      this.selectedUserGroup = 2;
      this.selectedIsActive = true;
      // this.organizes = [];
    }

    this._userGroupService.getUserGroups().subscribe({
      next: (v: UserGroup[]) => {
        this.userGroups = v.map((v) => ({ title: v.name, value: v.id }))
      },
      error: (e) => console.error(e)
    });

    this._urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
    });
    this.bus = this._activatedRoute.snapshot.data.bus;

    // map
    this.busMap = this._activatedRoute.snapshot.data.bus;
    this.subBusMap = this._activatedRoute.snapshot.data.subBus;
    this.plantsMap = this._activatedRoute.snapshot.data.plants;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  addPermission(): void {
    if (!this.adminPermissionForm.form.valid) {
      this.adminPermissionForm.form.markAllAsTouched();
      this._confirmationService.warning('กรุณาเลือก bu');
    } else if (this.selectedPlant && !this.selectedSubBu) {
      this._confirmationService.warning('หากเลือก plant กรุณาเลือก sub bu ด้วย');
    } else {
      this.dataSource.data.push({
        id: 0,
        businessUnitCode: this.selectedBu.value,
        subBusinessUnitCode: this.selectedSubBu?.value || null,
        plantCode: this.selectedPlant?.value || null,
        isActive: true
      })
      this.dataSource.data = this.dataSource.data;

      // reset
      this.adminPermissionForm.form.get('bu').reset('');
      this.adminPermissionForm.form.get('subBu').reset('');
      this.subBus = [];
      this.adminPermissionForm.form.get('plant').reset('');
      this.plants = [];
    }
  }

  async editPermission(element: AdminPermission, index: number) {
    const bus = await firstValueFrom(this._masterService.getBus());

    const dialogRef = this._matDialog.open(AdminPermissionModalComponent, {
      data: {
        data: {
          adminPermission: element,
          bus
        }
      },
      autoFocus: false
    });
    dialogRef.afterClosed()
      .subscribe((adminPermission: AdminPermission) => {
        if (!adminPermission) return; // cancel
        this.dataSource.data[index] = adminPermission;
        this.dataSource.data = this.dataSource.data;
      });
  }

  deletePermission(element: AdminPermission, index: number) {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this.dataSource.data.splice(index, 1);
        this.dataSource.data = this.dataSource.data;
      }
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
            let res;
            if (this.isEdit) {
              // edit
              const organizes = this.dataSource.data.map(v => ({
                userId: this.id,
                id: v.id,
                businessUnitCode: v.businessUnitCode,
                subBusinessUnitCode: v.subBusinessUnitCode,
                plantCode: v.plantCode,
                isActive: v.isActive
              }));
              res = await firstValueFrom(this._adminUserService.updateAdminUser(
                this.user.id,
                this.name,
                this.email,
                this.username,
                this.selectedUserGroup,
                this.selectedIsActive,
                organizes
              ));
              if (res.didError) {
                this._confirmationService.warning(res.errorMessage);
              } else {
                this._snackBarService.success();
              }
            } else {
              // add
              const organizes = this.dataSource.data.map(v => ({
                userId: 0,
                businessUnitCode: v.businessUnitCode,
                subBusinessUnitCode: v.subBusinessUnitCode,
                plantCode: v.plantCode,
                isActive: v.isActive
              }));
              res = await firstValueFrom(this._adminUserService.createAdminUser(
                this.name,
                this.email,
                this.username,
                this.selectedUserGroup,
                this.selectedIsActive,
                organizes,
              ));
              if (res.didError) {
                this._confirmationService.warning(res.errorMessage);
              } else {
                const id = res?.id;
                if (id) this._router.navigate([`/super-admin/admin-user/${id}`]);
                this._snackBarService.success();
              }
            }
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
    this._adminUserService.getAdminUser(id).subscribe({
      next: (v: AdminUser) => {
        this.user = v;
        this.username = this.user.username;
        this.name = this.user.name;
        this.email = this.user.email;
        this.selectedUserGroup = this.user.groupId;
        this.selectedIsActive = this.user.isActive;
        this.dataSource.data = this.user.organizes;
        // this.organizes = this.user.organizes;
        // this.tcl.setOrganizes(this.organizes);
      },
      error: (e) => console.error(e)
    });
  }

  back() {
    if (!this.previousUrl || !this.previousUrl.includes('/admin-user')) {
      this._router.navigate(['/super-admin/admin-user']);
    } else {
      this._location.back();
    }
  }

  async buChange(bu: any) {
    if (typeof bu === 'string') {
      this.selectedSubBu = null;
      this.selectedPlant = null;
    } else {
      this.subBus = await firstValueFrom(this._masterService.getSubBus(bu.id));
    }
  }

  async subBuChange(subBu: any) {
    if (typeof subBu === 'string') {
      this.selectedPlant = null;
    } else {
      this.plants = await firstValueFrom(this._masterService.getPlants(subBu.id));
    }
  }
}

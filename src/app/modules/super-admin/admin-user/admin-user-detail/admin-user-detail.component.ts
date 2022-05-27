import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, NgForm, NgModel } from '@angular/forms';
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
import { AdminUserService } from '../admin-user.service';
import { AdminUser } from '../admin-user.types';
import { AdminPermissionModalComponent } from '../modals/admin-permission-modal/admin-permission-modal.component';


export interface AdminPermission {
  businessUnit: string;
  subBusinessUnit: string;
  plant: string;
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
  @ViewChild('bu') bu: NgModel;
  @ViewChild('subBu') subBu: NgModel;
  @ViewChild('plant') plant: NgModel;
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

  bus: any[] = [];
  subBus: any[] = [];
  plants: any[] = [];
  filteredBus: any[] = [];
  filteredSubBus: any[] = [];
  filteredPlants: any[] = [];
  selectedBu: string | any;
  selectedSubBu: string | any;
  selectedPlant: string | any;

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
    'businessUnit',
    'subBusinessUnit',
    'plant',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'businessUnit': 'Business Unit',
    'subBusinessUnit': 'Sub-Business Unit',
    'plant': 'Plant',
  };

  notSortColumn: string[] = [
    'index',
    'editIcon',
    'deleteIcon'
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
    private _userService: AdminUserService,
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
    const bus = this._activatedRoute.snapshot.data.bus;
    const subBus = this._activatedRoute.snapshot.data.subBus;
    const plants = this._activatedRoute.snapshot.data.plants;
    this.bus = bus.filter((master) => master.type == 'BUSINESS_UNIT').map((master) => ({ title: master.name, value: master.code }));
    this.filteredBus = bus.filter((master) => master.type == 'BUSINESS_UNIT').map((master) => ({ title: master.name, value: master.code }));
    this.subBus = subBus.filter((master) => master.type == 'SUB_BUSINESS_UNIT').map((master) => ({ title: master.name, value: master.code }));
    this.filteredSubBus = subBus.filter((master) => master.type == 'SUB_BUSINESS_UNIT').map((master) => ({ title: master.name, value: master.code }));
    this.plants = plants.filter((master) => master.type == 'PLANT').map((master) => ({ title: master.name, value: master.code }));
    this.filteredPlants = plants.filter((master) => master.type == 'PLANT').map((master) => ({ title: master.name, value: master.code }));
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  buFilter(value: any) {
    const filterValue = typeof value === 'string' ? value : value.title;
    this.filteredBus = this.bus.filter(v => v.title.toLowerCase().includes(filterValue.toLowerCase()));
  }

  subBuFilter(value: any) {
    const filterValue = typeof value === 'string' ? value : value.title;
    this.filteredSubBus = this.subBus.filter(v => v.title.toLowerCase().includes(filterValue.toLowerCase()));
  }

  plantFilter(value: any) {
    const filterValue = typeof value === 'string' ? value : value.title;
    this.filteredPlants = this.plants.filter(v => v.title.toLowerCase().includes(filterValue.toLowerCase()));
  }

  displayFn(value: any): string {
    return value && value.title ? value.title : '';
  }

  addPermission(): void {
    if (!this.adminPermissionForm.form.valid) {
      this.adminPermissionForm.form.markAllAsTouched();
      this._confirmationService.warning('กรุณาเลือก bu');
    } else if (this.selectedPlant && !this.selectedSubBu) {
      this._confirmationService.warning('หากเลือก plant กรุณาเลือก sub bu ด้วย');
    } else {
      this.dataSource.data.push({
        businessUnit: this.selectedBu.value,
        subBusinessUnit: this.selectedSubBu ? this.selectedSubBu.value : null,
        plant: this.selectedPlant ? this.selectedPlant.value : null
      })
      this.dataSource.data = this.dataSource.data;

      // reset
      this.bu.control.reset('');
      this.subBu.control.reset('');
      this.plant.control.reset('');
    }
  }

  editPermission(element: AdminPermission, index: number) {
    console.log('edit');
    const dialogRef = this._matDialog.open(AdminPermissionModalComponent, {
      data: {
        data: {
          adminPermission: element,
          bus: this.bus,
          subBus: this.subBus,
          plants: this.plants
        }
      }
    });
    dialogRef.afterClosed()
      .subscribe((adminPermission: AdminPermission) => {
        if (!adminPermission) return; // cancel
        this.dataSource.data[index] = adminPermission;
        this.dataSource.data = this.dataSource.data;
      });
  }

  deletePermission(element: AdminPermission, index: number) {
    console.log('delete');
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
    if (!this.previousUrl || !this.previousUrl.includes('/admin-user')) {
      this._router.navigate(['/super-admin/admin-user']);
    } else {
      this._location.back();
    }
  }
}

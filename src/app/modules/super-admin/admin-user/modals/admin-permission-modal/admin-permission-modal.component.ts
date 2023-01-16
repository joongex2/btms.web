import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { ModalData } from 'app/shared/interfaces/modal.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { AdminPermission } from '../../admin-user-detail/admin-user-detail.component';



@Component({
  selector: 'admin-permission-modal',
  templateUrl: './admin-permission-modal.component.html',
  styleUrls: ['./admin-permission-modal.component.scss'],
  animations: fuseAnimations
})
export class AdminPermissionModalComponent implements OnInit {
  @ViewChild('f') adminPermissionForm: NgForm;
  adminPermission: AdminPermission;

  bus: any[] = [];
  subBus: any[] = [];
  plants: any[] = [];
  isActives: any[] = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];
  selectedBu: string | any;
  selectedSubBu: string | any;
  selectedPlant: string | any;
  isActive = true;

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<AdminPermissionModalComponent>,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.adminPermission = this.modalData.data.adminPermission;
    this.bus = this.modalData.data.bus;
    this.subBus = this.modalData.data.subBus;
    this.plants = this.modalData.data.plants;
    this.selectedBu = this.bus.find(v => v.value === this.adminPermission.businessUnitCode);
    this.selectedSubBu = this.subBus.find(v => v.value === this.adminPermission.subBusinessUnitCode);
    this.selectedPlant = this.plants.find(v => v.value === this.adminPermission.plantCode);
    this.isActive = this.adminPermission.isActive;
  }

  async saveAndClose() {
    if (!this.adminPermissionForm.form.valid) {
      this.adminPermissionForm.form.markAllAsTouched();
      this._confirmationService.warning('กรุณาเลือก bu');
    } else if (this.selectedPlant && !this.selectedSubBu) {
      this._confirmationService.warning('หากเลือก plant กรุณาเลือก sub bu ด้วย');
    } else {
      this._confirmationService.save().afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            this._snackBarService.success();
            this.matDialogRef.close({
              id: this.adminPermission.id,
              businessUnitCode: this.selectedBu.value,
              subBusinessUnitCode: this.selectedSubBu ? this.selectedSubBu.value : null,
              plantCode: this.selectedPlant ? this.selectedPlant.value : null,
              isActive: this.isActive
            } as AdminPermission);
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
    return (this.showAlert && !this.adminPermissionForm.valid) || this.hasApiError;
  }
}

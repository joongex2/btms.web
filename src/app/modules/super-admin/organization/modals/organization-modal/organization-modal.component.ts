import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { requireMatchValidator } from 'app/shared/directives/require-match.directive';
import { ModalMode } from 'app/shared/interfaces/modal.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { firstValueFrom } from 'rxjs';
import { MasterService } from '../../../master/master.service';
import { OrganizationService } from '../../organization.service';
import { Organization } from '../../organization.types';




@Component({
  selector: 'organization-modal',
  templateUrl: './organization-modal.component.html',
  styleUrls: ['./organization-modal.component.scss'],
  animations: fuseAnimations
})
export class OrganizationModalComponent implements OnInit {
  isEdit: boolean = false;
  organization: Organization;
  organizationForm: FormGroup;
  businessUnitCodes: any[] = [];
  subBusinessUnitCodes: any[] = [];
  plantCodes: any[] = [];
  divisionCodes: any[] = [];
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
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<OrganizationModalComponent>,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _masterService: MasterService,
    private _organizationService: OrganizationService,
    private _formBuilder: FormBuilder
  ) { }

  async ngOnInit(): Promise<void> {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.organization = this.modalData.data;
    const organizeCode = this.isEdit ? this.organization.organizeCode : '';
    const organizeName = this.isEdit ? this.organization.organizeName : '';
    const isActive = this.isEdit ? this.organization.isActive : false;
    this.businessUnitCodes = this.modalData.bus;
    this.divisionCodes = this.modalData.divisions;

    this.organizationForm = this._formBuilder.group({
      organizeCode: [organizeCode, [Validators.required]],
      organizeName: [organizeName, [Validators.required]],
      businessUnitCode: [undefined, [Validators.required, requireMatchValidator]],
      subBusinessUnitCode: [undefined, [Validators.required, requireMatchValidator]],
      plantCode: [undefined, [Validators.required, requireMatchValidator]],
      divisionCode: [undefined, [Validators.required, requireMatchValidator]],
      isActive: [{ value: isActive, disabled: !this.isEdit }, [Validators.required]]
    });

    if (this.isEdit) {
      const businessUnitCode = this.businessUnitCodes.find(v => v.value === this.organization.businessUnitCode);
      this.subBusinessUnitCodes = await firstValueFrom(this._masterService.getSubBus(businessUnitCode.id));
      const subBusinessUnitCode = this.subBusinessUnitCodes.find(v => v.value === this.organization.subBusinessUnitCode);
      this.plantCodes = await firstValueFrom(this._masterService.getPlants(subBusinessUnitCode.id));
      const plantCode = this.plantCodes.find(v => v.value === this.organization.plantCode);
      const divisionCode = this.divisionCodes.find(v => v.value === this.organization.divisionCode);
      this.organizationForm.get('businessUnitCode').setValue(businessUnitCode);
      this.organizationForm.get('subBusinessUnitCode').setValue(subBusinessUnitCode);
      this.organizationForm.get('plantCode').setValue(plantCode);
      this.organizationForm.get('divisionCode').setValue(divisionCode);
    }

    this.organizationForm.get('businessUnitCode').valueChanges.subscribe(async (v) => {
      this.organizationForm.get('subBusinessUnitCode').reset(null, { emitEvent: false });
      this.organizationForm.get('plantCode').reset(null, { emitEvent: false });
      if (typeof v !== 'string') this.subBusinessUnitCodes = await firstValueFrom(this._masterService.getSubBus(v.id));
    });

    this.organizationForm.get('subBusinessUnitCode').valueChanges.subscribe(async (v) => {
      this.organizationForm.get('plantCode').reset(null, { emitEvent: false });
      if (typeof v !== 'string') this.plantCodes = await firstValueFrom(this._masterService.getPlants(v.id));
    })
  }

  async saveAndClose() {
    if (!this.organizationForm.valid) {
      this.organizationForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      this._confirmationService.save().afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            if (this.isEdit) {
              await firstValueFrom(this._organizationService.updateOrganization(
                this.organization.id,
                this.organizationForm.get('organizeCode').value,
                this.organizationForm.get('organizeName').value,
                this.organizationForm.get('businessUnitCode').value.value,
                this.organizationForm.get('subBusinessUnitCode').value.value,
                this.organizationForm.get('plantCode').value.value,
                this.organizationForm.get('divisionCode').value.value,
                this.organizationForm.get('isActive').value
              ));
            } else {
              // add
              await firstValueFrom(this._organizationService.createOrganization(
                this.organizationForm.get('organizeCode').value,
                this.organizationForm.get('organizeName').value,
                this.organizationForm.get('businessUnitCode').value.value,
                this.organizationForm.get('subBusinessUnitCode').value.value,
                this.organizationForm.get('plantCode').value.value,
                this.organizationForm.get('divisionCode').value.value,
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
    return (this.showAlert && !this.organizationForm.valid) || this.hasApiError;
  }
}

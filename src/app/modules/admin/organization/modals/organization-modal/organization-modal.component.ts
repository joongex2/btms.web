import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { ModalData, ModalMode } from 'app/shared/interfaces/modal.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { firstValueFrom } from 'rxjs';
import { MasterService } from '../../../master/master.service';
import { Master } from '../../../master/master.types';
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
  businessCodes: any[];
  subBusinessCodes: any[];
  plantCodes: any[];
  divisionCodes: any[];
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
    public matDialogRef: MatDialogRef<OrganizationModalComponent>,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _masterService: MasterService,
    private _organizationService: OrganizationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.organization = this.modalData.data;
    const code = this.isEdit ? this.organization.code : '';
    const name = this.isEdit ? this.organization.name : '';
    const isActive = this.isEdit ? this.organization.isActive : false;

    this.organizationForm = this._formBuilder.group({
      code: [code, [Validators.required]],
      name: [name, [Validators.required]],
      businessCode: [undefined, [Validators.required]],
      subBusinessCode: [undefined, [Validators.required]],
      plantCode: [undefined, [Validators.required]],
      divisionCode: [undefined, [Validators.required]],
      isActive: [{ value: isActive, disabled: !this.isEdit }, [Validators.required]]
    });

    this._masterService.getMasters().subscribe({
      next: (masters: Master[]) => {
        // TODO: not sure can load type from api
        this.businessCodes = masters.filter((master) => master.type == 'BNU').map((master) => ({ title: master.code, value: master.code }));
        this.subBusinessCodes = masters.filter((master) => master.type == 'SBU').map((master) => ({ title: master.code, value: master.code }));
        this.plantCodes = masters.filter((master) => master.type == 'PLT').map((master) => ({ title: master.code, value: master.code }));
        this.divisionCodes = masters.filter((master) => master.type == 'DIV').map((master) => ({ title: master.code, value: master.code }));
        const businessCode = this.isEdit ? this.organization.businessCode : undefined;
        const subBusinessCode = this.isEdit ? this.organization.subBusinessCode : undefined;
        const plantCode = this.isEdit ? this.organization.plantCode : undefined;
        const divisionCode = this.isEdit ? this.organization.divisionCode : undefined;
        this.organizationForm.get('businessCode').setValue(businessCode);
        this.organizationForm.get('subBusinessCode').setValue(subBusinessCode);
        this.organizationForm.get('plantCode').setValue(plantCode);
        this.organizationForm.get('divisionCode').setValue(divisionCode);
      },
      error: (e) => console.log(e)
    });
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
                this.organizationForm.get('code').value,
                this.organizationForm.get('name').value,
                this.organizationForm.get('businessCode').value,
                this.organizationForm.get('subBusinessCode').value,
                this.organizationForm.get('plantCode').value,
                this.organizationForm.get('divisionCode').value,
                this.organizationForm.get('isActive').value
              ));
            } else {
              // add
              await firstValueFrom(this._organizationService.createOrganization(
                this.organizationForm.get('code').value,
                this.organizationForm.get('name').value,
                this.organizationForm.get('businessCode').value,
                this.organizationForm.get('subBusinessCode').value,
                this.organizationForm.get('plantCode').value,
                this.organizationForm.get('divisionCode').value,
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

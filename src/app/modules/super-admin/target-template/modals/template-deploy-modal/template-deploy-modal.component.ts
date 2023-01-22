import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseLoadingService } from '@fuse/services/loading';
import { LookupModalComponent } from 'app/modules/super-admin/lookup/modals/lookup-modal/lookup-modal.component';
import { MasterService } from 'app/modules/super-admin/master/master.service';
import { Master } from 'app/modules/super-admin/master/master.types';
import { OrganizationService } from 'app/modules/super-admin/organization/organization.service';
import { Organization } from 'app/modules/super-admin/organization/organization.types';
import { FormErrorComponent } from 'app/shared/components/form-error/form-error.component';
import { requireMatchValidator } from 'app/shared/directives/require-match.directive';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { LookupService } from 'app/shared/services/lookup.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { DeployingModalComponent } from '../deploying-modal/deploying-modal.component';

@Component({
  selector: 'template-deploy-modal',
  templateUrl: './template-deploy-modal.component.html',
  styleUrls: ['./template-deploy-modal.component.scss']
})
export class TemplateDeployModalComponent implements OnInit {
  @ViewChild('filterOrgError') filterOrgError: FormErrorComponent;
  @ViewChild('deployError') deployError: FormErrorComponent;

  isEdit: boolean = false;
  templateId: number;
  filterOrganizeForm: FormGroup;
  deployForm: FormGroup;

  // select
  businessUnitCodes: any[] = [];
  subBusinessUnitCodes: any[] = [];
  plantCodes: any[] = [];
  divisionCodes: any[] = [];

  organizes: any[] = [];
  filterOrganizes: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<LookupModalComponent>,
    private _masterService: MasterService,
    private _organizeService: OrganizationService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _lookupService: LookupService,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private _fuseLoadingService: FuseLoadingService
  ) { }

  ngOnInit(): void {
    this.templateId = this.modalData.templateId;

    this.filterOrganizeForm = this._formBuilder.group({
      businessUnitCode: [null, [requireMatchValidator]],
      subBusinessUnitCode: [null, [requireMatchValidator]],
      plantCode: [null, [requireMatchValidator]],
      divisionCode: [null, [requireMatchValidator]]
    });

    this.deployForm = this._formBuilder.group({
      organizes: [null, [Validators.required]]
    })

    this._masterService.getMasters().subscribe({
      next: (masters: Master[]) => {
        this.businessUnitCodes = masters.filter((master) => master.type == 'BUSINESS_UNIT').map((master) => ({ title: master.code, value: master.code }));
        this.subBusinessUnitCodes = masters.filter((master) => master.type == 'SUB_BUSINESS_UNIT').map((master) => ({ title: master.code, value: master.code }));
        this.plantCodes = masters.filter((master) => master.type == 'PLANT').map((master) => ({ title: master.code, value: master.code }));
        this.divisionCodes = masters.filter((master) => master.type == 'DIVISION').map((master) => ({ title: master.code, value: master.code }));
      }
    });

    this._organizeService.getOrganizations().subscribe({
      next: (organizes: Organization[]) => {
        this.organizes = organizes.map(v => ({ ...v, title: `${v.organizeCode}: ${v.organizeName}`, value: v.organizeCode }));
        this.filterOrganizes = [...this.organizes];
      }
    })
  }

  filterOrganize() {
    if (!this.filterOrganizeForm.valid) {
      this.filterOrganizeForm.markAllAsTouched();
      this.filterOrgError.showError('กรุณาใส่ข้อมูลให้ถูกต้อง');
      return;
    } else {
      const businessUnitCode = this.filterOrganizeForm.get('businessUnitCode').value?.value;
      const subBusinessUnitCode = this.filterOrganizeForm.get('subBusinessUnitCode').value?.value;
      const plantCode = this.filterOrganizeForm.get('plantCode').value?.value;
      const divisionCode = this.filterOrganizeForm.get('divisionCode').value?.value;
      // delay
      this._fuseLoadingService.show();
      setTimeout(() => {
        this.filterOrganizes = this.organizes.filter(v =>
          (!businessUnitCode || v.businessUnitCode === businessUnitCode) &&
          (!subBusinessUnitCode || v.subBusinessUnitCode === subBusinessUnitCode) &&
          (!plantCode || v.plantCode === plantCode) &&
          (!divisionCode || v.divisionCode === divisionCode)
        );
        this._fuseLoadingService.hide();
      }, 1000);
    }
  }

  reset() {
    // delay
    this._fuseLoadingService.show();
    setTimeout(() => {
      this.filterOrganizeForm.get('businessUnitCode').reset();
      this.filterOrganizeForm.get('subBusinessUnitCode').reset();
      this.filterOrganizeForm.get('plantCode').reset();
      this.filterOrganizeForm.get('divisionCode').reset();
      this.filterOrganizes = [...this.organizes];
      this._fuseLoadingService.hide();
    }, 500);
  }

  async deploy() {
    if (!this.deployForm.valid) {
      this.deployForm.markAllAsTouched();
      this.deployError.showError('กรุณาเลือกอย่างน้อย 1 organize');
      return;
    } else {
      this._confirmationService.save('ยินยัน', 'ต้องการสร้าง document จาก template ที่เลือกใช่หรือไม่?').afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          const dialogRef = this._matDialog.open(DeployingModalComponent, {
            data: {
              organizes: this.deployForm.get('organizes').value.map(v => v.value)
            },
            disableClose: true
          });
        }
      });
    }
  }

  close(): void {
    this.matDialogRef.close();
  }


}

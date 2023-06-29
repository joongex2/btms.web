import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseLoadingService } from '@fuse/services/loading';
import { FormErrorComponent } from 'app/shared/components/form-error/form-error.component';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { LookupService } from 'app/shared/services/lookup.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { UrlService } from 'app/shared/services/url.service';
import { MasterService } from '../../master/master.service';
import { Master } from '../../master/master.types';
import { OrganizationService } from '../../organization/organization.service';
import { Organization } from '../../organization/organization.types';
import { TemplateDeployModalComponent } from '../modals/template-deploy-modal/template-deploy-modal.component';
import { TargetTemplate } from '../target-template.interface';
import { TargetTemplateService } from '../target-template.service';

@Component({
  selector: 'target-deploy',
  templateUrl: './target-deploy.component.html',
  styleUrls: ['./target-deploy.component.scss']
})
export class TargetDeployComponent implements OnInit {
  @ViewChild('filterOrgError') filterOrgError: FormErrorComponent;
  @ViewChild('deployError') deployError: FormErrorComponent;
  templateId: number;
  targetTemplate: TargetTemplate;
  filterOrganizeForm: FormGroup;
  deployForm: FormGroup;
  previousUrl: string;

  // select
  businessUnitCodes: any[] = [];
  subBusinessUnitCodes: any[] = [];
  plantCodes: any[] = [];
  divisionCodes: any[] = [];

  organizes: any[] = [];
  filterOrganizes: any[] = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _masterService: MasterService,
    private _organizeService: OrganizationService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _lookupService: LookupService,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private _fuseLoadingService: FuseLoadingService,
    private _urlService: UrlService,
    private _router: Router,
    private _location: Location,
    private _targetTemplateService: TargetTemplateService
  ) { }

  ngOnInit(): void {
    let routeId = this._activatedRoute.snapshot.paramMap.get('id') as any;
    this.templateId = parseInt(routeId);
    this.loadTargetTemplate(this.templateId);

    this._urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
    });

    this.filterOrganizeForm = this._formBuilder.group({
      businessUnitCode: [null],
      subBusinessUnitCode: [null],
      plantCode: [null],
      divisionCode: [null]
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
        this.organizes = organizes.map(v => ({ ...v, title: `${v.organizeCode}: ${v.organizeName}`, value: v.id }));
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

  loadTargetTemplate(id: number) {
    this._targetTemplateService.getTargetTemplate(id).subscribe({
      next: (targetTemplate: TargetTemplate) => {
        this.targetTemplate = targetTemplate;
      },
      error: (e) => console.error(e)
    });
  }

  async deploy() {
    if (!this.deployForm.valid) {
      this.deployForm.markAllAsTouched();
      this.deployError.showError('กรุณาเลือกอย่างน้อย 1 organize');
      return;
    } else {
      this._confirmationService.save('ยินยัน', 'ต้องการสร้าง document จาก template ที่เลือกใช่หรือไม่?').afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          const dialogRef = this._matDialog.open(TemplateDeployModalComponent, {
            data: {
              templateId: this.templateId,
              organizes: this.deployForm.get('organizes').value.map(v => v.value)
            },
            disableClose: true
          });
        }
      });
    }
  }

  goBack() {
    if (!this.previousUrl
      || this.previousUrl.includes('redirectURL')
      || !this.previousUrl.includes('/super-admin/target-template')
    ) {
      // if from refresh/ redirect or other page -> check from current url
      this._router.navigate(['/super-admin/target-template'])
    } else {
      this._location.back();
    }
  }
}
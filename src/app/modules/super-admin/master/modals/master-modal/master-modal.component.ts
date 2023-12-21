import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { getOptionValue } from 'app/shared/helpers/get-option-value';
import { ModalMode } from 'app/shared/interfaces/modal.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { firstValueFrom } from 'rxjs';
import { MasterService } from '../../master.service';
import { Master } from '../../master.types';

@Component({
  selector: 'master-modal',
  templateUrl: './master-modal.component.html',
  styleUrls: ['./master-modal.component.scss'],
  animations: fuseAnimations
})
export class MasterModalComponent implements OnInit {
  isEdit: boolean = false;
  master: Master;
  masterForm: FormGroup;
  types: any[];
  isActives: any[] = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];
  organizeGroups: any[] = [];
  bus: any[] = [];
  subBus: any[] = [];

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<MasterModalComponent>,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _masterService: MasterService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.master = this.modalData.data;
    this.bus = this.modalData.bus;
    this.subBus = this.modalData.subBus;
    if (this.isEdit) {
      if (this.master.type === 'SUB_BUSINESS_UNIT') {
        this.organizeGroups = this.bus;
      } else if (this.master.type === 'PLANT') {
        this.organizeGroups = this.subBus;
      }
    }
    const type = this.isEdit ? this.master.type : undefined;
    const organizeGroup = this.isEdit ? this.organizeGroups.find(v => v.value === this.master.parentId) : null;
    const code = this.isEdit ? this.master.code : '';
    const name = this.isEdit ? this.master.name : '';
    const displaySequence = this.isEdit ? this.master.displaySequence : 1;
    const isActive = this.isEdit ? this.master.isActive : false;
    const organizeGroupValidators = this.isEdit && ['SUB_BUSINESS_UNIT', 'PLANT'].includes(this.master.type) ? [Validators.required] : [];

    this.masterForm = this._formBuilder.group({
      type: [type, [Validators.required]],
      organizeGroup: [organizeGroup, organizeGroupValidators],
      code: [code, [Validators.required]],
      name: [name, [Validators.required]],
      displaySequence: [displaySequence, [Validators.required]],
      isActive: [{ value: isActive, disabled: !this.isEdit }, [Validators.required]]
    });

    this._masterService.getMasterTypes().subscribe({
      next: (types: any[]) => this.types = types.map((type) => ({ title: type.name, value: type.type })),
      error: (e) => console.log(e)
    });

    this.masterForm.get('type').valueChanges.subscribe((type) => {
      this.masterForm.get('organizeGroup').reset();
      if (type === 'BUSINESS_UNIT') {
        this.organizeGroups = [];
        this.masterForm.get('organizeGroup').clearValidators();
        this.masterForm.get('organizeGroup').setValue(0);
      } else if (type === 'SUB_BUSINESS_UNIT') {
        this.organizeGroups = this.bus;
        this.masterForm.get('organizeGroup').addValidators(Validators.required);
      } else if (type === 'PLANT') {
        this.organizeGroups = this.subBus;
        this.masterForm.get('organizeGroup').addValidators(Validators.required);
      } else if (type === 'DIVISION') {
        this.organizeGroups = [];
        this.masterForm.get('organizeGroup').clearValidators();
        this.masterForm.get('organizeGroup').setValue(null);
      }
      this.masterForm.get('organizeGroup').updateValueAndValidity();
    });
  }

  async saveAndClose() {
    if (!this.masterForm.valid) {
      this.masterForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      this._confirmationService.save().afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          let organizeGroup = this.masterForm.get('organizeGroup').value;
          organizeGroup = organizeGroup ? getOptionValue(organizeGroup) : organizeGroup;
          try {
            if (this.isEdit) {
              await firstValueFrom(this._masterService.updateMaster(
                this.master.id,
                this.masterForm.get('type').value,
                this.masterForm.get('code').value,
                this.masterForm.get('name').value,
                organizeGroup,
                this.masterForm.get('displaySequence').value,
                this.masterForm.get('isActive').value
              ));
            } else {
              // add
              await firstValueFrom(this._masterService.createMaster(
                this.masterForm.get('type').value,
                this.masterForm.get('code').value,
                this.masterForm.get('name').value,
                organizeGroup,
                this.masterForm.get('displaySequence').value
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
    return (this.showAlert && !this.masterForm.valid) || this.hasApiError;
  }
}

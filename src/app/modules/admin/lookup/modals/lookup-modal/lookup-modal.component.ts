import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { ModalData, ModalMode } from 'app/shared/interfaces/modal.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { LookupService } from 'app/shared/services/lookup.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { firstValueFrom } from 'rxjs';
import { Lookup } from '../../lookup.interface';



@Component({
  selector: 'lookup-modal',
  templateUrl: './lookup-modal.component.html',
  styleUrls: ['./lookup-modal.component.scss'],
  animations: fuseAnimations
})
export class LookupModalComponent implements OnInit {
  isEdit: boolean = false;
  lookup: Lookup;
  lookupForm: FormGroup;
  types: any[];
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
    public matDialogRef: MatDialogRef<LookupModalComponent>,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _lookupService: LookupService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.lookup = this.modalData.data;
    const lookupType = this.isEdit ? this.lookup.lookupType : undefined;
    const lookupCode = this.isEdit ? this.lookup.lookupCode : '';
    const lookupDescription = this.isEdit ? this.lookup.lookupDescription : '';
    const lookupSequence = this.isEdit ? this.lookup.lookupSequence : '';
    const isActive = this.isEdit ? this.lookup.isActive : false;

    this.lookupForm = this._formBuilder.group({
      lookupType: [lookupType, [Validators.required]],
      lookupCode: [lookupCode, [Validators.required]],
      lookupDescription: [lookupDescription, [Validators.required]],
      lookupSequence: [lookupSequence, [Validators.required]],
      isActive: [isActive, [Validators.required]]
    });

    this._lookupService.getLookupTypes().subscribe({
      next: (types: any[]) => this.types = types.map((type) => ({ title: type, value: type })),
      error: (e) => console.log(e)
    });
  }

  async saveAndClose() {
    if (!this.lookupForm.valid) {
      this.lookupForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      this._confirmationService.save().afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            if (this.isEdit) {
              await firstValueFrom(this._lookupService.updateLookup(
                this.lookup.id,
                this.lookupForm.get('lookupType').value,
                this.lookupForm.get('lookupCode').value,
                this.lookupForm.get('lookupDescription').value,
                this.lookupForm.get('lookupSequence').value,
                this.lookupForm.get('isActive').value
              ));
            } else {
              // add
              await firstValueFrom(this._lookupService.createLookup(
                this.lookupForm.get('lookupType').value,
                this.lookupForm.get('lookupCode').value,
                this.lookupForm.get('lookupDescription').value,
                this.lookupForm.get('lookupSequence').value,
                this.lookupForm.get('isActive').value
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
    return (this.showAlert && !this.lookupForm.valid) || this.hasApiError;
  }
}

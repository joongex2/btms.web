import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { firstValueFrom } from 'rxjs';
import { ModalData, ModalMode } from '../../../modals/modal.types';
import { RoleService } from '../../role.service';
import { Role } from '../../role.types';


@Component({
  selector: 'role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss'],
  animations: fuseAnimations
})
export class RoleModalComponent implements OnInit {
  isEdit: boolean = false;
  role: Role;
  roleForm: FormGroup;
  isActives: any[] = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];
  workflowStatuses: any[];

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<RoleModalComponent>,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _roleService: RoleService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this._roleService.getWorkflowStatuses().subscribe({
      next: (v: any[]) => { this.workflowStatuses = v.map((v) => ({ title: v.key, value: v.value })) },
      error: (e) => console.error(e)
    });

    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.role = this.modalData.data;
    const code = this.isEdit ? this.role.code : '';
    const name = this.isEdit ? this.role.name : '';
    const isActive = this.isEdit ? this.role.isActive : false;
    const defaultWorkflowStatuses = this.isEdit ? this.role.workflowStatuses : [];
    const workflowStatuses = new FormArray([]);
    for (let wf of defaultWorkflowStatuses) {
      workflowStatuses.push(this._formBuilder.group({
        workflowStatus: wf.workflowStatus,
        isActive: true
      }))
    }

    this.roleForm = this._formBuilder.group({
      code: [{ value: code, disabled: this.isEdit }, [Validators.required]],
      name: [name, [Validators.required]],
      isActive: [{ value: isActive, disabled: !this.isEdit }, [Validators.required]],
      selectedWorkflowStatus: [undefined],
      workflowStatuses
    });
  }

  addWorkflowStatus() {
    const wfArray = this.roleForm.get('workflowStatuses').value;
    const selectedWorkflowStatus = this.roleForm.get('selectedWorkflowStatus').value;
    if (wfArray.find((wf) => wf.workflowStatus == selectedWorkflowStatus)) {
      this.showError('ไม่สามารถเพิ่ม Workflow Status ซ้ำ');
      return;
    } else {
      if (this.alert.message == 'ไม่สามารถเพิ่ม Workflow Status ซ้ำ') this.hideError();
    }
    (this.roleForm.get('workflowStatuses') as FormArray).push(this._formBuilder.group({
      workflowStatus: selectedWorkflowStatus,
      isActive: true
    }));
  }

  deleteWorkflowStatus(index: number) {
    (this.roleForm.get('workflowStatuses') as FormArray).removeAt(index);
  }

  async saveAndClose() {
    if (!this.roleForm.valid) {
      this.roleForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      this._confirmationService.save().afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          try {
            if (this.isEdit) {
              await firstValueFrom(this._roleService.updateRole(
                this.role.id,
                this.roleForm.get('name').value,
                this.roleForm.get('isActive').value,
                this.roleForm.get('workflowStatuses').value
              ));
            } else {
              // add
              await firstValueFrom(this._roleService.createRole(
                this.roleForm.get('code').value,
                this.roleForm.get('name').value,
                this.roleForm.get('workflowStatuses').value
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

  hideError() {
    this.showAlert = false;
    this.alert = undefined;
  }

  isShowError() {
    return (this.showAlert && !this.roleForm.valid) || this.hasApiError;
  }
}

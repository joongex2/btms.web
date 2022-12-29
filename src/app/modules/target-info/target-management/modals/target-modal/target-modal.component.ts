import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { ModalMode } from '../modal.type';

@Component({
  selector: 'app-target-modal',
  templateUrl: './target-modal.component.html',
  styleUrls: ['./target-modal.component.scss'],
  animations: fuseAnimations
})
export class TargetModalComponent implements OnInit {
  isEdit: boolean = false;
  targetForm: FormGroup;
  targetTypes: any[];
  standards: any[];
  relativeTargets: any[];

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<TargetModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.targetTypes = this.modalData.targetTypes;
    this.standards = this.modalData.standards;
    this.relativeTargets = this.modalData.kpiMissions;

    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const priority = this.isEdit ? this.modalData.data.priority : this.modalData.index;
    const targetName = this.isEdit ? this.modalData.data.targetName : '';
    const targetType = this.isEdit ? this.modalData.data.targetType : '';
    const standard = this.isEdit ? this.modalData.data.standard : '';
    // const targetMission = this.isEdit ? this.modalData.data.targetMission : '';

    this.targetForm = this._formBuilder.group({
      priority: [{ value: priority, disabled: true }, [Validators.required]],
      targetName: [targetName, [Validators.required]],
      targetType: [targetType, [Validators.required]],
      standard: [standard, [Validators.required]],
      // targetMission: [targetMission, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): void {
    if (!this.targetForm.valid) {
      this.targetForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      this.matDialogRef.close(this.targetForm.getRawValue());
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

  isShowError() {
    return (this.showAlert && !this.targetForm.valid) || this.hasApiError;
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ModalMode } from '../modal.type';

@Component({
  selector: 'app-sub-target-modal',
  templateUrl: './sub-target-modal.component.html',
  styleUrls: ['./sub-target-modal.component.scss'],
  animations: [fuseAnimations]
})
export class SubTargetModalComponent implements OnInit {
  isEdit: boolean = false;
  subTargetForm: FormGroup;
  symbols: any[] = [
    { title: '>', value: '>' },
    { title: '<', value: '<' },
    { title: '>=', value: '>=' },
    { title: '<=', value: '<=' },
    { title: '=', value: '=' }
  ];
  measureTypes: any[] = [
    { title: 'เชิงปริมาณ', value: '1' },
    { title: 'เชิงคุณภาพ', value: '2' }
  ];
  resultColors: any[] = [
    { title: 'RED', value: 'RED' },
    { title: 'YELLOW', value: 'YELLOW' },
    { title: 'GREEN', value: 'GREEN' },
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
    public matDialogRef: MatDialogRef<SubTargetModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const priority = this.isEdit ? this.modalData.data.priority : this.modalData.index;
    const measureType = this.isEdit ? this.modalData.data.measureType : '';
    const targetDetailDescription = this.isEdit ? this.modalData.data.targetDetailDescription : '';
    const targetIndex = this.isEdit ? this.modalData.data.targetIndex : '';
    const targetValue = this.isEdit ? this.modalData.data.targetValue : '';
    const targetCondition = this.isEdit ? this.modalData.data.targetCondition : '1';
    const conditions = this._formBuilder.array([]);
    if (this.isEdit) {
      for (let tc of this.modalData.data.conditions) {
        conditions.push(this._formBuilder.group({
          id: [tc.id],
          targetDetailId: [tc.targetDetailId],
          targetCondition: [tc.targetCondition],
          targetOperator: [tc.targetOperator, [Validators.required]],
          targetValue: [tc.targetValue, [Validators.required]],
          resultColor: [tc.resultColor, [Validators.required]],
          isActive: [tc.isActive],
          markForEdit: [tc.markForEdit],
          markForDelete: [tc.markForDelete],
        }));
      }
      if (targetCondition === '1' && !this.modalData.data.conditions.find(v => v.targetCondition === '1')) {
        conditions.push(this.newCondition('1'));
      }
    } else {
      conditions.push(this.newCondition('1'));
    }
    const targetUnit = this.isEdit ? this.modalData.data.targetUnit : '';
    const currentTarget = this.isEdit ? this.modalData.data.currentTarget : '';
    const targetReferenceValue = this.isEdit ? this.modalData.data.targetReferenceValue : '';
    const startDate = this.isEdit ? moment({ year: this.modalData.data.startYear, month: this.modalData.data.startMonth }) : moment();
    const finishDate = this.isEdit ? moment({ year: this.modalData.data.finishYear, month: this.modalData.data.finishMonth }) : moment();
    const isCritical = this.isEdit ? this.modalData.data.isCritical : false;

    this.subTargetForm = this._formBuilder.group({
      priority: [{ value: priority, disabled: true }, [Validators.required]],
      measureType: [measureType, [Validators.required]],
      targetDetailDescription: [targetDetailDescription, [Validators.required]],
      targetIndex: [targetIndex, [Validators.required]],
      targetValue: [targetValue, [Validators.required]],
      targetCondition: [targetCondition],
      conditions: conditions,
      targetUnit: [targetUnit, [Validators.required]],
      currentTarget: [currentTarget, [Validators.required]],
      targetReferenceValue: [targetReferenceValue, [Validators.required]],
      startDate: [startDate, [Validators.required]],
      finishDate: [finishDate, [Validators.required]],
      isCritical: [isCritical]
    });

    this.subTargetForm.get('targetCondition').valueChanges.subscribe(value => {
      if (value === '1') {
        // remove targetCondition = 2 && id = 0
        const conditions = this.subTargetForm.get('conditions') as FormArray;
        const newConditions = [];
        for (let condition of conditions.controls) {
          if (condition.get('targetCondition').value === '2' && condition.get('id').value !== 0) {
            condition.get('markForDelete').setValue(true);
            newConditions.push(condition);
          } else if (condition.get('targetCondition').value === '1') {
            newConditions.push(condition);
          }
        }
        conditions.clear();
        for (let newCondition of newConditions) {
          conditions.push(newCondition);
        }
        conditions.push(this.newCondition('1'));
      } else {
        // remove targetCondition = 1 && id = 0
        const conditions = this.subTargetForm.get('conditions') as FormArray;
        const newConditions = [];
        for (let condition of conditions.controls) {
          if (condition.get('targetCondition').value === '1' && condition.get('id').value !== 0) {
            condition.get('markForDelete').setValue(true);
            newConditions.push(condition);
          } else if (condition.get('targetCondition').value === '2') {
            newConditions.push(condition);
          }
        }
        conditions.clear();
        for (let newCondition of newConditions) {
          conditions.push(newCondition);
        }
      }
    });
  }

  addCondition(): void {
    (this.subTargetForm.get('conditions') as FormArray).push(this.newCondition('2'));
  }

  removeCondition(index) {
    (this.subTargetForm.get('conditions') as FormArray).at(index).get('markForDelete').setValue(true);
  }

  newCondition(targetCondition: string): FormGroup {
    return this._formBuilder.group({
      id: [0],
      targetDetailId: [this.isEdit ? this.modalData.data.id : 0],
      targetCondition: [targetCondition],
      targetOperator: ['', [Validators.required]],
      targetValue: ['', [Validators.required]],
      resultColor: ['', [Validators.required]],
      isActive: [true],
      markForEdit: [false],
      markForDelete: [false],
    })
  }

  chosenYearHandler(normalizedYear: Moment, dateForm: any) {
    const ctrlValue = dateForm.value;
    ctrlValue.year(normalizedYear.year());
    dateForm.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, dateForm: any) {
    const ctrlValue = dateForm.value;
    ctrlValue.month(normalizedMonth.month());
    dateForm.setValue(ctrlValue);
    datepicker.close();
  }

  close(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): void {
    if (!this.subTargetForm.valid) {
      this.subTargetForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      for (let condition of (this.subTargetForm.get('conditions') as FormArray).controls) {
        if (condition.get('id').value !== 0 && !condition.get('markForDelete').value) condition.get('markForEdit').setValue(true);
      }

      const subTargetForm = this.subTargetForm.getRawValue();
      this.matDialogRef.close({
        ...subTargetForm,
        startMonth: subTargetForm.startDate.month(),
        startYear: subTargetForm.startDate.year(),
        finishMonth: subTargetForm.finishDate.month(),
        finishYear: subTargetForm.finishDate.year()
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

  isShowError() {
    return (this.showAlert && !this.subTargetForm.valid) || this.hasApiError;
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  animations: fuseAnimations
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
  resultColors: any[] = [];

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
      if (targetCondition === '1') {
        this.resultColors = [{ title: 'GREEN', value: 'GREEN' }];
        const condition = (conditions as FormArray).controls.find((v => v.get('targetCondition').value === '1' && !v.get('markForDelete').value));
        if (!condition) {
          conditions.push(this.newCondition('1'));
        } else {
          if (condition.get('resultColor').value !== 'GREEN') {
            condition.get('resultColor').setValue('GREEN');
          }
        }
      } else if (targetCondition === '2') {
        this.resultColors = [{ title: 'RED', value: 'RED' }, { title: 'YELLOW', value: 'YELLOW' }];
        if (this.modalData.data.conditions.filter(v => v.targetCondition === '2' && !v.markForDelete).length === 0) {
          conditions.push(this.newCondition('2'));
        }
      }
    } else {
      this.resultColors = [{ title: 'GREEN', value: 'GREEN' }];
      conditions.push(this.newCondition('1'));
    }

    const targetUnit = this.isEdit ? this.modalData.data.targetUnit : '';
    const currentTarget = this.isEdit ? this.modalData.data.currentTarget : '';
    const targetReferenceValue = this.isEdit ? this.modalData.data.targetReferenceValue : '';
    const startDate = this.isEdit ? moment({ year: this.modalData.data.startYear, month: this.modalData.data.startMonth - 1 }) : moment();
    const finishDate = this.isEdit ? moment({ year: this.modalData.data.finishYear, month: this.modalData.data.finishMonth - 1 }) : moment();
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
      targetReferenceValue: [targetReferenceValue],
      startDate: [startDate, [Validators.required]],
      finishDate: [finishDate, [Validators.required]],
      isCritical: [isCritical]
    });

    this.subTargetForm.get('targetCondition').valueChanges.subscribe(value => {
      if (value === '1') {
        this.resultColors = [{ title: 'GREEN', value: 'GREEN' }];

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
        this.resultColors = [{ title: 'RED', value: 'RED' }, { title: 'YELLOW', value: 'YELLOW' }];

        this.subTargetForm.get('targetValue').setValue('');

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
        conditions.push(this.newCondition('2'));
      }
    });

    if (targetCondition === '1') {
      const conditionIndex = (conditions as FormArray).controls.findIndex((control) => !control.get('markForDelete').value);
      const condition = (conditions as FormArray).at(conditionIndex);
      this.setTargetValueSubscribe(condition);
    }
  }

  addCondition(): void {
    (this.subTargetForm.get('conditions') as FormArray).push(this.newCondition('2'));
  }

  removeCondition(index) {
    const conditions = (this.subTargetForm.get('conditions') as FormArray);
    const condition = conditions.at(index);
    if (condition.get('id').value === 0) {
      conditions.removeAt(index);
    } else {
      condition.get('markForDelete').setValue(true);
    }
  }

  newCondition(targetCondition: string): FormGroup {
    const resultColor = targetCondition === '1' ? 'GREEN' : '';
    const newCondition = this._formBuilder.group({
      id: [0],
      targetDetailId: [this.isEdit ? this.modalData.data.id : 0],
      targetCondition: [targetCondition],
      targetOperator: ['', [Validators.required]],
      targetValue: ['', [Validators.required]],
      resultColor: [resultColor, [Validators.required]],
      isActive: [true],
      markForEdit: [false],
      markForDelete: [false],
    })

    if (targetCondition === '1') {
      this.setTargetValueSubscribe(newCondition);
    }

    return newCondition;
  }

  setTargetValueSubscribe(condition: AbstractControl) {
    condition.get('targetOperator').valueChanges.subscribe((v) => {
      this.subTargetForm.get('targetValue').setValue(v + condition.get('targetValue').value);
    });
    condition.get('targetValue').valueChanges.subscribe((v) => {
      this.subTargetForm.get('targetValue').setValue(condition.get('targetOperator').value + v);
    });
  }

  chosenYearHandler(normalizedYear: Moment, dateForm: any) {
    const ctrlValue = dateForm.value;
    if (ctrlValue && ctrlValue.isValid()) {
      ctrlValue.year(normalizedYear.year());
      dateForm.setValue(ctrlValue);
    } else {
      dateForm.setValue(normalizedYear);
    }
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
        startMonth: subTargetForm.startDate.month() + 1,
        startYear: subTargetForm.startDate.year(),
        finishMonth: subTargetForm.finishDate.month() + 1,
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

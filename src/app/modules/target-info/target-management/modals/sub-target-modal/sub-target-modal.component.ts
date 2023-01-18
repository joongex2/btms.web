import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { SubTarget } from 'app/shared/interfaces/document.interface';
import { TargetConditionPipe } from 'app/shared/pipes/target-condition.pipe';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
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
  subTarget: SubTarget;
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
    private _formBuilder: FormBuilder,
    private _targetConditionPipe: TargetConditionPipe,
    private _confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.subTarget = this.modalData.data;
    const priority = this.isEdit ? this.subTarget.priority : this.modalData.index;
    const measureType = this.isEdit ? this.subTarget.measureType : '';
    const targetDetailDescription = this.isEdit ? this.subTarget.targetDetailDescription : '';
    const targetIndex = this.isEdit ? this.subTarget.targetIndex : '';
    const targetValue = this.isEdit ? this.subTarget.targetValue : '';
    const targetCondition = this.isEdit ? this.subTarget.targetCondition : '1';
    const conditions = this._formBuilder.array([]);
    if (this.isEdit) {
      for (let tc of this.subTarget.conditions) {
        conditions.push(this._formBuilder.group({
          id: [tc.id],
          targetDetailId: [tc.targetDetailId],
          targetCondition: [tc.targetCondition],
          targetOperator: [tc.targetOperator, [Validators.required]],
          targetValue: [tc.targetValue, [Validators.required]],
          resultColor: [{ value: tc.resultColor, disabled: tc.targetCondition === '1' }, [Validators.required]],
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
        if (this.subTarget.conditions.filter(v => v.targetCondition === '2' && !v.markForDelete).length === 0) {
          conditions.push(this.newCondition('2'));
        }
      }
    } else {
      this.resultColors = [{ title: 'GREEN', value: 'GREEN' }];
      conditions.push(this.newCondition('1'));
    }

    const targetUnit = this.isEdit ? this.subTarget.targetUnit : '';
    const currentTarget = this.isEdit ? this.subTarget.currentTarget : '';
    const targetReferenceValue = this.isEdit ? this.subTarget.targetReferenceValue : '';
    const startDate = this.isEdit ? moment({ year: this.subTarget.startYear, month: this.subTarget.startMonth - 1 }) : moment();
    const finishDate = this.isEdit ? moment({ year: this.subTarget.finishYear, month: this.subTarget.finishMonth - 1 }) : moment();
    const isCritical = this.isEdit ? this.subTarget.isCritical : false;

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

    const _conditions = (conditions as FormArray).controls.filter((control) => !control.get('markForDelete').value);
    for (let condition of _conditions) {
      if (condition.get('targetCondition').value === '1') {
        this.setTargetValueSubscribe(condition);
      } else {
        this.setTargetValue2Subscribe(condition);
      }
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
    setTimeout(() => this.mergeTargetValue2());
  }

  newCondition(targetCondition: string): FormGroup {
    const resultColor = targetCondition === '1' ? 'GREEN' : '';
    const newCondition = this._formBuilder.group({
      id: [0],
      targetDetailId: [this.isEdit ? this.subTarget.id : 0],
      targetCondition: [targetCondition],
      targetOperator: ['', [Validators.required]],
      targetValue: ['', [Validators.required]],
      resultColor: [{ value: resultColor, disabled: targetCondition === '1' }, [Validators.required]],
      isActive: [true],
      markForEdit: [false],
      markForDelete: [false],
    })

    if (targetCondition === '1') {
      this.setTargetValueSubscribe(newCondition);
    } else {
      this.setTargetValue2Subscribe(newCondition);
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

  setTargetValue2Subscribe(condition: AbstractControl) {
    condition.get('targetOperator').valueChanges.subscribe((v) => {
      setTimeout(() => this.mergeTargetValue2());
    });
    condition.get('targetValue').valueChanges.subscribe((v) => {
      setTimeout(() => this.mergeTargetValue2());
    });
  }

  mergeTargetValue2() {
    const filterConditions = this.subTargetForm.get('conditions').value.filter(v => !v.markForDelete && v.targetCondition !== '1');

    let mergeTargetValue = '';
    for (let [index, condition] of filterConditions.entries()) {
      mergeTargetValue += condition.targetOperator + condition.targetValue;
      if (index !== filterConditions.length - 1) {
        mergeTargetValue += ', ';
      }
    }
    this.subTargetForm.get('targetValue').setValue(mergeTargetValue);
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
      if (this.isEdit && this.subTarget.targetCondition !== this.subTargetForm.get('targetCondition').value) {
        this._confirmationService.warning(
          'ยินยัน',
          `ประเภทของเป้าหมายเปลี่ยนจาก 
          ${this._targetConditionPipe.transform(this.subTarget.targetCondition)} 
          เป็น ${this._targetConditionPipe.transform(this.subTargetForm.get('targetCondition').value)} 
          ค่าแสดงเป้าหมายทุกเดือนจะถูกล้าง`,
          true
        ).afterClosed().subscribe((result) => {
          if (result === 'confirmed') {
            for (let plan of this.subTarget.plans) {
              plan.markForEdit = true;
              for (let index of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
                // plan[`useMonth${index}`] = null;
                plan[`valueMonth${index}`] = null;
              }
            }
            this.closeWithValue();
          }
        });
      } else {
        this.closeWithValue();
      }
    }
  }

  closeWithValue() {
    for (let condition of (this.subTargetForm.get('conditions') as FormArray).controls) {
      if (condition.get('id').value !== 0 && !condition.get('markForDelete').value) condition.get('markForEdit').setValue(true);
    }

    const subTargetForm = this.subTargetForm.getRawValue();
    this.matDialogRef.close({
      ...subTargetForm,
      conditions: subTargetForm.conditions.map(v => ({ ...v, targetValue: parseInt(v.targetValue) })),
      startMonth: subTargetForm.startDate.month() + 1,
      startYear: subTargetForm.startDate.year(),
      finishMonth: subTargetForm.finishDate.month() + 1,
      finishYear: subTargetForm.finishDate.year()
    });
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

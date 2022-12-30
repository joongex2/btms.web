import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { Plan, SubTarget } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import moment from 'moment';
import { ModalMode } from '../modal.type';

@Component({
  selector: 'app-plan-modal',
  templateUrl: './plan-modal.component.html',
  styleUrls: ['./plan-modal.component.scss'],
  animations: fuseAnimations
})
export class PlanModalComponent implements OnInit {
  isEdit: boolean = false;
  planForm: FormGroup;
  checkAll: FormControl;
  plan: Plan;
  subTarget: SubTarget;
  years: any[] = [];
  monthIndexes: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  monthShortMap = {
    1: 'jan',
    2: 'feb',
    3: 'mar',
    4: 'apr',
    5: 'may',
    6: 'jun',
    7: 'jul',
    8: 'aug',
    9: 'sep',
    10: 'oct',
    11: 'nov',
    12: 'dec',
  };

  // alert
  showAlert: boolean = false;
  hasApiError: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<PlanModalComponent>,
    private _formBuilder: FormBuilder,
    private _confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    this.plan = this.modalData.data;
    this.subTarget = this.modalData.subTarget;
    const priority = this.isEdit ? this.plan.priority : this.modalData.index;
    const planDescription = this.isEdit ? this.plan.planDescription : this.subTarget.targetDetailDescription;
    const month = moment().month() + 1;
    const undertaker = this.isEdit ? this.plan.undertaker : '';

    // year select option
    this.years = this.isEdit ? [this.plan.planYear] : this.modalData.leftYears;
    let planYear;
    if (this.isEdit) {
      planYear = this.plan.planYear;
    } else {
      planYear = this.years.length > 0 ? this.years[0] : undefined;
    }

    this.planForm = this._formBuilder.group({
      priority: [{ value: priority, disabled: true }, [Validators.required]],
      planDescription: [planDescription, [Validators.required]],
      planYear: [{ value: planYear, disabled: this.isEdit }, [Validators.required]],
      useMonth1: false,
      useMonth2: false,
      useMonth3: false,
      useMonth4: false,
      useMonth5: false,
      useMonth6: false,
      useMonth7: false,
      useMonth8: false,
      useMonth9: false,
      useMonth10: false,
      useMonth11: false,
      useMonth12: false,
      valueMonth1: this.parseInputValueMonth('1'),
      valueMonth2: this.parseInputValueMonth('2'),
      valueMonth3: this.parseInputValueMonth('3'),
      valueMonth4: this.parseInputValueMonth('4'),
      valueMonth5: this.parseInputValueMonth('5'),
      valueMonth6: this.parseInputValueMonth('6'),
      valueMonth7: this.parseInputValueMonth('7'),
      valueMonth8: this.parseInputValueMonth('8'),
      valueMonth9: this.parseInputValueMonth('9'),
      valueMonth10: this.parseInputValueMonth('10'),
      valueMonth11: this.parseInputValueMonth('11'),
      valueMonth12: this.parseInputValueMonth('12'),
      undertaker: [undertaker, [Validators.required]],
    });

    this.checkAll = new FormControl(false);

    if (this.isEdit) {
      for (let i = 1; i <= 12; i++) {
        if (this.plan[`useMonth${i}`]) {
          this.planForm.get(`useMonth${i}`).setValue(true);
        }
      }
    }

    this.planForm.get('planYear').valueChanges.subscribe(v => {
      // reset
      this.checkAll.setValue(false, { emitEvent: false });
      for (let i = 1; i <= 12; i++) {
        this.planForm.get(`useMonth${i}`).setValue(false);
        this.planForm.get(`valueMonth${i}`).setValue(null);
        this.planForm.get(`useMonth${i}`).enable();
      }
    });

    for (let i = 1; i <= 12; i++) {
      this.planForm.get(`useMonth${i}`).valueChanges.subscribe(v => {
        if (v) {
          this.planForm.get(`valueMonth${i}`).enable();
        } else {
          this.planForm.get(`valueMonth${i}`).disable();
          if (this.checkAll.value) {
            this.checkAll.setValue(false);
          }
        }
      });
    }

    this.checkAll.valueChanges.subscribe(v => {
      if (v) {
        for (let i = 1; i <= 12; i++) {
          this.planForm.get(`useMonth${i}`).setValue(true);
        }
      } else {
        for (let i = 1; i <= 12; i++) {
          this.planForm.get(`useMonth${i}`).enable();
        }
      }
    })
  }

  parseInputValueMonth(index: string) {
    let res;
    if (this.isEdit) {
      res = this.plan[`valueMonth${index}`];
      // if res null set default
      if (!res) res = this.modalData.subTarget.targetValue;
    } else {
      res = this.modalData.subTarget.targetValue;
    }

    if (this.subTarget.targetCondition === '1') {
      if (!this.is2Condition(res)) res = res?.replace(/(>=|<=|>|<|=)/g, '');
    }

    return res;
  }

  is2Condition(monthValue: any) {
    if (typeof monthValue === 'number') monthValue = monthValue.toString();
    const match = monthValue?.match(/(>=|<=|>|<|=)/g);
    return match ? match.length > 1 : false;
  }

  parseOutputValueMonth(valueMonth: string) {
    let res;
    if (this.subTarget.targetCondition === '1') {
      if (!this.is2Condition(valueMonth)) {
        const operator = this.subTarget.targetValue?.match(/(>=|<=|>|<|=)/g)?.[0];
        res = operator + valueMonth;
      }
    } else {
      return valueMonth;
    }

    return res;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  close(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): any {
    if (!this.planForm.valid) {
      this.planForm.markAllAsTouched();
      this.showError('กรุณาใส่ข้อมูลให้ครบถ้วน');
      return;
    } else {
      let plan = this.planForm.getRawValue();
      for (let i = 1; i <= 12; i++) {
        plan[`valueMonth${i}`] = this.parseOutputValueMonth(plan[`valueMonth${i}`]);
      }
      this.matDialogRef.close(plan);
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
    return (this.showAlert && !this.planForm.valid) || this.hasApiError;
  }
}

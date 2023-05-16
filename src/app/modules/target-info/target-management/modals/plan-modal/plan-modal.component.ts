import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { isNullOrUndefined } from 'app/shared/helpers/is-null-or-undefined';
import { Plan, SubTarget } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
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
  defaultValueMonth: number;

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
    const undertaker = this.isEdit ? this.plan.undertaker : '';

    this.defaultValueMonth = this.subTarget.targetCondition === '1' ? this.subTarget.conditions.filter(v => !v.markForDelete)[0]?.targetValue : null;

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
      useMonth1: this.plan?.useMonth1 || false,
      useMonth2: this.plan?.useMonth2 || false,
      useMonth3: this.plan?.useMonth3 || false,
      useMonth4: this.plan?.useMonth4 || false,
      useMonth5: this.plan?.useMonth5 || false,
      useMonth6: this.plan?.useMonth6 || false,
      useMonth7: this.plan?.useMonth7 || false,
      useMonth8: this.plan?.useMonth8 || false,
      useMonth9: this.plan?.useMonth9 || false,
      useMonth10: this.plan?.useMonth10 || false,
      useMonth11: this.plan?.useMonth11 || false,
      useMonth12: this.plan?.useMonth12 || false,
      valueMonth1: !isNullOrUndefined(this.plan?.valueMonth1) ? this.plan.valueMonth1 : null,
      valueMonth2: !isNullOrUndefined(this.plan?.valueMonth2) ? this.plan.valueMonth2 : null,
      valueMonth3: !isNullOrUndefined(this.plan?.valueMonth3) ? this.plan.valueMonth3 : null,
      valueMonth4: !isNullOrUndefined(this.plan?.valueMonth4) ? this.plan.valueMonth4 : null,
      valueMonth5: !isNullOrUndefined(this.plan?.valueMonth5) ? this.plan.valueMonth5 : null,
      valueMonth6: !isNullOrUndefined(this.plan?.valueMonth6) ? this.plan.valueMonth6 : null,
      valueMonth7: !isNullOrUndefined(this.plan?.valueMonth7) ? this.plan.valueMonth7 : null,
      valueMonth8: !isNullOrUndefined(this.plan?.valueMonth8) ? this.plan.valueMonth8 : null,
      valueMonth9: !isNullOrUndefined(this.plan?.valueMonth9) ? this.plan.valueMonth9 : null,
      valueMonth10: !isNullOrUndefined(this.plan?.valueMonth10) ? this.plan.valueMonth10 : null,
      valueMonth11: !isNullOrUndefined(this.plan?.valueMonth11) ? this.plan.valueMonth11 : null,
      valueMonth12: !isNullOrUndefined(this.plan?.valueMonth12) ? this.plan.valueMonth12 : null,
      undertaker: [undertaker, [Validators.required]],
    });

    let initialCheckAll = true;
    for (let i = 1; i <= 12; i++) {
      initialCheckAll = initialCheckAll && this.planForm.get(`useMonth${i}`).value;
    }
    this.checkAll = new FormControl(initialCheckAll);

    // set initial state useMonth, valueMonth if Edit
    for (let i = 1; i <= 12; i++) {
      if (!this.planForm.get(`useMonth${i}`).value) this.planForm.get(`valueMonth${i}`).disable();
    }

    // change useMonth
    for (let i = 1; i <= 12; i++) {
      this.planForm.get(`useMonth${i}`).valueChanges.subscribe(v => {
        if (v) {
          this.planForm.get(`valueMonth${i}`).enable();
          if (!this.planForm.get(`valueMonth${i}`).value && this.subTarget.targetCondition === '1') {
            this.planForm.get(`valueMonth${i}`).setValue(this.defaultValueMonth);
          }
        } else {
          this.planForm.get(`valueMonth${i}`).disable();
          this.planForm.get(`valueMonth${i}`).setValue(null);
          if (this.checkAll.value) {
            this.checkAll.setValue(false, { emitEvent: false });
          }
        }
      });
    }

    // change checkall
    this.checkAll.valueChanges.subscribe(v => {
      if (v) {
        for (let i = 1; i <= 12; i++) {
          this.planForm.get(`useMonth${i}`).setValue(true);
        }
      } else {
        for (let i = 1; i <= 12; i++) {
          this.planForm.get(`useMonth${i}`).setValue(false);
        }
      }
    });

    // change year
    this.planForm.get('planYear').valueChanges.subscribe(v => {
      // reset
      this.checkAll.setValue(false);
    });
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
      if (this.subTarget.targetCondition === '1') {
        for (let i = 1; i <= 12; i++) {
          plan[`valueMonth${i}`] = !isNullOrUndefined(plan[`valueMonth${i}`]) ? plan[`valueMonth${i}`] : null;
        }
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

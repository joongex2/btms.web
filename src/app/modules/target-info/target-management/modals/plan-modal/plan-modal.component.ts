import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { Plan } from 'app/shared/interfaces/document.interface';
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
  yearMonthForm: FormGroup;
  years: any[] = [
    { title: moment().year().toString(), value: moment().year().toString() },
    { title: (moment().year() + 1).toString(), value: (moment().year() + 1).toString() },
    { title: (moment().year() + 2).toString(), value: (moment().year() + 2).toString() }
  ];
  months: any[] = [
    { title: 'January', value: 'jan' },
    { title: 'February', value: 'feb' },
    { title: 'March', value: 'mar' },
    { title: 'April', value: 'apr' },
    { title: 'May', value: 'may' },
    { title: 'June', value: 'jun' },
    { title: 'July', value: 'jul' },
    { title: 'August', value: 'aug' },
    { title: 'September', value: 'sep' },
    { title: 'October', value: 'oct' },
    { title: 'November', value: 'nov' },
    { title: 'December', value: 'dec' },
  ];
  yearMonthTags: any[] = [];
  plans: Plan[] = [];

  monthIndexMap = {
    'jan': 'useMonth1',
    'feb': 'useMonth2',
    'mar': 'useMonth3',
    'apr': 'useMonth4',
    'may': 'useMonth5',
    'jun': 'useMonth6',
    'jul': 'useMonth7',
    'aug': 'useMonth8',
    'sep': 'useMonth9',
    'oct': 'useMonth10',
    'nov': 'useMonth11',
    'dec': 'useMonth12'
  }

  valueMonthIndexMap = {
    'jan': 'valueMonth1',
    'feb': 'valueMonth2',
    'mar': 'valueMonth3',
    'apr': 'valueMonth4',
    'may': 'valueMonth5',
    'jun': 'valueMonth6',
    'jul': 'valueMonth7',
    'aug': 'valueMonth8',
    'sep': 'valueMonth9',
    'oct': 'valueMonth10',
    'nov': 'valueMonth11',
    'dec': 'valueMonth12'
  }

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
    this.plans = this.modalData.data;
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    let currentYearPlan;
    let priority;
    if (this.isEdit) {
      currentYearPlan = this.plans.find(v => v.planYear === this.modalData.selectedYear);
    } else {
      currentYearPlan = this.plans.find(v => v.planYear === moment().year());
    }
    if (currentYearPlan) {
      priority = currentYearPlan.priority;
    } else {
      priority = this.plans.length + 1;
    }
    const planDescription = this.plans.length > 0 ? this.plans[0].planDescription : '';
    const year = this.isEdit ? this.modalData.selectedYear.toString() : moment().year().toString();
    const month = this.months[moment().month()].value;
    const undertaker = this.plans.length > 0 ? this.plans[0].undertaker : '';

    this.yearMonthForm = this._formBuilder.group({
      year: [year, [Validators.required]],
      month: [month, [Validators.required]],
    });

    this.planForm = this._formBuilder.group({
      priority: [{ value: priority, disabled: true }, [Validators.required]],
      planDescription: [planDescription, [Validators.required]],
      undertaker: [undertaker, [Validators.required]],
    });

    this.yearMonthForm.get('year').valueChanges.subscribe(v => {
      const year = parseInt(v);
      currentYearPlan = this.plans.find(v => v.planYear === year);
      if (currentYearPlan) {
        priority = currentYearPlan.priority;
      } else {
        priority = this.plans.length + 1;
      }
      this.planForm.get('priority').setValue(priority);
    });

    // initiate yearMonthTags
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    for (let plan of this.plans) {
      // by year
      for (let month of months) {
        if (plan[this.monthIndexMap[month]]) this.yearMonthTags.push({ year: plan.planYear.toString(), month });
      }
    }
  }

  addTag(): void {
    if (!this.yearMonthForm.valid) {
      this.yearMonthForm.markAllAsTouched();
      return;
    } else {
      const year = this.yearMonthForm.get('year').value;
      const month = this.yearMonthForm.get('month').value;
      if (this.checkDuplicate(year, month)) {
        this._confirmationService.warning('Duplicate year and month.')
        return;
      };
      this.yearMonthTags.push({
        year,
        month
      });
      this.yearMonthForm.get('month').reset();
    }
  }

  deleteTag(i): void {
    const plan = this.plans.find(v => v.planYear === parseInt(this.yearMonthTags[i].year));
    if (plan) {
      plan[this.monthIndexMap[this.yearMonthTags[i].month]] = false;
      plan[this.valueMonthIndexMap[this.yearMonthTags[i].month]] = 0;
    }
    this.yearMonthTags.splice(i, 1);
  }

  checkDuplicate(year: string, month: string): boolean {
    return this.yearMonthTags.find((tag) => tag.year == year && tag.month == month) !== undefined;
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
      this.matDialogRef.close({
        form: this.planForm.getRawValue(),
        yearMonthTags: this.yearMonthTags
      })
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

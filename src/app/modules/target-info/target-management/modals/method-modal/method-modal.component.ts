import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { Plan } from 'app/shared/interfaces/document.interface';
import moment from 'moment';
import { ModalMode } from '../modal.type';

@Component({
  selector: 'app-method-modal',
  templateUrl: './method-modal.component.html',
  styleUrls: ['./method-modal.component.scss'],
  animations: fuseAnimations
})
export class MethodModalComponent implements OnInit {
  isEdit: boolean = false;
  methodForm: FormGroup;
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
  methods: Plan[] = [];

  showAlert: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<MethodModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.methods = this.modalData.data;
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    let currentYearPlan;
    let priority;
    if (this.isEdit) {
      currentYearPlan = this.methods.find(v => v.planYear === this.modalData.selectedYear);
    } else {
      currentYearPlan = this.methods.find(v => v.planYear === moment().year());
    }
    if (currentYearPlan) {
      priority = currentYearPlan.priority;
    } else {
      priority = this.methods.length + 1;
    }
    const planDescription = this.methods.length > 0 ? this.methods[0].planDescription : '';
    const year = this.isEdit ? this.modalData.selectedYear.toString() : moment().year().toString();
    const undertaker = this.methods.length > 0 ? this.methods[0].undertaker : '';

    // initiate yearMonthTags
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    for (let plan of this.methods) {
      // by year
      for (let month of months) {
        if (plan[this.monthIndexMap[month]]) this.yearMonthTags.push({ year: plan.planYear.toString(), month });
      }
    }

    this.methodForm = this._formBuilder.group({
      priority: [{ value: priority, disabled: true }, [Validators.required]],
      planDescription: [planDescription, [Validators.required]],
      year: [year, []],
      month: ['', []],
      undertaker: [undertaker, [Validators.required]],
    });

    this.methodForm.get('year').valueChanges.subscribe(v => {
      const year = parseInt(v);
      currentYearPlan = this.methods.find(v => v.planYear === year);
      if (currentYearPlan) {
        priority = currentYearPlan.priority;
      } else {
        priority = this.methods.length + 1;
      }
      this.methodForm.get('priority').setValue(priority);
    });

    this.alert = {
      type: 'error',
      message: 'Wrong email or password'
    };
  }

  addTag(): void {
    this.showAlert = false;
    const year = this.methodForm.get('year').value;
    const month = this.methodForm.get('month').value;
    if (this.checkDuplicate(year, month)) {
      this.alert = {
        type: 'error',
        message: 'Duplicate year and month.'
      };
      this.showAlert = true;
      return;
    };
    this.yearMonthTags.push({
      year,
      month
    });
  }

  deleteTag(i): void {
    const method = this.methods.find(v => v.planYear === parseInt(this.yearMonthTags[i].year));
    method[this.monthIndexMap[this.yearMonthTags[i].month]] = false;
    method[this.valueMonthIndexMap[this.yearMonthTags[i].month]] = 0;
    this.yearMonthTags.splice(i, 1);
  }

  checkDuplicate(year: string, month: string): boolean {
    return this.yearMonthTags.find((tag) => tag.year == year && tag.month == month) !== undefined;
  }

  close(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): any {
    this.matDialogRef.close(
      {
        form: this.methodForm.getRawValue(),
        yearMonthTags: this.yearMonthTags
      }
    );
  }

}

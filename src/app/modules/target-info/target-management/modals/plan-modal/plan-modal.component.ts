import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  month: FormControl;
  plan: Plan;
  targetValue: string;
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
    this.targetValue = this.modalData.targetValue;
    const priority = this.isEdit ? this.plan.priority : this.modalData.index;
    const planDescription = this.isEdit ? this.plan.planDescription : '';
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

    this.month = new FormControl(month, [Validators.required]);
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
      valueMonth1: '',
      valueMonth2: '',
      valueMonth3: '',
      valueMonth4: '',
      valueMonth5: '',
      valueMonth6: '',
      valueMonth7: '',
      valueMonth8: '',
      valueMonth9: '',
      valueMonth10: '',
      valueMonth11: '',
      valueMonth12: '',
      undertaker: [undertaker, [Validators.required]],
    });

    if (this.isEdit) {
      for (let i = 1; i <= 12; i++) {
        if (this.plan[`useMonth${i}`]) {
          this.planForm.get(`useMonth${i}`).setValue(true);
          this.planForm.get(`valueMonth${i}`).setValue(this.plan[`valueMonth${i}`]);
        }
      }
    }

    this.planForm.get('planYear').valueChanges.subscribe(v => {
      // reset
      for (let i = 1; i <= 12; i++) {
        this.planForm.get(`useMonth${i}`).setValue(false);
        this.planForm.get(`valueMonth${i}`).setValue('');
      }
    });

    for (let i = 1; i <= 12; i++) {
      this.planForm.get(`useMonth${i}`).valueChanges.subscribe(v => {
        if (v) {
          this.planForm.get(`valueMonth${i}`).setValue(this.targetValue);
        } else {
          this.planForm.get(`valueMonth${i}`).setValue('');
        }
      });
    }
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
      this.matDialogRef.close(this.planForm.getRawValue());
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

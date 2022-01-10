import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { genRandomNumber } from '../../tables/mock-table-data';
import { ModalData, ModalMode } from '../modal.type';

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
    { title: '2019', value: '2019' },
    { title: '2020', value: '2020' },
    { title: '2021', value: '2021' }
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

  showAlert: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type   : 'success',
    message: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<MethodModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const methodId = this.isEdit ? this.modalData.data.methodId : genRandomNumber();
    const methodName = this.isEdit ? this.modalData.data.methodName : '';
    const owner = this.isEdit ? this.modalData.data.owner : '';

    // initiate yearMonthTags if EDIT mode
    if (this.isEdit) {
      if (this.modalData.data.jan) this.yearMonthTags.push({ year: '2021', month: 'jan' });
      if (this.modalData.data.feb) this.yearMonthTags.push({ year: '2021', month: 'feb' });
      if (this.modalData.data.mar) this.yearMonthTags.push({ year: '2021', month: 'mar' });
      if (this.modalData.data.apr) this.yearMonthTags.push({ year: '2021', month: 'apr' });
      if (this.modalData.data.may) this.yearMonthTags.push({ year: '2021', month: 'may' });
      if (this.modalData.data.jun) this.yearMonthTags.push({ year: '2021', month: 'jun' });
      if (this.modalData.data.jul) this.yearMonthTags.push({ year: '2021', month: 'jul' });
      if (this.modalData.data.aug) this.yearMonthTags.push({ year: '2021', month: 'aug' });
      if (this.modalData.data.sep) this.yearMonthTags.push({ year: '2021', month: 'sep' });
      if (this.modalData.data.oct) this.yearMonthTags.push({ year: '2021', month: 'oct' });
      if (this.modalData.data.nov) this.yearMonthTags.push({ year: '2021', month: 'nov' });
      if (this.modalData.data.dec) this.yearMonthTags.push({ year: '2021', month: 'dec' });
    }

    this.methodForm = this._formBuilder.group({
      methodId: [{ value: methodId, disabled: true }, [Validators.required]],
      methodName: [methodName, [Validators.required]],
      year: [{ value: '2021', disabled: true }, []],
      month: ['', []],
      owner: [owner, [Validators.required]],
    });

    this.alert = {
      type   : 'error',
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

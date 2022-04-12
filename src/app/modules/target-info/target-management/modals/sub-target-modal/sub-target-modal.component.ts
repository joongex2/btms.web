import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumberString } from '../../tables/mock-table-data';
import { ModalData, ModalMode } from '../modal.type';
import * as moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-sub-target-modal',
  templateUrl: './sub-target-modal.component.html',
  styleUrls: ['./sub-target-modal.component.scss']
})
export class SubTargetModalComponent implements OnInit {
  isEdit: boolean = false;
  subTargetForm: FormGroup;
  standards: any[] = [
    { title: 'Standard 1', value: 'standard-1' },
    { title: 'Standard 2', value: 'standard-2' },
    { title: 'Standard 3', value: 'standard-3' }
  ];
  symbols: any[] = [
    { title: '>', value: '>' },
    { title: '<', value: '<' },
    { title: '>=', value: '>=' },
    { title: '<=', value: '<=' },
    { title: '=', value: '=' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<SubTargetModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const subTargetId = this.isEdit ? this.modalData.data.subTargetId : genRandomNumberString();
    const subTargetName = this.isEdit ? this.modalData.data.subTargetName : '';
    const index = this.isEdit ? this.modalData.data.index : '';
    const symbol = this.isEdit ? this.modalData.data.symbol : '';
    const value = this.isEdit ? this.modalData.data.value : '';
    const unit = this.isEdit ? this.modalData.data.unit : '';
    const currentValue = this.isEdit ? this.modalData.data.currentValue : '';
    const startDate = this.isEdit ? moment({ y: this.modalData.data.startYear, m: this.modalData.data.startMonth }) : moment();
    const finishDate = this.isEdit ? moment({ y: this.modalData.data.finishYear, m: this.modalData.data.finishMonth }) : moment();

    this.subTargetForm = this._formBuilder.group({
      subTargetId: [{ value: subTargetId, disabled: true }, [Validators.required]],
      subTargetName: [subTargetName, [Validators.required]],
      index: [index, [Validators.required]],
      symbol: [symbol, [Validators.required]],
      value: [value, [Validators.required]],
      unit: [unit, [Validators.required]],
      currentValue: [currentValue, [Validators.required]],
      startDate: [startDate, [Validators.required]],
      finishDate: [finishDate, [Validators.required]]
    });
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

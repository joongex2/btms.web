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
  ]

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
    const targetOperator = this.isEdit ? this.modalData.data.targetOperator : '';
    const targetValue = this.isEdit ? this.modalData.data.targetValue : '';
    const targetUnit = this.isEdit ? this.modalData.data.targetUnit : '';
    const currentTarget = this.isEdit ? this.modalData.data.currentTarget : '';
    const targetReferenceValue = this.isEdit ? this.modalData.data.targetReferenceValue : '';
    const startDate = this.isEdit ? moment({ y: this.modalData.data.startYear, m: this.modalData.data.startMonth }) : moment();
    const finishDate = this.isEdit ? moment({ y: this.modalData.data.finishYear, m: this.modalData.data.finishMonth }) : moment();

    this.subTargetForm = this._formBuilder.group({
      priority: [{ value: priority, disabled: true }, [Validators.required]],
      measureType: [measureType, [Validators.required]],
      targetDetailDescription: [targetDetailDescription, [Validators.required]],
      targetIndex: [targetIndex, [Validators.required]],
      targetOperator: [targetOperator, [Validators.required]],
      targetValue: [targetValue, [Validators.required]],
      targetUnit: [targetUnit, [Validators.required]],
      currentTarget: [currentTarget, [Validators.required]],
      targetReferenceValue: [targetReferenceValue, [Validators.required]],
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

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumber } from '../../tables/mock-table-data';
import { ModalData, ModalMode } from '../modal.type';

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
  values: any[] = [
    { title: 'Value 1', value: 'value-1' },
    { title: 'Value 2', value: 'value-2' },
    { title: 'Value 3', value: 'value-3' }
  ];
  startYears: any[] = [
    { title: '1990', value: '1990' },
    { title: '1991', value: '1991' },
    { title: '1992', value: '1992' }
  ];
  startMonths: any[] = [
    { title: 'january', value: 'january' },
    { title: 'febuary', value: 'febuary' },
    { title: 'march', value: 'march' }
  ];
  finishYears: any[] = [
    { title: '2019', value: '2019' },
    { title: '2020', value: '2020' },
    { title: '2021', value: '2021' }
  ];
  finishMonths: any[] = [
    { title: 'january', value: 'january' },
    { title: 'febuary', value: 'febuary' },
    { title: 'march', value: 'march' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<SubTargetModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const subTargetId = this.isEdit ? this.modalData.data.subTargetId : genRandomNumber();
    const subTargetName = this.isEdit ? this.modalData.data.subTargetName : '';
    const index = this.isEdit ? this.modalData.data.index : '';
    const value = this.isEdit ? this.modalData.data.value : '';
    const unit = this.isEdit ? this.modalData.data.unit : '';
    const currentValue = this.isEdit ? this.modalData.data.currentValue : '';
    const startMonth = this.isEdit ? this.modalData.data.startMonth : '';
    const startYear = this.isEdit ? this.modalData.data.startYear : '';
    const finishMonth = this.isEdit ? this.modalData.data.finishMonth : '';
    const finishYear = this.isEdit ? this.modalData.data.finishYear : '';

    this.subTargetForm = this._formBuilder.group({
      subTargetId: [{ value: subTargetId, disabled: true }, [Validators.required]],
      subTargetName: [subTargetName, [Validators.required]],
      index: [index, [Validators.required]],
      value: [value, [Validators.required]],
      unit: [unit, [Validators.required]],
      currentValue: [currentValue, [Validators.required]],
      startMonth: [startMonth, [Validators.required]],
      startYear: [startYear, [Validators.required]],
      finishMonth: [finishMonth, [Validators.required]],
      finishYear: [finishYear, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }

}

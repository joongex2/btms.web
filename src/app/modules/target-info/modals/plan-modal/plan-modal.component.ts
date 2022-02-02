import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumberString } from '../../tables/mock-table-data';
import { ModalData, ModalMode } from '../modal.type';

@Component({
  selector: 'app-plan-modal',
  templateUrl: './plan-modal.component.html',
  styleUrls: ['./plan-modal.component.scss']
})
export class PlanModalComponent implements OnInit {
  isEdit: boolean = false;
  planForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<PlanModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const planName = this.isEdit ? this.modalData.data.planName : genRandomNumberString();
    const planActual = this.isEdit ? this.modalData.data.planActual : '';
    const planResource = this.isEdit ? this.modalData.data.planResource : '';
    const planOwner = this.isEdit ? this.modalData.data.planOwner : '';

    this.planForm = this._formBuilder.group({
      planName: [planName, [Validators.required]],
      planActual: [planActual, [Validators.required]],
      planResource: [planResource, [Validators.required]],
      planOwner: [planOwner, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

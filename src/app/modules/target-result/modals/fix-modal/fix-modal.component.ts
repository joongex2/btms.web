import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumber } from 'app/modules/super-admin/mock-super-admin-data';
import { ModalData, ModalMode } from 'app/modules/target-info/modals/modal.type';


@Component({
  selector: 'app-fix-modal',
  templateUrl: './fix-modal.component.html',
  styleUrls: ['./fix-modal.component.scss']
})
export class FixModalComponent implements OnInit {
  isEdit: boolean = false;
  fixForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<FixModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const fixNo = this.isEdit ? this.modalData.data.fixNo : genRandomNumber();
    const fixDetail = this.isEdit ? this.modalData.data.fixDetail : '';
    const fixOwner = this.isEdit ? this.modalData.data.fixOwner : '';
    const fixDueDate = this.isEdit ? this.modalData.data.fixDueDate : '';
    const fixFollow = this.isEdit ? this.modalData.data.fixFollow : '';
    const fixStartDate = this.isEdit ? this.modalData.data.fixStartDate : '';

    this.fixForm = this._formBuilder.group({
      fixNo: [fixNo, [Validators.required]],
      fixDetail: [fixDetail, [Validators.required]],
      fixOwner: [fixOwner, [Validators.required]],
      fixDueDate: [fixDueDate, [Validators.required]],
      fixFollow: [fixFollow, [Validators.required]],
      fixStartDate: [fixStartDate, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

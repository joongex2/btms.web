import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumber } from '../../tables/mock-table-data';
import { ModalData, ModalMode } from '../modal.type';

@Component({
  selector: 'app-target-modal',
  templateUrl: './target-modal.component.html',
  styleUrls: ['./target-modal.component.scss']
})
export class TargetModalComponent implements OnInit {
  isEdit: boolean = false;
  targetForm: FormGroup;
  standards: any[] = [
    { title: 'Standard 1', value: 'standard-1' },
    { title: 'Standard 2', value: 'standard-2' },
    { title: 'Standard 3', value: 'standard-3' }
  ];
  relativeTargets: any[] = [
    { title: 'Relative Target-1', value: 'relative-target-1' },
    { title: 'Relative Target-2', value: 'relative-target-2' },
    { title: 'Relative Target-3', value: 'relative-target-3' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<TargetModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const targetId = this.isEdit ? this.modalData.data.targetId : genRandomNumber();
    const name = this.isEdit ? this.modalData.data.name : '';
    const standard = this.isEdit ? this.modalData.data.standard : '';
    const relativeTarget = this.isEdit ? this.modalData.data.relativeTarget : '';

    this.targetForm = this._formBuilder.group({
      targetId: [{ value: targetId, disabled: true }, [Validators.required]],
      name: [name, [Validators.required]],
      standard: [standard, [Validators.required]],
      relativeTarget: [relativeTarget, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

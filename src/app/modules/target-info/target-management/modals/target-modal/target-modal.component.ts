import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumberString } from '../../tables/mock-table-data';
import { ModalData, ModalMode } from '../modal.type';

@Component({
  selector: 'app-target-modal',
  templateUrl: './target-modal.component.html',
  styleUrls: ['./target-modal.component.scss']
})
export class TargetModalComponent implements OnInit {
  isEdit: boolean = false;
  targetForm: FormGroup;
  standards: any[];
  relativeTargets: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<TargetModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.standards = this.modalData.standards;
    this.relativeTargets = this.modalData.kpiMissions;

    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const priority = this.isEdit ? this.modalData.data.priority : this.modalData.index;
    const targetName = this.isEdit ? this.modalData.data.targetName : '';
    const standard = this.isEdit ? this.modalData.data.standard : '';
    const targetMission = this.isEdit ? this.modalData.data.targetMission : '';

    this.targetForm = this._formBuilder.group({
      priority: [{ value: priority, disabled: true }, [Validators.required]],
      targetName: [targetName, [Validators.required]],
      standard: [standard, [Validators.required]],
      targetMission: [targetMission, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

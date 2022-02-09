import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TargetService } from 'app/modules/target-info/target.service';
import { CauseRecord, Method, ResultDetail, SubTarget, Target } from 'app/modules/target-info/target.types';
import { TargetResultService } from '../../target-result.service';
import { FileUpload } from '../../target-result.types';
import { LastCommentModalComponent } from '../last-comment-modal/last-comment-modal.component';

@Component({
  selector: 'app-target-entry-detail-modal',
  templateUrl: './target-entry-detail-modal.component.html',
  styleUrls: ['./target-entry-detail-modal.component.scss']
})
export class TargetEntryDetailModalComponent implements OnInit {
  saveResultFileUploads: FileUpload[];
  causeAndFixFileUploads: FileUpload[];
  showRefDocument: boolean = false;

  causes: CauseRecord[];

  //bind value
  targetResult: string;
  naCheckBox: boolean;
  choice: string;

  target: Target;
  subTarget: SubTarget;
  method: Method;
  year: string;
  month: string;

  // page status
  mode: string = 'saveResult';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<LastCommentModalComponent>,
    private _targetService: TargetService,
    private _targetResultService: TargetResultService
  ) {
    this.setData(data);
  }

  ngOnInit(): void {
    this.saveResultFileUploads = this._targetResultService.getSaveResultFileUploads();
    this.causeAndFixFileUploads = this._targetResultService.getCauseAndFixFileUploads();
  }

  setData(data: any): void {
    const runningNo = data.runningNo;
    const targets = this._targetService.getTargets(runningNo);
    const targetIndex = data.targetIndex;
    const subTargetIndex = data.subTargetIndex;
    const mainMethodIndex = data.mainMethodIndex;
    this.target = targets[targetIndex].data;
    this.subTarget = targets[targetIndex].kids.records[subTargetIndex].data;
    this.method = targets[targetIndex].kids.records[subTargetIndex].kids.records[mainMethodIndex].kids.methodRecords[0].data;
    this.year = data.year;
    this.month = data.month;
    this.causes = (this.method.resultRecords.find(res => res.year == this.year)[this.month] as ResultDetail).causeRecords;
  }

  setShowRefDocument(): void {
    this.showRefDocument = parseFloat(this.targetResult) < 70;
  }

  close(): void {
    this.matDialogRef.close();
  }

}

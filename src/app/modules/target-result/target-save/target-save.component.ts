import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { CauseRecord, ResultDetail } from 'app/modules/target-info/target.types';
import { LastCommentModalComponent } from 'app/shared/components/last-comment-modal/last-comment-modal.component';
import { monthToNumber } from 'app/shared/helpers/month-convert';
import { DocumentDetail, Plan, SubTarget, Target } from 'app/shared/interfaces/document.interface';
import { DocumentService } from 'app/shared/services/document.service';
import { PlanFlow, TargetSaveData } from '../target-result.interface';
import { TargetResultService } from '../target-result.service';
import { FileUpload } from '../target-result.types';


@Component({
  selector: 'app-target-save',
  templateUrl: './target-save.component.html',
  styleUrls: ['./target-save.component.scss']
})
export class TargetSaveComponent implements OnInit {
  user: User;
  saveResultFileUploads: FileUpload[];
  causes: CauseRecord[];
  causeAndFixFileUploads: FileUpload[];
  showRefDocument: boolean = false;
  readonly = false;

  //bind value
  targetResult: string;
  naCheckBox: boolean;
  // choice: string;

  document: Partial<DocumentDetail>;
  target: Target;
  subTarget: SubTarget;
  plan: Plan;
  month: string;

  // privillege
  canAcceptReject: boolean;
  canSave: boolean;

  // page status
  /*
    saveResult -> targetResult match targetValue, archive, N/A
    causeAndFix -> targetResult not match targetValue or unarchive
  */
  mode: string = 'saveResult';

  constructor(
    private _targetResultService: TargetResultService,
    private _documentService: DocumentService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
  ) {
    this.readonly = _activatedRoute.snapshot.data['readonly'] ? true : false;
    this.setData(this._targetResultService.targetSaveData);
  }

  ngOnInit(): void {
    this.user = this._activatedRoute.snapshot.data.user;
    this.checkPrivillege();
    this.saveResultFileUploads = this._targetResultService.getSaveResultFileUploads();
    this.causeAndFixFileUploads = this._targetResultService.getCauseAndFixFileUploads();
  }

  setData(data: TargetSaveData): void {
    const documentId = data.documentId;
    const targetId = data.targetId;
    const subTargetId = data.subTargetId;
    const planId = data.planId;
    this._documentService.getDocument(documentId).subscribe({
      next: (documentDetail: DocumentDetail) => {
        this.document = documentDetail;
        this.checkPrivillege();
        this.target = documentDetail.targets.find(v => v.id === targetId);
        if (this.target) {
          this.subTarget = this.target.details.find(v => v.id === subTargetId);
          if (this.subTarget) {
            this.plan = this.subTarget.plans.find(v => v.id === planId);
          }
        }
        this.setPlanVisited();
      },
      error: (e) => console.error(e)
    });

    this.month = data.month;
    const mockResultDetail: ResultDetail = {
      status: '>9',
      causeRecords: [
        {
          data: {
            causeNo: '1',
            causeDetail: 'ไม่ได้ทำ',
            causeNote: '',
            causeStatus: 'Completed'
          },
          kids: {
            fixRecords: [
              {
                data: {
                  fixNo: '1',
                  fixDetail: 'ไปแก้ไข',
                  fixOwner: 'คุณเจตน์',
                  fixDueDate: '2019-06-20',
                  fixFollow: 'พบมีการดำเนินการแก้ไขไปเมื่อ',
                  fixStartDate: '2019-06-18'
                }
              }
            ],
            protectRecords: [
              {
                data: {
                  protectNo: '1',
                  protectDetail: 'AAAA',
                  protectOwner: 'AA',
                  protectDueDate: '2019-12-31',
                  protectFollow: 'มีการดำเนินงานอย่างต่อเนื่อง',
                  protectStartDate: '2019-06-20'
                }
              }
            ]
          }
        }
      ]
    }
    this.causes = mockResultDetail.causeRecords;
  }

  setPlanVisited() {
    let planStatuses = this._targetResultService.PlanStatuses;
    planStatuses = planStatuses ? planStatuses : [];
    const planStatus = planStatuses.find(v =>
      v.documentId === this.document.id &&
      v.targetId === this.target.id &&
      v.subTargetId === this.subTarget.id &&
      v.planId === this.plan.id &&
      v.month === monthToNumber(this.month)
    );
    if (planStatus) {
      planStatus.flow = PlanFlow.VISITED;
    } else {
      planStatuses.push({
        documentId: this.document.id,
        targetId: this.target.id,
        subTargetId: this.subTarget.id,
        planId: this.plan.id,
        month: monthToNumber(this.month),
        flow: PlanFlow.VISITED
      });
    }
    this._targetResultService.PlanStatuses = planStatuses;
  }

  setShowRefDocument(): void {
    if (this.subTarget.measureType === '1') {
      this.showRefDocument = parseFloat(this.targetResult) < 70; // TODO:
    } else {
      if (this.targetResult === 'unarchive') {
        this.showRefDocument = true;
      } else {
        this.showRefDocument = false;
      }
    }
  }

  openLastComment() {
    const dialogRef = this._matDialog.open(LastCommentModalComponent, {
      data: {
        comments: this.document.comments
      }
    });
    dialogRef.afterClosed()
      .subscribe((result: any) => {

      });
  }

  backToDetail(): void {
    this._router.navigate(['../'], { relativeTo: this._activatedRoute });
  }

  backToArchive(): void {
    this.mode = 'saveResult';
  }

  checkPrivillege() {
    if (this.user && this.user.organizes && this.document) {
      let haveT01 = false;
      let haveT02 = false;
      let haveT03 = false;
      let haveT04 = false;
      const organize = this.user.organizes.find((v) => v.organizeCode === this.document.organizeCode);
      for (let role of organize.roles) {
        if (role.roleCode === 'T01') haveT01 = true;
        if (role.roleCode === 'T02') haveT02 = true;
        if (role.roleCode === 'T03') haveT03 = true;
        if (role.roleCode === 'T04') haveT04 = true;
      }
      if (haveT01) this.canSave = true;
      if (haveT02 || haveT03 || haveT04) this.canAcceptReject = true;
    }
  }

  ngOnDestroy(): void {
    this._targetResultService.clear();
  }

}

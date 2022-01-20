import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ModalMode } from 'app/modules/target-info/modals/modal.type';
import { TargetService } from 'app/modules/target-info/target.service';
import { Cause, CauseRecord, Fix, Method, Protect, SubTarget, Target, TargetRecord } from 'app/modules/target-info/target.types';
import { TargetResultService } from '../../target-result.service';
import { FileUpload } from '../../target-result.types';
import { CauseModalComponent } from '../cause-modal/cause-modal.component';
import { FixModalComponent } from '../fix-modal/fix-modal.component';
import { LastCommentModalComponent } from '../last-comment-modal/last-comment-modal.component';
import { ProtectModalComponent } from '../protect-modal/protect-modal.component';

@Component({
  selector: 'app-target-entry-modal',
  templateUrl: './target-entry-modal.component.html',
  styleUrls: ['./target-entry-modal.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TargetEntryModalComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('uploadFileInput') uploadFileInput: ElementRef;
  @ViewChild('causeTable') causeTable: MatTable<any>;
  @ViewChild('fixTable') fixTable: MatTable<any>;
  @ViewChild('protectTable') protectTable: MatTable<any>;

  dataColumns = [
    'fileName',
    'uploader',
    'date',
    'deleteIcon'
  ];
  fileUploads: FileUpload[];
  fileList: FileList;
  showRefDocument: boolean = false;

  dataColumns2 = [
    'causeNo',
    'causeDetail',
    'causeNote',
    'causeStatus',
    'editIcon',
    'deleteIcon'
  ];
  dataColumns3 = [
    'fixNo',
    'fixDetail',
    'fixOwner',
    'fixDueDate',
    'fixFollow',
    'fixStartDate',
    'editIcon',
    'deleteIcon'
  ];
  dataColumns4 = [
    'protectNo',
    'protectDetail',
    'protectOwner',
    'protectDueDate',
    'protectFollow',
    'protectStartDate',
    'editIcon',
    'deleteIcon'
  ];
  causes: CauseRecord[] = [
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
              fixDueDate: '20/06/2019',
              fixFollow: 'พบมีการดำเนินการแก้ไขไปเมื่อ',
              fixStartDate: '18/06/2019'
            }
          }
        ],
        protectRecords: [
          {
            data: {
              protectNo: '1',
              protectDetail: 'AAAA',
              protectOwner: 'AA',
              protectDueDate: '31/12/2019',
              protectFollow: 'มีการดำเนินงานอย่างต่อเนื่อง',
              protectStartDate: '20/06/2019'
            }
          }
        ]
      }
    }
  ];

  //bind value
  dataSource: MatTableDataSource<FileUpload>;
  // dataSource2: any;
  targetResult: string;
  naCheckBox: boolean;
  choice: string;

  target: Target;
  subTarget: SubTarget;
  method: Method;
  month: string;

  // page status
  mode: string = 'saveResult';

  expandedCauses = [];

  constructor(
    private _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<LastCommentModalComponent>,
    private _targetService: TargetService,
    private _targetResultService: TargetResultService
  ) {
    this.setData(data);
  }

  ngOnInit(): void {
    this.fileUploads = this._targetResultService.getFileUploads();
    this.dataSource = new MatTableDataSource(this.fileUploads);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  setData(data: any): void {
    const targets: TargetRecord[] = data.targets;
    const targetIndex = data.targetIndex;
    const subTargetIndex = data.subTargetIndex;
    const planIndex = data.planIndex;
    this.target = targets[targetIndex].data;
    this.subTarget = targets[targetIndex].kids.records[subTargetIndex].data;
    this.method = targets[targetIndex].kids.records[subTargetIndex].kids.records[planIndex].kids.methodRecords[0].data;
    this.month = data.month;
  }

  deleteUser(index: number): void {
    this.fileUploads.splice(index, 1);
    this.dataSource.data = this.fileUploads;
  }

  uploadFile(fileList: FileList): void {
    this.fileList = fileList;
  }

  uploadFileClick(): void {
    if (this.fileList && this.fileList.length > 0) {
      this.fileUploads.push({
        fileName: this.fileList[0].name,
        uploader: 'xxx',
        date: 'xxx'
      });
      this.dataSource.data = this.fileUploads;
      this.fileList = undefined;
      this.uploadFileInput.nativeElement.value = '';
    }
  }

  setShowRefDocument(): void {
    this.showRefDocument = parseFloat(this.targetResult) < 70;
  }

  checkExpanded(element, expandedElements): boolean {
    let flag = false;
    expandedElements.forEach(e => {
      if (e === element) {
        flag = true;
      }
    });
    return flag;
  }

  pushPopElement(element, expandedElements) {
    const index = expandedElements.indexOf(element);
    if (index === -1) {
      expandedElements.push(element);
    } else {
      expandedElements.splice(index, 1);
    }
  }

  addCause(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CauseModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((cause: Cause) => {
        if (!cause) return; // cancel
        this.causes.push({
          data: cause,
          kids: {
            fixRecords: [],
            protectRecords: []
          }
        });
        this.causeTable.renderRows();
      });
  };
  editCause(index: number): void {
    const dialogRef = this._matDialog.open(CauseModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.causes[index].data
      }
    });
    dialogRef.afterClosed()
      .subscribe((cause: Cause) => {
        if (!cause) return; // cancel
        this.causes[index].data = cause;
        this.causeTable.renderRows();
      });
  };
  deleteCause(index: number): void {
    this.causes.splice(index, 1);
    this.causeTable.renderRows();
  };

  addFix(causeIndex): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(FixModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((fix: Fix) => {
        if (!fix) return; // cancel
        this.causes[causeIndex].kids.fixRecords.push({
          data: fix
        });
        this.fixTable.renderRows();
      });
  };
  editFix(causeIndex: number, index: number): void {
    const dialogRef = this._matDialog.open(FixModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.causes[causeIndex].kids.fixRecords[index].data
      }
    });
    dialogRef.afterClosed()
      .subscribe((fix: Fix) => {
        if (!fix) return; // cancel
        this.causes[causeIndex].kids.fixRecords[index].data = fix;
        this.fixTable.renderRows();
      });
  };
  deleteFix(causeIndex: number, index: number): void {
    this.causes[causeIndex].kids.fixRecords.splice(index, 1);
    this.fixTable.renderRows();
  };

  addProtect(causeIndex: number): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(ProtectModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((protect: Protect) => {
        if (!protect) return; // cancel
        this.causes[causeIndex].kids.protectRecords.push({
          data: protect
        });
        this.protectTable.renderRows();
      });
  };
  editProtect(causeIndex: number, index: number): void {
    const dialogRef = this._matDialog.open(ProtectModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.causes[causeIndex].kids.protectRecords[index].data
      }
    });
    dialogRef.afterClosed()
      .subscribe((protect: Protect) => {
        if (!protect) return; // cancel
        this.causes[causeIndex].kids.protectRecords[index].data = protect;
        this.protectTable.renderRows();
      });
  };
  deleteProtect(causeIndex: number, index: number): void {
    this.causes[causeIndex].kids.protectRecords.splice(index, 1);
    this.protectTable.renderRows();
  };

  close(): void {
    this.matDialogRef.close();
  }

}

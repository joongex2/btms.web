import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MethodModalComponent } from '../../modals/method-modal/method-modal.component';
import { ModalMode } from '../../modals/modal.type';
import { TargetService } from '../../target.service';
import { TargetTableComponent } from '../target-table/target-table.component';
import { Method, MethodRecord, ResultDetail, ResultRecord, SubTarget } from './../../target.types';

@Component({
  selector: 'app-method-table',
  templateUrl: './method-table.component.html',
  styleUrls: ['./method-table.component.scss']
})
export class MethodTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetIndex: string;
  @Input() subTargetIndex: string;
  @Input() mainMethodIndex: string;
  @Input() methods: MethodRecord[];
  @ViewChild('methodTable') methodTable: TargetTableComponent;

  subTargetSymbolValue: string;

  displayedColumns: string[] = [
    'methodName',
    'year',
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
    'owner',
    'editIcon',
    'deleteIcon'
  ];

  constructor(
    private _matDialog: MatDialog,
    private _targetService: TargetService
  ) { }

  ngOnInit(): void {
    this.getCurrentSubTargetSymbolValue();
  }

  getCurrentSubTargetSymbolValue() {
    const runningNoRec = this._targetService.getRunningNoRecord(this.runningNo);
    const subTarget: SubTarget = runningNoRec
      .kids.records[this.targetIndex]
      .kids.records[this.subTargetIndex]
      .data;
    this.subTargetSymbolValue = subTarget.symbol + subTarget.value;
  }

  addMethod(): void {
    // const mockMethod = genMockMethodRecord();
    // this.methods.push(mockMethod);
    // this.methodTable.table.renderRows();

    const dialogRef = this._matDialog.open(MethodModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((methodModalData: any) => {
        if (!methodModalData) return; // cancel
        this.methods.push({ data: this.genMethodFromModal(methodModalData), kids: undefined });
        this.methodTable.table.renderRows();
      });
  }

  editMethod(index: number): void {
    // this.methods[index].data.jan = 'randfkaljds';
    // this.methodTable.table.renderRows();

    // Open the dialog
    const dialogRef = this._matDialog.open(MethodModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.methods[index].data
      }
    });
    dialogRef.afterClosed()
      .subscribe((methodModalData: any) => {
        if (!methodModalData) return; // cancel
        this.methods[index].data = this.genMethodFromModal(methodModalData, index);
        this.methodTable.table.renderRows();
      });
  }

  deleteMethod(index: number): void {
    this.methods.splice(index, 1);
    this.methodTable.table.renderRows();
  }

  genMethodFromModal(methodModalData: any, methodIndex?: any): Method {
    let resultRecords: ResultRecord[] = [];
    let realResultRecords: ResultRecord[] = methodIndex != undefined ? this.methods[methodIndex].data.resultRecords : undefined;
    const yearMonthTags = methodModalData.yearMonthTags;
    this.getCurrentSubTargetSymbolValue();
    for (let tag of yearMonthTags) {
      let resultRecord: ResultRecord;
      const findResultRecord = resultRecords.find((rec) => rec.year === tag.year);
      if (findResultRecord) {
        resultRecord = findResultRecord;
      } else {
        resultRecord = {
          year: tag.year,
          jan: undefined,
          feb: undefined,
          mar: undefined,
          apr: undefined,
          may: undefined,
          jun: undefined,
          jul: undefined,
          aug: undefined,
          sep: undefined,
          oct: undefined,
          nov: undefined,
          dec: undefined
        };
        resultRecords.push(resultRecord);
      }
      if (realResultRecords) {
        // edit
        const realResultRecord = realResultRecords.find((rec) => rec.year === tag.year);
        if (realResultRecord && realResultRecord[tag.month]) {
          resultRecord[tag.month] = realResultRecord[tag.month]; // if have use same realResult
        } else {
          resultRecord[tag.month] = {
            status: this.subTargetSymbolValue,
            causeRecords: []
          }
        }
      } else {
        // add
        resultRecord[tag.month] = {
          status: this.subTargetSymbolValue,
          causeRecords: []
        }
      }
    }

    return {
      methodId: methodModalData.form.methodId,
      methodName: methodModalData.form.methodName,
      owner: methodModalData.form.owner,
      resultRecords
    }
  }

}

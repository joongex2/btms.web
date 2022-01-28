import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { result } from 'lodash';
import { MethodModalComponent } from '../../modals/method-modal/method-modal.component';
import { ModalMode } from '../../modals/modal.type';
import { genMockMethodRecord } from '../mock-table-data';
import { TargetTableComponent } from '../target-table/target-table.component';
import { Method, MethodRecord, ResultDetail, ResultRecord } from './../../target.types';

@Component({
  selector: 'app-method-table',
  templateUrl: './method-table.component.html',
  styleUrls: ['./method-table.component.scss']
})
export class MethodTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetId: string;
  @Input() methods: MethodRecord[];
  @ViewChild('methodTable') methodTable: TargetTableComponent;

  displayedColumns: string[] = [
    'methodId',
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

  constructor(private _matDialog: MatDialog) { }

  ngOnInit(): void { }

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
        this.methods[index].data = this.genMethodFromModal(methodModalData);
        this.methodTable.table.renderRows();
      });
  }

  deleteMethod(index: number): void {
    this.methods.splice(index, 1);
    this.methodTable.table.renderRows();
  }

  genMethodFromModal(methodModalData: any): Method {
    let resultRecords: ResultRecord[] = [];
    const yearMonthTags = methodModalData.yearMonthTags;
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
      for (const key of Object.keys(resultRecord)) {
        if (tag.month === key) {
          (resultRecord[key] as ResultDetail) = {
            status: 'initial',
            causeRecords: []
          }
        }
      }
    }
    const method: Method = methodModalData.form;
    method.resultRecords = resultRecords;
    return method;
  }

}

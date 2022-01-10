import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MethodModalComponent } from '../../modals/method-modal/method-modal.component';
import { ModalMode } from '../../modals/modal.type';
import { genMockMethodRecord } from '../mock-table-data';
import { TargetTableComponent } from '../target-table/target-table.component';
import { Method, MethodRecord } from './../../target.types';

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
    let method: Method;
    method = methodModalData.form;
    if (methodModalData.yearMonthTags.find((tag) => tag.month == 'jan')) method.jan = '1.000';
    if (methodModalData.yearMonthTags.find((tag) => tag.month == 'feb')) method.feb = '1.000';
    if (methodModalData.yearMonthTags.find((tag) => tag.month == 'mar')) method.mar = '1.000';
    if (methodModalData.yearMonthTags.find((tag) => tag.month == 'apr')) method.apr = '1.000';
    if (methodModalData.yearMonthTags.find((tag) => tag.month == 'may')) method.may = '1.000';
    if (methodModalData.yearMonthTags.find((tag) => tag.month == 'jun')) method.jun = '1.000';
    if (methodModalData.yearMonthTags.find((tag) => tag.month == 'jul')) method.jul = '1.000';
    if (methodModalData.yearMonthTags.find((tag) => tag.month == 'aug')) method.aug = '1.000';
    if (methodModalData.yearMonthTags.find((tag) => tag.month == 'sep')) method.sep = '1.000';
    if (methodModalData.yearMonthTags.find((tag) => tag.month == 'oct')) method.oct = '1.000';
    if (methodModalData.yearMonthTags.find((tag) => tag.month == 'nov')) method.nov = '1.000';
    if (methodModalData.yearMonthTags.find((tag) => tag.month == 'dec')) method.dec = '1.000';
    return method;
  }

}

import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { TargetService } from 'app/modules/target-info/target.service';
import { MethodRecord, ResultRecord, SubTarget } from 'app/modules/target-info/target.types';
import { TargetEntryDetailModalComponent } from '../../modals/target-entry-detail-modal/target-entry-detail-modal.component';

@Component({
  selector: 'app-method-entry-table',
  templateUrl: './method-entry-table.component.html',
  styleUrls: ['./method-entry-table.component.scss']
})
export class MethodEntryTableComponent implements OnInit {
  @Input() methods: MethodRecord[];
  @Input() runningNo: string;
  @Input() targetIndex: string;
  @Input() subTargetIndex: string;
  @Input() mainMethodIndex: string;

  @ViewChildren('yearSelect') yearSelects: QueryList<MatSelect>;

  subTargetSymbolValue: string;

  // targetHeader1 = ['targetDetailSpanned', 'ownerSpanned', 'year', 'blankSpanned', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  // targetHeader2 = ['blank'];
  methodHeader = ['methodName', 'year', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'owner'];
  methodRow1 = ['methodName', 'year', 'targetHeader', 'owner'];
  methodRow2 = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  methodRow3 = ['resultHeader'];
  methodRow4 = ['jan2', 'feb2', 'mar2', 'apr2', 'may2', 'jun2', 'jul2', 'aug2', 'sep2', 'oct2', 'nov2', 'dec2'];

  constructor(
    private _matDialog: MatDialog,
    private _targetService: TargetService
  ) { }

  ngOnInit(): void {
    const runningNoRec = this._targetService.getRunningNoRecord(this.runningNo);
    // const subTarget: SubTarget = runningNoRec
    //   .kids.records[this.targetIndex]
    //   .kids.records[this.subTargetIndex]
    //   .data;
    // this.subTargetSymbolValue = subTarget.symbol + subTarget.value;
    this.subTargetSymbolValue = '<9';
  }

  openTargetEntryModal(year: string, month: string) {
    const dialogRef = this._matDialog.open(TargetEntryDetailModalComponent, {
      data: {
        runningNo: this.runningNo,
        targetIndex: this.targetIndex,
        subTargetIndex: this.subTargetIndex,
        mainMethodIndex: this.mainMethodIndex,
        year,
        month
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {

    });
  }

  getYears(resultRecords: ResultRecord[]) {
    return resultRecords.map(res => res.year);
  }

  getResultRecord(resultRecords: ResultRecord[], year: string): ResultRecord {
    return resultRecords.find((res) => res.year == year);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalMode } from '../../modals/modal.type';
import { SubTargetModalComponent } from '../../modals/sub-target-modal/sub-target-modal.component';
import { TargetTableComponent } from '../target-table/target-table.component';
import { SubTarget, SubTargetRecord } from './../../target.types';

@Component({
  selector: 'app-sub-target-table',
  templateUrl: './sub-target-table.component.html',
  styleUrls: ['./sub-target-table.component.scss']
})
export class SubTargetTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetId: string;
  @Input() subTargets: SubTargetRecord[];
  @Output() refreshTable: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('subTargetTable') subTargetTable: TargetTableComponent;

  displayedColumns: string[] = [
    'expandIcon',
    'subTargetId',
    'subTargetName',
    'index',
    'value',
    'unit',
    'currentValue',
    'startMonth',
    'startYear',
    'finishMonth',
    'finishYear',
    'editIcon',
    'deleteIcon'
  ];

  constructor(private _matDialog: MatDialog) { }

  ngOnInit(): void { }

  refreshMainTable(): void {
    this.refreshTable.next(1);
  }

  addSubTarget(): void {
    // const mockSubTarget = genMockSubTargetRecord();
    // this.subTargets.push(mockSubTarget);
    // this.subTargetTable.table.renderRows();

    // Open the dialog
    const dialogRef = this._matDialog.open(SubTargetModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((subTarget: SubTarget) => {
        if (!subTarget) return; // cancel
        this.subTargets.push({ data: subTarget, kids: { records: [] } });
        this.subTargetTable.table.renderRows();
      });
  }

  editSubTarget(index: number): void {
    // this.subTargets[index].data.startMonth = 'sfaarandom';
    // this.subTargetTable.table.renderRows();

    // Open the dialog
    const dialogRef = this._matDialog.open(SubTargetModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.subTargets[index].data
      }
    });
    dialogRef.afterClosed()
      .subscribe((subTarget: SubTarget) => {
        if (!subTarget) return; // cancel
        this.subTargets[index].data = subTarget;
        this.subTargetTable.table.renderRows();
      });
  }

  deleteSubTarget(index: number): void {
    this.subTargets.splice(index, 1);
    this.subTargetTable.table.renderRows();
  }

}

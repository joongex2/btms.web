import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalMode } from '../../modals/modal.type';
import { TargetModalComponent } from '../../modals/target-modal/target-modal.component';
import { TargetTableComponent } from '../../tables/target-table/target-table.component';
import { RunningNoData, Target, TargetRecord } from '../../target.types';

@Component({
  selector: 'target-management',
  templateUrl: './target-management.component.html',
})
export class TargetManagementComponent implements OnInit {
  @Input() targets: TargetRecord[];
  @Input() runningNo: string;
  @Input() runningNoData: RunningNoData;
  @Input() haveRunningNo: boolean = false;
  @ViewChild('targetTable') targetTable: TargetTableComponent;

  displayedColumns: string[] = [
    'expandIcon',
    'targetId',
    'name',
    'standard',
    'relativeTarget',
    'editIcon',
    'deleteIcon'
  ];

  constructor(private _matDialog: MatDialog) { }

  ngOnInit(): void { }

  addTarget(): void {
    // const mockTarget = genMockTargetRecord();
    // this.targets.push(mockTarget);
    // this.targetTable.table.renderRows();

    // Open the dialog
    const dialogRef = this._matDialog.open(TargetModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((target: Target) => {
        if (!target) return; // cancel
        this.targets.push({ data: target, kids: { records: [] } });
        this.targetTable.table.renderRows();
      });
  }

  editTarget(index: number): void {
    // this.targets[index].data.name = 'edit22';
    // this.targetTable.table.renderRows();

    // Open the dialog
    const dialogRef = this._matDialog.open(TargetModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.targets[index].data
      }
    });
    dialogRef.afterClosed()
      .subscribe((target: Target) => {
        if (!target) return; // cancel
        this.targets[index].data = target;
        this.targetTable.table.renderRows();
      });
  }

  deleteTarget(index: number): void {
    this.targets.splice(index, 1);
    this.targetTable.table.renderRows();
  }
}

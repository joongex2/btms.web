import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { detailExpandAnimation } from 'app/shared/table-animation';
import { ModalMode } from '../../modals/modal.type';
import { TargetModalComponent } from '../../modals/target-modal/target-modal.component';
import { Target, TargetRecord } from '../../target.types';
import { SubTargetTableComponent } from '../sub-target-table/sub-target-table.component';

@Component({
  selector: 'app-target-table',
  templateUrl: './target-table.component.html',
  styleUrls: ['./target-table.component.scss'],
  animations: [detailExpandAnimation]
})
export class TargetTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targets: TargetRecord[];

  @ViewChildren(SubTargetTableComponent) subTargetTables: QueryList<SubTargetTableComponent>;
  @ViewChild('targetTable') targetTable: MatTable<Target>;

  displayedColumns: string[] = [
    'expandIcon',
    'targetId',
    'name',
    'standard',
    'relativeTarget',
    'editIcon',
    'deleteIcon'
  ];
  expandedTargets: TargetRecord[] = [];

  constructor(
    private _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  checkExpanded(element): boolean {
    if (!this.expandedTargets) return;

    let flag = false;
    this.expandedTargets.forEach(e => {
      if (e === element) {
        flag = true;
      }
    });
    return flag;
  }

  pushPopElement(element) {
    if (!this.expandedTargets) return;

    const index = this.expandedTargets.indexOf(element);
    if (index === -1) {
      this.expandedTargets.push(element);
    } else {
      this.expandedTargets.splice(index, 1);
    }
  }

  expandAll() {
    for (let target of this.targets) {
      if (this.expandedTargets.indexOf(target) === -1) this.expandedTargets.push(target);
    }
    for (let subTargetTable of this.subTargetTables) {
      subTargetTable.expandAll();
    }
  }

  collapseAll() {
    this.expandedTargets = [];
    for (let subTargetTable of this.subTargetTables) {
      subTargetTable.collapseAll();
    }
  }

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
        this.targetTable.renderRows();
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
        this.targetTable.renderRows();
      });
  }

  deleteTarget(index: number): void {
    this.targets.splice(index, 1);
    this.targetTable.renderRows();
  }
}

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { detailExpandAnimation } from 'app/shared/table-animation';
import { ModalMode } from '../../modals/modal.type';
import { SubTargetModalComponent } from '../../modals/sub-target-modal/sub-target-modal.component';
import { SubTarget, SubTargetRecord } from './../../target.types';

@Component({
  selector: 'app-sub-target-table',
  templateUrl: './sub-target-table.component.html',
  styleUrls: ['./sub-target-table.component.scss'],
  animations: [detailExpandAnimation]
})
export class SubTargetTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetIndex: string;
  @Input() subTargets: SubTargetRecord[];
  @ViewChild('subTargetTable') subTargetTable: MatTable<SubTarget>;

  expandedSubtargets: SubTargetRecord[] = [];

  displayedColumns: string[] = [
    'expandIcon',
    'subTargetId',
    'subTargetName',
    'index',
    'symbolValue',
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
        this.subTargetTable.renderRows();
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
        this.subTargetTable.renderRows();
      });
  }

  deleteSubTarget(index: number): void {
    this.subTargets.splice(index, 1);
    this.subTargetTable.renderRows();
  }

  checkExpanded(element): boolean {
    if (!this.expandedSubtargets) return;

    let flag = false;
    this.expandedSubtargets.forEach(e => {
      if (e === element) {
        flag = true;
      }
    });
    return flag;
  }

  pushPopElement(element) {
    if (!this.expandedSubtargets) return;

    const index = this.expandedSubtargets.indexOf(element);
    if (index === -1) {
      this.expandedSubtargets.push(element);
    } else {
      this.expandedSubtargets.splice(index, 1);
    }
  }

  expandAll() {
    for (let subTarget of this.subTargets) {
      if (this.expandedSubtargets.indexOf(subTarget) === -1) this.expandedSubtargets.push(subTarget);
    }
  }

  collapseAll() {
    this.expandedSubtargets = [];
  }

}

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { SubTarget } from 'app/shared/interfaces/document.interface';
import { TargetConditionPipe } from 'app/shared/pipes/target-condition.pipe';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { detailExpandAnimation } from 'app/shared/table-animation';
import { ModalMode } from '../../modals/modal.type';
import { SubTargetModalComponent } from '../../modals/sub-target-modal/sub-target-modal.component';

@Component({
  selector: 'app-sub-target-table',
  templateUrl: './sub-target-table.component.html',
  styleUrls: ['./sub-target-table.component.scss'],
  animations: [detailExpandAnimation]
})
export class SubTargetTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetId: number;
  @Input() subTargets: SubTarget[];
  @Input() isEdit: boolean;
  @Output() markForEdit: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('subTargetTable') subTargetTable: MatTable<SubTarget>;

  expandedSubtargets: SubTarget[] = [];

  displayedColumns: string[] = [
    'expandIcon',
    'priority',
    'targetDetailDescription',
    'targetIndex',
    'measureType',
    'targetValue',
    'targetUnit',
    'currentTarget',
    'startMonth',
    'startYear',
    'finishMonth',
    'finishYear',
    'editIcon',
    'deleteIcon'
  ];

  constructor(
    private _matDialog: MatDialog,
    private _confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void { }

  addSubTarget(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(SubTargetModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined,
        index: this.subTargets.filter(v => !v.markForDelete).length + 1
      }
    });
    dialogRef.afterClosed()
      .subscribe((subTarget: SubTarget) => {
        if (!subTarget) return; // cancel
        this.subTargets.push({
          id: 0,
          priority: subTarget.priority,
          measureType: subTarget.measureType,
          targetDetailDescription: subTarget.targetDetailDescription,
          targetCondition: subTarget.targetCondition,
          targetIndex: subTarget.targetIndex,
          targetValue: subTarget.targetValue,
          conditions: subTarget.conditions,
          targetReferenceValue: subTarget.targetReferenceValue,
          targetUnit: subTarget.targetUnit,
          currentTarget: subTarget.currentTarget,
          startMonth: subTarget.startMonth,
          startYear: subTarget.startYear,
          finishMonth: subTarget.finishMonth,
          finishYear: subTarget.finishYear,
          isCritical: subTarget.isCritical,
          markForEdit: false,
          markForDelete: false,
          topics: [],
          plans: []
        });
        this.subTargetTable.renderRows();
        this.markForEdit.emit(this.targetId);
      });
  }

  editSubTarget(index: number): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(SubTargetModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.subTargets[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((subTarget: SubTarget) => {
        if (!subTarget) return; // cancel
        this.subTargets[index].measureType = subTarget.measureType;
        this.subTargets[index].targetDetailDescription = subTarget.targetDetailDescription;
        this.subTargets[index].targetIndex = subTarget.targetIndex;
        this.subTargets[index].targetValue = subTarget.targetValue;
        this.subTargets[index].targetCondition = subTarget.targetCondition;
        this.subTargets[index].conditions = subTarget.conditions;
        this.subTargets[index].targetUnit = subTarget.targetUnit;
        this.subTargets[index].currentTarget = subTarget.currentTarget;
        this.subTargets[index].targetReferenceValue = subTarget.targetReferenceValue;
        this.subTargets[index].startMonth = subTarget.startMonth;
        this.subTargets[index].startYear = subTarget.startYear;
        this.subTargets[index].finishMonth = subTarget.finishMonth;
        this.subTargets[index].finishYear = subTarget.finishYear;
        this.subTargets[index].isCritical = subTarget.isCritical;
        this.subTargets[index].markForEdit = true;
        this.subTargetTable.renderRows();
        this.markForEdit.emit(this.targetId);
      });
  }

  deleteSubTarget(index: number): void {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        if (this.subTargets[index].id === 0) {
          this.subTargets.splice(index, 1);
        } else {
          this.subTargets[index].markForDelete = true;
        }
        // reindex
        let newPriority = 1;
        for (let subTarget of this.subTargets) {
          if (!subTarget.markForDelete) {
            if (subTarget.priority !== newPriority) {
              subTarget.priority = newPriority;
              subTarget.markForEdit = true;
            }
            newPriority++;
          }
        }
        this.subTargetTable.renderRows();
        this.markForEdit.emit(this.targetId);
      }
    });
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

  markForEditHandler(subTargetId: number) {
    const subTarget = this.subTargets.find(v => v.id === subTargetId);
    if (subTarget) subTarget.markForEdit = true;
    this.markForEdit.emit(this.targetId);
  }

}

import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { detailExpandAnimation } from 'app/shared/table-animation';
import { ModalMode } from '../../modals/modal.type';
import { TargetModalComponent } from '../../modals/target-modal/target-modal.component';
import { TargetRecord } from '../../../target.types';
import { SubTargetTableComponent } from '../sub-target-table/sub-target-table.component';
import { Target } from 'app/shared/interfaces/document.interface';
import { LookupService } from 'app/shared/services/lookup.service';
import { Lookup } from 'app/shared/interfaces/lookup.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';

@Component({
  selector: 'app-target-table',
  templateUrl: './target-table.component.html',
  styleUrls: ['./target-table.component.scss'],
  animations: [detailExpandAnimation]
})
export class TargetTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() documentId: number;
  @Input() targets: Target[] = [];
  @Input() selectedDocumentType: string;
  @Input() selectedTargetType: string;
  @Input() standards: any[];
  @Input() isEdit: boolean;
  @Output() markForEdit: EventEmitter<number> = new EventEmitter<number>();
  @ViewChildren(SubTargetTableComponent) subTargetTables: QueryList<SubTargetTableComponent>;
  @ViewChild('targetTable') targetTable: MatTable<Target>;

  displayedColumns: string[] = [
    'expandIcon',
    'priority',
    'targetName',
    'standard',
    'targetMission',
    'editIcon',
    'deleteIcon'
  ];
  expandedTargets: Target[] = [];

  kpiMissions: any[];

  constructor(
    private _matDialog: MatDialog,
    private _lookupService: LookupService,
    private _confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this._lookupService.getLookups('KPI_MISSION').subscribe({
      next: (lookups: Lookup[]) => {
        this.kpiMissions = lookups.map((v) => ({ title: v.lookupDescription, value: v.lookupDescription }));
      },
      error: (e) => console.error(e)
    });
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

  checkExpandAll(): boolean {
    return this.targets.length > 0 && this.expandedTargets.length == this.targets.length;
  }

  expandOrCollapseAll() {
    if (this.checkExpandAll()) {
      this.collapseAll();
    } else {
      this.expandAll();
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
    if (!this.selectedDocumentType || !this.selectedTargetType) {
      this._confirmationService.warning('กรุณาเลือก Document Type และ Target Type');
      return;
    }
    // Open the dialog
    const dialogRef = this._matDialog.open(TargetModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined,
        standards: this.standards,
        kpiMissions: this.kpiMissions,
        index: this.targets.length + 1
      }
    });
    dialogRef.afterClosed()
      .subscribe((target: Target) => {
        if (!target) return; // cancel
        this.targets.push({
          id: 0,
          standard: target.standard,
          priority: target.priority,
          targetName: target.targetName,
          targetMission: target.targetMission,
          markForEdit: false,
          markForDelete: false,
          details: []
        });
        this.targetTable.renderRows();
      });
  }

  editTarget(index: number): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(TargetModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.targets[index],
        standards: this.standards,
        kpiMissions: this.kpiMissions
      }
    });
    dialogRef.afterClosed()
      .subscribe((target: Target) => {
        if (!target) return; // cancel
        this.targets[index].standard = target.standard,
        this.targets[index].targetName = target.targetName,
        this.targets[index].targetMission = target.targetMission,
        this.targets[index].markForEdit = true;
        this.targetTable.renderRows();
        this.markForEdit.emit(this.documentId);
      });
  }

  deleteTarget(index: number): void {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        if (this.targets[index].id === 0) {
          this.targets.splice(index, 1);
        } else {
          this.targets[index].markForDelete = true;
        }
        // reindex
        let newPriority = 1;
        for (let target of this.targets) {
          if (!target.markForDelete) {
            target.priority = newPriority;
            newPriority++;
          }
        }    
        this.targetTable.renderRows();
        this.markForEdit.emit(this.documentId);
      }
    });
  }

  markForEditHandler(targetId: number) {
    const target = this.targets.find(v => v.id === targetId);
    if (target) target.markForEdit = true;
    this.markForEdit.emit(this.documentId);
  }
}

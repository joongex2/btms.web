import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ModalMode } from 'app/modules/target-info/target-management/modals/modal.type';
import { Protect } from 'app/modules/target-info/target.types';
import { TARGET_SOLUTION_TYPE } from 'app/modules/target-result/target-result.interface';
import { Solution } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { ProtectModalComponent } from '../../modals/protect-modal/protect-modal.component';

@Component({
  selector: 'app-protect-table',
  templateUrl: './protect-table.component.html',
  styleUrls: ['./protect-table.component.scss']
})
export class ProtectTableComponent implements OnInit {
  @Input() solutions: Solution[];
  @Input() protects: Solution[];
  @Input() readonly = false;
  @Input() causeId: number;
  @Input() targetReferenceStatus: string;

  @ViewChild('protectTable') protectTable: MatTable<Protect>;
  @Output() markForEdit: EventEmitter<number> = new EventEmitter<number>();

  dataColumns = [
    'sequenceNo',
    'solutionTopic',
    'userResponsibility',
    'finishDate',
    'solutionDescription',
    'actionDate',
    'editIcon',
    'deleteIcon'
  ];

  constructor(
    private _matDialog: MatDialog,
    private _confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.protects = this.solutions.filter(v => v.targetSolutionType === TARGET_SOLUTION_TYPE.PREVENTION);
  }

  addProtect(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(ProtectModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined,
        index: this.protects.filter(v => !v.markForDelete).length + 1,
        targetReferenceStatus: this.targetReferenceStatus
      }
    });
    dialogRef.afterClosed()
      .subscribe((protect: Solution) => {
        if (!protect) return; // cancel
        this.protects.push({
          id: 0,
          targetCauseId: this.causeId,
          targetSolutionType: TARGET_SOLUTION_TYPE.PREVENTION,
          sequenceNo: protect.sequenceNo,
          solutionTopic: protect.solutionTopic,
          userResponsibility: protect.userResponsibility,
          finishDate: protect.finishDate,
          solutionDescription: protect.solutionDescription,
          actionDate: protect.actionDate
        });
        this.protectTable.renderRows();
      });
  };

  editProtect(index: number): void {
    const dialogRef = this._matDialog.open(ProtectModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.protects[index],
        targetReferenceStatus: this.targetReferenceStatus
      }
    });
    dialogRef.afterClosed()
      .subscribe((protect: Solution) => {
        if (!protect) return; // cancel
        this.protects[index].solutionTopic = protect.solutionTopic;
        this.protects[index].userResponsibility = protect.userResponsibility;
        this.protects[index].finishDate = protect.finishDate;
        this.protects[index].solutionDescription = protect.solutionDescription;
        this.protects[index].actionDate = protect.actionDate;
        this.protects[index].markForEdit = true;
        this.protectTable.renderRows();
        this.markForEdit.emit(this.causeId);
      });
  };
  deleteProtect(index: number): void {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        if (this.protects[index].id === 0) {
          this.protects.splice(index, 1);
        } else {
          this.protects[index].markForDelete = true;
        }
        // reindex
        let newSequenceNo = 1;
        for (let protect of this.protects) {
          if (!protect.markForDelete) {
            if (protect.sequenceNo !== newSequenceNo) {
              protect.sequenceNo = newSequenceNo;
              protect.markForEdit = true;
            }
            newSequenceNo++;
          }
        }
        this.protectTable.renderRows();
        this.markForEdit.emit(this.causeId);
      }
    });
  };

}

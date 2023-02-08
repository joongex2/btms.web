import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ModalMode } from 'app/modules/target-info/target-management/modals/modal.type';
import { Fix } from 'app/modules/target-info/target.types';
import { TARGET_SOLUTION_TYPE } from 'app/modules/target-result/target-result.interface';
import { Solution } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { FixModalComponent } from '../../modals/fix-modal/fix-modal.component';

@Component({
  selector: 'app-fix-table',
  templateUrl: './fix-table.component.html',
  styleUrls: ['./fix-table.component.scss']
})
export class FixTableComponent implements OnInit {
  @Input() solutions: Solution[];
  @Input() fixs: Solution[];
  @Input() readonly = false;
  @Input() causeId: number;

  @ViewChild('fixTable') fixTable: MatTable<Fix>
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
    this.fixs = this.solutions.filter(v => v.targetSolutionType === TARGET_SOLUTION_TYPE.SOLUTION);
  }

  addFix(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(FixModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined,
        index: this.fixs.filter(v => !v.markForDelete).length + 1
      }
    });
    dialogRef.afterClosed()
      .subscribe((fix: Solution) => {
        if (!fix) return; // cancel
        this.fixs.push({
          id: 0,
          targetCauseId: this.causeId,
          targetSolutionType: TARGET_SOLUTION_TYPE.SOLUTION,
          sequenceNo: fix.sequenceNo,
          solutionTopic: fix.solutionTopic,
          userResponsibility: fix.userResponsibility,
          finishDate: fix.finishDate,
          solutionDescription: fix.solutionDescription,
          actionDate: fix.actionDate
        });
        this.fixTable.renderRows();
      });
  };

  editFix(index: number): void {
    const dialogRef = this._matDialog.open(FixModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.fixs[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((fix: Solution) => {
        if (!fix) return; // cancel
        this.fixs[index].solutionTopic = fix.solutionTopic;
        this.fixs[index].userResponsibility = fix.userResponsibility;
        this.fixs[index].finishDate = fix.finishDate;
        this.fixs[index].solutionDescription = fix.solutionDescription;
        this.fixs[index].actionDate = fix.actionDate;
        this.fixs[index].markForEdit = true;
        this.fixTable.renderRows();
        this.markForEdit.emit(this.causeId);
      });
  };

  deleteFix(index: number): void {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        if (this.fixs[index].id === 0) {
          this.fixs.splice(index, 1);
        } else {
          this.fixs[index].markForDelete = true;
        }
        // reindex
        let newSequenceNo = 1;
        for (let fix of this.fixs) {
          if (!fix.markForDelete) {
            if (fix.sequenceNo !== newSequenceNo) {
              fix.sequenceNo = newSequenceNo;
              fix.markForEdit = true;
            }
            newSequenceNo++;
          }
        }
        this.fixTable.renderRows();
        this.markForEdit.emit(this.causeId);
      }
    });
  };
}

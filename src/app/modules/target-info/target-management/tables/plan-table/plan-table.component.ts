import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Topic } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { ModalMode } from '../../modals/modal.type';
import { PlanModalComponent } from '../../modals/plan-modal/plan-modal.component';

@Component({
  selector: 'app-plan-table',
  templateUrl: './plan-table.component.html',
  styleUrls: ['./plan-table.component.scss']
})
export class PlanTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetId: number;
  @Input() subTargetId: number;
  @Input() mainMethodIndex: string;
  @Input() plans: Topic[];
  @Output() markForEdit: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('planTable') planTable: MatTable<Topic>;

  displayedColumns: string[] = [
    'priority',
    'planDescription',
    'planTargetDate',
    'resource',
    'undertaker',
    'editIcon',
    'deleteIcon'
  ];

  constructor(
    private _matDialog: MatDialog,
    private _confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void { }

  addPlan(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(PlanModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined,
        index: this.plans.length + 1
      }
    });
    dialogRef.afterClosed()
      .subscribe((topic: Topic) => {
        if (!topic) return; // cancel
        this.plans.push({
          id: 0,
          priority: topic.priority,
          planDescription: topic.planDescription,
          planTargetDate: topic.planTargetDate,
          resource: topic.resource,
          undertaker: topic.undertaker,
          markForEdit: false,
          markForDelete: false
        });
        this.planTable.renderRows();
        this.markForEdit.emit(this.subTargetId);
      });
  }

  editPlan(index: number): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(PlanModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.plans[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((topic: Topic) => {
        if (!topic) return; // cancel
        this.plans[index].planDescription = topic.planDescription;
        this.plans[index].planTargetDate = topic.planTargetDate;
        this.plans[index].resource = topic.resource;
        this.plans[index].undertaker = topic.undertaker;
        this.plans[index].markForEdit = true;
        this.planTable.renderRows();
        this.markForEdit.emit(this.subTargetId);
      });
  }

  deletePlan(index: number): void {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        if (this.plans[index].id === 0) {
          this.plans.splice(index, 1);
        } else {
          this.plans[index].markForDelete = true;
        }
        // reindex
        let newPriority = 1;
        for (let plan of this.plans) {
          if (!plan.markForDelete) {
            plan.priority = newPriority;
            newPriority++;
          }
        }
        this.planTable.renderRows();
        this.markForEdit.emit(this.subTargetId);
      }
    });
  }
}

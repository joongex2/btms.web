import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ModalMode } from '../../modals/modal.type';
import { PlanModalComponent } from '../../modals/plan-modal/plan-modal.component';
import { Plan, PlanRecord } from '../../../target.types';

@Component({
  selector: 'app-plan-table',
  templateUrl: './plan-table.component.html',
  styleUrls: ['./plan-table.component.scss']
})
export class PlanTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetIndex: string;
  @Input() subTargetIndex: string;
  @Input() mainMethodIndex: string;
  @Input() plans: PlanRecord[];
  @ViewChild('planTable') planTable: MatTable<Plan>;

  displayedColumns: string[] = [
    'planName',
    'planActual',
    'planResource',
    'planOwner',
    'editIcon',
    'deleteIcon'
  ];

  constructor(private _matDialog: MatDialog) { }

  ngOnInit(): void { }

  addPlan(): void {
    // const mockPlan = genMockPlanRecord();
    // this.plans.push(mockPlan);
    // this.planTable.table.renderRows();

    // Open the dialog
    const dialogRef = this._matDialog.open(PlanModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((plan: Plan) => {
        if (!plan) return; // cancel
        this.plans.push({ data: plan, kids: undefined });
        this.planTable.renderRows();
      });
  }

  editPlan(index: number): void {
    // this.plans[index].data.planName = 'randfkaljds';
    // this.planTable.table.renderRows();

    // Open the dialog
    const dialogRef = this._matDialog.open(PlanModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.plans[index].data
      }
    });
    dialogRef.afterClosed()
      .subscribe((plan: Plan) => {
        if (!plan) return; // cancel
        this.plans[index].data = plan;
        this.planTable.renderRows();
      });
  }

  deletePlan(index: number): void {
    this.plans.splice(index, 1);
    this.planTable.renderRows();
  }

}

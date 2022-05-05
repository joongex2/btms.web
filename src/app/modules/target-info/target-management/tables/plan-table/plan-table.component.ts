import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTable } from '@angular/material/table';
import { Plan } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import moment from 'moment';
import { TargetService } from '../../../target.service';
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
  _plans: Plan[];
  get plans(): Plan[] {
    return this._plans;
  }
  @Input() set plans(value: Plan[]) {
    this._plans = value;
    if (value.length > 0) {
      this.remappingYear();
      this.selectedYear = this.years[0];
      this.yearChange(this.selectedYear);
      this.findLeftYears();
    }
  }
  @Input() targetValue: string;
  @Input() isEdit: boolean;
  @Output() markForEdit: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('planTable') planTable: MatTable<Plan>;
  @ViewChildren('yearSelect') yearSelects: QueryList<MatSelect>;

  selectedYear: number;
  selectedPlan: Plan[] = [];

  displayedColumns: string[] = [
    'planDescription',
    'planYear',
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
    'undertaker',
    'editIcon',
    'deleteIcon'
  ];

  monthColumns: string[] = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec'
  ];

  years: number[];
  leftYears: number[] = [moment().year(), moment().year() + 1, moment().year() + 2]; // year which can add

  constructor(
    private cdr: ChangeDetectorRef,
    private _matDialog: MatDialog,
    private _targetService: TargetService,
    private _confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void { }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges(); // temp fix ExpressionChangedAfterItHasBeenCheckedError
  }

  addPlan(): void {
    const dialogRef = this._matDialog.open(PlanModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined,
        targetValue: this.targetValue,
        index: this._plans.filter(v => !v.markForDelete).length + 1,
        leftYears: this.leftYears
      }
    });
    dialogRef.afterClosed()
      .subscribe((plan: Plan) => {
        if (!plan) return; // cancel
        this._plans.push({
          id: 0,
          priority: plan.priority,
          planDescription: plan.planDescription,
          planYear: plan.planYear,
          useMonth1: plan.useMonth1,
          useMonth2: plan.useMonth2,
          useMonth3: plan.useMonth3,
          useMonth4: plan.useMonth4,
          useMonth5: plan.useMonth5,
          useMonth6: plan.useMonth6,
          useMonth7: plan.useMonth7,
          useMonth8: plan.useMonth8,
          useMonth9: plan.useMonth9,
          useMonth10: plan.useMonth10,
          useMonth11: plan.useMonth11,
          useMonth12: plan.useMonth12,
          valueMonth1: plan.valueMonth1,
          valueMonth2: plan.valueMonth2,
          valueMonth3: plan.valueMonth3,
          valueMonth4: plan.valueMonth4,
          valueMonth5: plan.valueMonth5,
          valueMonth6: plan.valueMonth6,
          valueMonth7: plan.valueMonth7,
          valueMonth8: plan.valueMonth8,
          valueMonth9: plan.valueMonth9,
          valueMonth10: plan.valueMonth10,
          valueMonth11: plan.valueMonth11,
          valueMonth12: plan.valueMonth12,
          undertaker: plan.undertaker,
          markForEdit: false,
          markForDelete: false
        })
        // recalculate year
        this.remappingYear();
        this.selectedYear = plan.planYear;
        this.yearChange(this.selectedYear);
        this.findLeftYears();

        this.planTable.renderRows();
        this.markForEdit.emit(this.subTargetId);
      });
  }

  editPlan(index: number): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(PlanModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.selectedPlan[0],
        targetValue: this.targetValue
      }
    });
    dialogRef.afterClosed()
      .subscribe((plan: Plan) => {
        if (!plan) return; // cancel
        this.selectedPlan[0].planDescription = plan.planDescription;
        this.selectedPlan[0].planYear = plan.planYear;
        this.selectedPlan[0].useMonth1 = plan.useMonth1;
        this.selectedPlan[0].useMonth2 = plan.useMonth2;
        this.selectedPlan[0].useMonth3 = plan.useMonth3;
        this.selectedPlan[0].useMonth4 = plan.useMonth4;
        this.selectedPlan[0].useMonth5 = plan.useMonth5;
        this.selectedPlan[0].useMonth6 = plan.useMonth6;
        this.selectedPlan[0].useMonth7 = plan.useMonth7;
        this.selectedPlan[0].useMonth8 = plan.useMonth8;
        this.selectedPlan[0].useMonth9 = plan.useMonth9;
        this.selectedPlan[0].useMonth10 = plan.useMonth10;
        this.selectedPlan[0].useMonth11 = plan.useMonth11;
        this.selectedPlan[0].useMonth12 = plan.useMonth12;
        this.selectedPlan[0].valueMonth1 = plan.valueMonth1;
        this.selectedPlan[0].valueMonth2 = plan.valueMonth2;
        this.selectedPlan[0].valueMonth3 = plan.valueMonth3;
        this.selectedPlan[0].valueMonth4 = plan.valueMonth4;
        this.selectedPlan[0].valueMonth5 = plan.valueMonth5;
        this.selectedPlan[0].valueMonth6 = plan.valueMonth6;
        this.selectedPlan[0].valueMonth7 = plan.valueMonth7;
        this.selectedPlan[0].valueMonth8 = plan.valueMonth8;
        this.selectedPlan[0].valueMonth9 = plan.valueMonth9;
        this.selectedPlan[0].valueMonth10 = plan.valueMonth10;
        this.selectedPlan[0].valueMonth11 = plan.valueMonth11;
        this.selectedPlan[0].valueMonth12 = plan.valueMonth12;
        this.selectedPlan[0].undertaker = plan.undertaker;
        this.selectedPlan[0].markForEdit = true;
        this.planTable.renderRows();
        this.markForEdit.emit(this.subTargetId);
      });
  }

  deletePlan(): void {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        const index = this._plans.findIndex(v => v.planYear === this.selectedYear);
        if (this._plans[index].id === 0) {
          this._plans.splice(index, 1);
        } else {
          this._plans[index].markForDelete = true;
        }
        // reindex
        let newPriority = 1;
        for (let plan of this._plans) {
          if (!plan.markForDelete) {
            if (plan.priority !== newPriority) {
              plan.priority = newPriority;
              plan.markForEdit = true;
            }
            newPriority++;
          }
        }

        this.remappingYear();
        if (this.years.length > 0 && !this.years.includes(this.selectedYear)) {
          // if delete at select year
          this.selectedYear = this.years[0];
          this.yearChange(this.selectedYear);
        }
        if (this.years.length === 0) {
          // if not have year left
          this.selectedYear = undefined;
          this.selectedPlan = [];
        }
        this.findLeftYears();
        this.planTable.renderRows();
        this.markForEdit.emit(this.subTargetId);
      }
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  yearChange(year: number) {
    const plan = this._plans.find((v) => v.planYear === year && !v.markForDelete);
    this.selectedPlan = plan ? [plan] : [];
  }

  remappingYear() {
    this.years = this._plans
      .filter(v => !v.markForDelete)
      .map(v => v.planYear)
      .sort((a, b) => a - b);
  }

  findLeftYears() {
    const leftYears = [moment().year(), moment().year() + 1, moment().year() + 2];
    const existYears = this._plans.filter(v => !v.markForDelete).map(v => v.planYear);
    this.leftYears = leftYears.filter(v => !existYears.includes(v));
  }

}

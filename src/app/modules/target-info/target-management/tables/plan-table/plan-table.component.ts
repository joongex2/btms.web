import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTable } from '@angular/material/table';
import { Plan } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { TargetService } from '../../../target.service';
import { ResultRecord } from '../../../target.types';
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
    }
  }
  @Input() targetValue: string;
  @Input() isEdit: boolean;
  @Output() markForEdit: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('planTable') planTable: MatTable<Plan>;
  @ViewChildren('yearSelect') yearSelects: QueryList<MatSelect>;

  selectedYear: number;
  selectedPlan: Plan[] = [];
  subTargetSymbolValue: string;

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
        data: this._plans.filter(v => !v.markForDelete)
      }
    });
    dialogRef.afterClosed()
      .subscribe((planModalData: any) => {
        if (!planModalData) return; // cancel
        this.editPlans(planModalData);
        this.planTable.renderRows();
        this.markForEdit.emit(this.subTargetId);
      });
  }

  editPlan(index: number): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(PlanModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this._plans.filter(v => !v.markForDelete),
        selectedYear: this.selectedPlan[0].planYear
      }
    });
    dialogRef.afterClosed()
      .subscribe((planModalData: any) => {
        if (!planModalData) return; // cancel
        this.editPlans(planModalData);
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
            plan.priority = newPriority;
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
        this.planTable.renderRows();
        this.markForEdit.emit(this.subTargetId);
      }
    });
  }

  monthIndexMap = {
    'jan': '1',
    'feb': '2',
    'mar': '3',
    'apr': '4',
    'may': '5',
    'jun': '6',
    'jul': '7',
    'aug': '8',
    'sep': '9',
    'oct': '10',
    'nov': '11',
    'dec': '12',
  }

  editPlans(planModalData: any): void {
    for (let plan of this._plans) {
      if (!plan.markForDelete) {
        plan.planDescription = planModalData.form.planDescription;
        plan.undertaker = planModalData.form.undertaker;
        plan.markForEdit = true;
      }
    }

    for (let tag of planModalData.yearMonthTags) {
      let plan: Plan;
      const findPlan = this._plans.find(v => v.planYear === parseInt(tag.year) && !v.markForDelete);
      if (findPlan) {
        // already have year in _plans
        if (!findPlan[`useMonth${this.monthIndexMap[tag.month]}`]) {
          // add new month
          findPlan[`useMonth${this.monthIndexMap[tag.month]}`] = true;
          findPlan[`valueMonth${this.monthIndexMap[tag.month]}`] = this.targetValue;
          findPlan.markForEdit = true;
        }
      } else {
        // not have year in _plans
        plan = {
          id: 0,
          priority: this._plans.length + 1,
          planDescription: planModalData.form.planDescription,
          planYear: parseInt(tag.year),
          useMonth1: false,
          useMonth2: false,
          useMonth3: false,
          useMonth4: false,
          useMonth5: false,
          useMonth6: false,
          useMonth7: false,
          useMonth8: false,
          useMonth9: false,
          useMonth10: false,
          useMonth11: false,
          useMonth12: false,
          valueMonth1: '',
          valueMonth2: '',
          valueMonth3: '',
          valueMonth4: '',
          valueMonth5: '',
          valueMonth6: '',
          valueMonth7: '',
          valueMonth8: '',
          valueMonth9: '',
          valueMonth10: '',
          valueMonth11: '',
          valueMonth12: '',
          undertaker: planModalData.form.undertaker,
          markForEdit: false,
          markForDelete: false
        };
        plan[`useMonth${this.monthIndexMap[tag.month]}`] = true;
        plan[`valueMonth${this.monthIndexMap[tag.month]}`] = this.targetValue;
        this._plans.push(plan);
      }
    }
    this.remappingYear();
    if (this._plans.length > 0 && this.selectedPlan.length === 0) {
      // if never select year before
      this.selectedYear = this._plans[0].planYear;
    }
    this.yearChange(this.selectedYear);
    this.planTable.renderRows();
  }

  getYears(resultRecords: ResultRecord[]) {
    return resultRecords.map(res => res.year);
  }

  getResultRecord(resultRecords: ResultRecord[], year: string): ResultRecord {
    return resultRecords.find((res) => res.year == year);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  yearChange(year: number) {
    const plan = this._plans.find((v) => v.planYear === year);
    this.selectedPlan = plan ? [plan] : [];
  }

  remappingYear() {
    this.years = this._plans
      .filter(v => !v.markForDelete)
      .map(v => v.planYear);
  }

}

import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTable } from '@angular/material/table';
import { Condition, Plan } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { TargetService } from '../../../target.service';
import { Method, ResultRecord } from '../../../target.types';
import { MethodModalComponent } from '../../modals/method-modal/method-modal.component';
import { ModalMode } from '../../modals/modal.type';

@Component({
  selector: 'app-method-table',
  templateUrl: './method-table.component.html',
  styleUrls: ['./method-table.component.scss']
})
export class MethodTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetId: number;
  @Input() subTargetId: number;
  @Input() mainMethodIndex: string;
  // @Input() methods: Plan[];
  _methods: Plan[];
  get methods(): Plan[] {
    return this._methods;
  }
  @Input() set methods(value: Plan[]) {
    this._methods = value;
    if (value.length > 0) {
      this.remappingYear();
      this.selectedYear = this.years[0];
      this.yearChange(this.selectedYear);
    }
  }
  @Input() targetValue: string;
  @Output() markForEdit: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('methodTable') methodTable: MatTable<Method>;
  @ViewChildren('yearSelect') yearSelects: QueryList<MatSelect>;

  selectedYear: number;
  selectedMethod: Plan[] = [];
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

  addMethod(): void {
    const dialogRef = this._matDialog.open(MethodModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: this._methods.filter(v => !v.markForDelete)
      }
    });
    dialogRef.afterClosed()
      .subscribe((methodModalData: any) => {
        if (!methodModalData) return; // cancel
        this.editMethods(methodModalData);
        this.methodTable.renderRows();
        this.markForEdit.emit(this.subTargetId);
      });
  }

  editMethod(index: number): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(MethodModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this._methods.filter(v => !v.markForDelete),
        selectedYear: this.selectedMethod[0].planYear
      }
    });
    dialogRef.afterClosed()
      .subscribe((methodModalData: any) => {
        if (!methodModalData) return; // cancel
        this.editMethods(methodModalData);
        this.methodTable.renderRows();
        this.markForEdit.emit(this.subTargetId);
      });
  }

  deleteMethod(): void {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        const index = this._methods.findIndex(v => v.planYear === this.selectedYear);
        if (this._methods[index].id === 0) {
          this._methods.splice(index, 1);
        } else {
          this._methods[index].markForDelete = true;
        }
        // reindex
        let newPriority = 1;
        for (let method of this._methods) {
          if (!method.markForDelete) {
            method.priority = newPriority;
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
          this.selectedMethod = [];
        }
        this.methodTable.renderRows();
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

  editMethods(methodModalData: any): void {
    for (let method of this._methods) {
      if (!method.markForDelete) {
        method.planDescription = methodModalData.form.planDescription;
        method.undertaker = methodModalData.form.undertaker;
        method.markForEdit = true;
      }
    }

    for (let tag of methodModalData.yearMonthTags) {
      let plan: Plan;
      const findMethod = this._methods.find(v => v.planYear === parseInt(tag.year) && !v.markForDelete);
      if (findMethod) {
        // already have year in _methods
        findMethod[`useMonth${this.monthIndexMap[tag.month]}`] = true;
        findMethod[`valueMonth${this.monthIndexMap[tag.month]}`] = this.targetValue;
        findMethod.markForEdit = true;
      } else {
        // not have year in _methods
        plan = {
          id: 0,
          priority: this._methods.length + 1,
          planDescription: methodModalData.form.planDescription,
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
          undertaker: methodModalData.form.undertaker,
          markForEdit:  false,
          markForDelete: false
        };
        plan[`useMonth${this.monthIndexMap[tag.month]}`] = true;
        plan[`valueMonth${this.monthIndexMap[tag.month]}`] = this.targetValue;
        this._methods.push(plan);
      }
    }
    this.remappingYear();
    if (this._methods.length > 0 && this.selectedMethod.length === 0) {
      // if never select year before
      this.selectedYear = this._methods[0].planYear;
    }
    this.yearChange(this.selectedYear);
    this.methodTable.renderRows();
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
    const method = this._methods.find((v) => v.planYear === year);
    this.selectedMethod = method ? [method] : [];
  }

  remappingYear() {
    this.years = this._methods
      .filter(v => !v.markForDelete)
      .map(v => v.planYear);
  }

}

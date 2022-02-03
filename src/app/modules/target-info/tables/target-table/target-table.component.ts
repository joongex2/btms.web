import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTable } from '@angular/material/table';
import { ResultRecord, SubTarget, Target } from '../../target.types';
import { SubTargetTableComponent } from '../sub-target-table/sub-target-table.component';
import { TargetService } from './../../target.service';
import { expandableTableRowAnimation } from './../table-animation';

@Component({
  selector: 'app-target-table',
  templateUrl: './target-table.component.html',
  styleUrls: ['./target-table.component.scss'],
  animations: [expandableTableRowAnimation]
})
export class TargetTableComponent implements OnInit {
  @Input() dataSource: any;
  @Input() displayedColumns: string[];
  @Input() title: string;
  @Input() renderTemplate: string;

  @Input() runningNo: string;
  @Input() targetId: string;

  @Output() addTarget: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addSubTarget: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addMainMethod: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addPlan: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addMethod: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() editTarget: EventEmitter<number> = new EventEmitter<number>();
  @Output() editSubTarget: EventEmitter<number> = new EventEmitter<number>();
  @Output() editPlan: EventEmitter<number> = new EventEmitter<number>();
  @Output() editMethod: EventEmitter<number> = new EventEmitter<number>();

  @Output() deleteTarget: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteSubTarget: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteMainMethod: EventEmitter<number> = new EventEmitter<number>();
  @Output() deletePlan: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteMethod: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChildren('yearSelect') yearSelects: QueryList<MatSelect>;
  @ViewChildren(SubTargetTableComponent) subTargetTables: QueryList<SubTargetTableComponent>;

  expandedId: string = '';

  // subTargetModal
  type = [
    { name: 'type1', value: 1 },
    { name: 'type2', value: 2 }
  ];
  targetValues = [
    { name: 'targetValue1', value: 1 },
    { name: 'targetValue2', value: 2 }
  ];
  start1 = [
    { name: 'start11', value: 1 },
    { name: 'start12', value: 2 }
  ];
  start2 = [
    { name: 'start21', value: 1 },
    { name: 'start22', value: 2 }
  ];
  finish1 = [
    { name: 'finish1', value: 1 },
    { name: 'finish2', value: 2 }
  ];
  finish2 = [
    { name: 'finish21', value: 1 },
    { name: 'finish22', value: 2 }
  ];

  selectedType: string;
  selectedTargetValue: string;
  selectedStart1: string;
  selectedStart2: string;
  selectedFinish1: string;
  selectedFinish2: string;

  expandedTargets: Target[] = [];
  expandedSubtargets: SubTarget[] = [];

  subMethodColumns: any = [
    'year',
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
  ]

  keyToColumnName: any = {
    'targetId': 'ลำดับที่',
    'name': 'หัวข้อเป้าหมาย',
    'standard': 'Standard',
    'relativeTarget': 'พันธะมุ่งหมาย',
    'subTargetId': 'ลำดับที่',
    'subTargetName': 'หัวข้อเป้าหมายย่อย',
    'index': 'ดัชนี',
    'symbolValue': 'ค่าเป้าหมาย',
    'unit': 'หน่วย',
    'currentValue': 'ค่าปัจจุบัน',
    'startMonth': 'เริ่ม (เดือน)',
    'startYear': 'เริ่ม (ปี)',
    'finishMonth': 'เสร็จ (เดือน)',
    'finishYear': 'เสร็จ (ปี)',
    'planName': 'Plan',
    'planActual': 'กำหนดเสร็จ',
    'planResource': 'ทรัพยากร',
    'planOwner': 'ผู้รับผิดชอบ',
    'methodId': 'ลำดับที่',
    'methodName': 'รายละเอียด',
    'year': 'ปี',
    'jan': 'Jan',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Apr',
    'may': 'May',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Aug',
    'sep': 'Sep',
    'oct': 'Oct',
    'nov': 'Nov',
    'dec': 'Dec',
    'owner': 'ผู้รับผิดชอบ'
  };

  constructor(
    private targetService: TargetService,
    private cdr: ChangeDetectorRef,
    private _matDialog: MatDialog
  ) { }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges(); // temp fix ExpressionChangedAfterItHasBeenCheckedError
  }

  toggleExpandableSymbol(id: string): void {
    this.expandedId = this.expandedId === id ? '' : id;
  }

  refreshMasterTable() {
    this.dataSource = [...this.targetService.getTargets(this.runningNo)];
    this.cdr.detectChanges();
  }

  getExpandedElements(): any[] {
    switch (this.renderTemplate) {
      case 'target':
        return this.expandedTargets;
      case 'subTarget':
        return this.expandedSubtargets;
      default: return;
    }
  }

  checkExpanded(element): boolean {
    let expandedElements = this.getExpandedElements();
    if (!expandedElements) return;

    let flag = false;
    expandedElements.forEach(e => {
      if (e === element) {
        flag = true;
      }
    });
    return flag;
  }

  pushPopElement(element) {
    let expandedElements = this.getExpandedElements();
    if (!expandedElements) return;

    const index = expandedElements.indexOf(element);
    if (index === -1) {
      expandedElements.push(element);
    } else {
      expandedElements.splice(index, 1);
    }
  }

  expandAll(): void {
    switch (this.renderTemplate) {
      case ('target'):
        for (let data of this.dataSource) {
          if (this.expandedTargets.indexOf(data) === -1) this.expandedTargets.push(data);
        }
        for (let subTargetTable of this.subTargetTables) {
          subTargetTable.expandAll();
        }
        break;
      case ('subTarget'):
        for (let data of this.dataSource) {
          this.expandedSubtargets.push(data);
        }
        break;
      default: return;
    }
  }

  collapseAll(): void {
    switch (this.renderTemplate) {
      case ('target'):
        this.expandedTargets = [];
        for (let subTargetTable of this.subTargetTables) {
          subTargetTable.collapseAll();
        }
        break;
      case ('subTarget'):
        this.expandedSubtargets = [];
        break;
      default: return;
    }
  }

  getYears(resultRecords: ResultRecord[]) {
    return resultRecords.map(res => res.year);
  }

  getResultRecord(resultRecords: ResultRecord[], year: string): ResultRecord {
    return resultRecords.find((res) => res.year == year);
  }

  ngOnInit(): void {
  }
}

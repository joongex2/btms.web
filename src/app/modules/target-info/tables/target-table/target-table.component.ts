import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
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
  @Input() referenceId: string;
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

  keyToColumnName: any = {
    'targetId': 'ลำดับที่',
    'name': 'หัวข้อเป้าหมาย',
    'standard': 'Standard',
    'relativeTarget': 'พันธะมุ่งหมาย',
    'subTargetId': 'ลำดับที่',
    'subTargetName': 'หัวข้อเป้าหมาย',
    'index': 'ดัชนี',
    'value': 'ค่าเป้าหมาย',
    'unit': 'หน่วย',
    'currentValue': 'ค่าปัจจุบัน',
    'startMonth': 'กำหนดเริ่ม (เดือน)',
    'startYear': 'กำหนดเริ่ม (ปี)',
    'finishMonth': 'กำหนดเสร็จ (เดือน)',
    'finishYear': 'กำหนดเสร็จ (ปี)',
    'planName': 'Plan',
    'planActual': 'Actual',
    'planResource': 'ทรัพยากรที่ต้องการ',
    'planOwner': 'ผู้รับผิดชอบ',
    'methodId': 'ลำดับที่',
    'methodName': 'วิธีการ/แผนงาน',
    'jan': 'ม.ค.',
    'feb': 'ก.พ.',
    'mar': 'มี.ค.',
    'apr': 'เม.ย.',
    'may': 'พ.ค.',
    'jun': 'มิ.ย.',
    'jul': 'ก.ค.',
    'aug': 'ส.ค.',
    'sep': 'ก.ย.',
    'oct': 'ต.ค.',
    'nov': 'พ.ย.',
    'dec': 'ธ.ค.',
    'owner': 'ผู้รับผิดชอบ'
  };

  constructor(
    private targetService: TargetService,
    private cdr: ChangeDetectorRef,
    private _matDialog: MatDialog
  ) { }

  toggleExpandableSymbol(id: string): void {
    this.expandedId = this.expandedId === id ? '' : id;
  }

  refreshMasterTable() {
    this.dataSource = [...this.targetService.getTargets(this.runningNo)];
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
  }
}

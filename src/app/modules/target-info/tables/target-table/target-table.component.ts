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

  @Output() refreshTable: EventEmitter<number> = new EventEmitter<number>();
  @Output() addTarget: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addSubTarget: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addMethod: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() editTarget: EventEmitter<number> = new EventEmitter<number>();
  @Output() editSubTarget: EventEmitter<number> = new EventEmitter<number>();
  @Output() editMethod: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteTarget: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteSubTarget: EventEmitter<number> = new EventEmitter<number>();
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

  // addSubTarget(targetId: string, subTargetModal: any) {
  // console.log(`runningNo: ${this.runningNo}, target ID: ${targetId}`);
  // const mockSubTarget: SubTarget = {
  //   "Sub Target ID": "2",
  //   "Sub Target Name": "2",
  //   "Index": "2",
  //   "Value": "2",
  //   "Unit": "2",
  //   "Current Value": "2",
  //   "Start Month": "2",
  //   "Start Year": "2",
  //   "Finish Month": "2",
  //   "Finish Year": "2"
  // }
  // this.modalService.open(subTargetModal, { size: 'lg' });
  // this.targetService.addSubTarget(this.runningNo, targetId, mockSubTarget);
  // this.refreshMasterTable();

  // Open the dialog
  //   const dialogRef = this._matDialog.open(AddSubTargetModalComponent,
  //      {
  //       scrollStrategy: new NoopScrollStrategy()
  //      });

  //   dialogRef.afterClosed()
  //   .subscribe((result) => {
  //       console.log('Compose dialog was closed!');
  //   });
  // }

  // addMethod(subTargetId: string, methodModal: any) {
  // console.log(`runningNo: ${this.runningNo}, target ID: ${this.targetId}, sub target ID: ${subTargetId}`);
  // const mockMethod: Method = {
  //   "Method ID": "2",
  //   "Method Name": "2",
  //   "Jan": "2",
  //   "Feb": "2",
  //   "Mar": "2",
  //   "Apr": "2",
  //   "May": "2",
  //   "Jun": "2",
  //   "Jul": "2",
  //   "Aug": "2",
  //   "Sep": "2",
  //   "Oct": "2",
  //   "Nov": "2",
  //   "Dec": "2",
  //   "Owner": "2",
  // }
  // this.modalService.open(methodModal, { size: 'lg' });
  // this.targetService.addMethod(this.runningNo, this.targetId, subTargetId, mockMethod);
  // this.refreshTable.next(1);
  // Open the dialog
  //   const dialogRef = this._matDialog.open(AddMethodModalComponent);

  //   dialogRef.afterClosed()
  //   .subscribe((result) => {
  //       console.log('Compose dialog was closed!');
  //   });
  // }

  refreshMasterTable() {
    console.log('refreshMasterTable');
    this.dataSource = [...this.targetService.getTargets(this.runningNo)];
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
  }
}

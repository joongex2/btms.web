import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { expandableTableRowAnimation } from './../table-animation'
import { Method, SubTarget } from './../../target.types';
import { TargetService } from './../../target.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMethodModalComponent } from '../../modals/add-method-modal/add-method-modal.component';
import { AddSubTargetModalComponent } from '../../modals/add-sub-target-modal/add-sub-target-modal.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

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
  @Input() iconKeyReference: string;
  @Input() renderTemplate: string;

  @Input() runningNo: string;
  @Input() targetId: string;

  @Output() deleteTarget: EventEmitter<number> = new EventEmitter<number>();
  @Output() refreshTable: EventEmitter<number> = new EventEmitter<number>();

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
    'Target ID': 'ลำดับที่',
    'Name': 'หัวข้อเป้าหมาย',
    'Standard': 'Standard',
    'Relative Target': 'พันธะมุ่งหมาย',
    'Sub Target ID': 'ลำดับที่',
    'Sub Target Name': 'หัวข้อเป้าหมาย',
    'Index': 'ดัชนี',
    'Value': 'ค่าเป้าหมาย',
    'Unit': 'หน่วย',
    'Current Value': 'ค่าปัจจุบัน',
    'Start Month': 'กำหนดเริ่ม (เดือน)',
    'Start Year': 'กำหนดเริ่ม (ปี)',
    'Finish Month': 'กำหนดเสร็จ (เดือน)',
    'Finish Year': 'กำหนดเสร็จ (ปี)',
    'Method ID': 'ลำดับที่',
    'Method Name': 'วิธีการ/แผนงาน',
    'Jan': 'ม.ค.',
    'Feb': 'ก.พ.',
    'Mar': 'มี.ค.',
    'Apr': 'เม.ย.',
    'May': 'พ.ค.',
    'Jun': 'มิ.ย.',
    'Jul': 'ก.ค.',
    'Aug': 'ส.ค.',
    'Sep': 'ก.ย.',
    'Oct': 'ต.ค.',
    'Nov': 'พ.ย.',
    'Dec': 'ธ.ค.',
    'Owner': 'ผู้รับผิดชอบ'
  };

  keyToColumnDef: any = {
    'expandIcon': 'expandIcon',
    'deleteIcon': 'deleteIcon',
    'Target ID': 'targetId',
    'Name': 'name',
    'Standard': 'standard',
    'Relative Target': 'relativeTarget',
    'Sub Target ID': 'subTargetId',
    'Index': 'index',
    'Value': 'value',
    'Unit': 'unit',
    'Current Value': 'currentValue',
    'Start Month': 'startMonth',
    'Start Year': 'startYear',
    'Finish Month': 'finishMonth',
    'Finish Year': 'finishYear',
    'Method ID': 'methodId',
    'Method Name': 'methodName',
    'Jan': 'jan',
    'Feb': 'feb',
    'Mar': 'mar',
    'Apr': 'apr',
    'May': 'may',
    'Jun': 'jun',
    'Jul': 'jul',
    'Aug': 'aug',
    'Sep': 'sep',
    'Oct': 'oct',
    'Nov': 'nov',
    'Dec': 'dec',
    'Owner': 'owner'
  };

  constructor(
    private targetService: TargetService,
    private cdr: ChangeDetectorRef,
    private _matDialog: MatDialog
  ) { }
  
  toggleExpandableSymbol(id: string): void {
    this.expandedId = this.expandedId === id ? '' : id;
  }

  addSubTarget(targetId: string, subTargetModal: any) {
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
    const dialogRef = this._matDialog.open(AddSubTargetModalComponent,
       {
        scrollStrategy: new NoopScrollStrategy()
       });

    dialogRef.afterClosed()
    .subscribe((result) => {
        console.log('Compose dialog was closed!');
    });
  }

  addMethod(subTargetId: string, methodModal: any) {
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
    const dialogRef = this._matDialog.open(AddMethodModalComponent);

    dialogRef.afterClosed()
    .subscribe((result) => {
        console.log('Compose dialog was closed!');
    });
  }

  refreshMasterTable() {
    console.log('refreshMasterTable');
    this.dataSource = [...this.targetService.getTargets(this.runningNo)];
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
  }
}

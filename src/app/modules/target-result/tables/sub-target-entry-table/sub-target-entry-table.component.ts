import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { SubTargetRecord } from 'app/modules/target-info/target.types';

@Component({
  selector: 'app-sub-target-entry-table',
  templateUrl: './sub-target-entry-table.component.html',
  styleUrls: ['./sub-target-entry-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SubTargetEntryTableComponent implements OnInit {
  @Input() dataSource: SubTargetRecord[];
  @Input() runningNo: string;
  @Input() targetIndex: number;

  subTargetHeader = ['expandIcon', 'subTargetId', 'subTargetName', 'index', 'value', 'unit', 'currentValue', 'startMonth', 'startYear', 'finishMonth', 'finishYear']
  subTargetRow1 = ['expandIcon', 'subTargetId', 'subTargetName', 'index', 'value', 'unit', 'currentValue', 'startMonth', 'startYear', 'finishMonth', 'finishYear'];
  subTargetRow2 = ['expandedDetail'];

  expandedSubtargets: SubTargetRecord[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  checkExpanded(element): boolean {
    let flag = false;
    this.expandedSubtargets.forEach(e => {
      if (e === element) {
        flag = true;
      }
    });
    return flag;
  }

  pushPopElement(element) {
    const index = this.expandedSubtargets.indexOf(element);
    if (index === -1) {
      this.expandedSubtargets.push(element);
    } else {
      this.expandedSubtargets.splice(index, 1);
    }
  }

  expandAll() {
    for (let subTarget of this.dataSource) {
      this.expandedSubtargets.push(subTarget);
    }
  }

  collapseAll() {
    this.expandedSubtargets = [];
  }


}

import { Component, Input, OnInit } from '@angular/core';
import { SubTargetRecord } from 'app/modules/target-info/target.types';
import { detailExpandAnimation } from 'app/shared/table-animation';

@Component({
  selector: 'app-sub-target-entry-table',
  templateUrl: './sub-target-entry-table.component.html',
  styleUrls: ['./sub-target-entry-table.component.scss'],
  animations: [detailExpandAnimation],
})
export class SubTargetEntryTableComponent implements OnInit {
  @Input() subTargets: SubTargetRecord[];
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
    for (let subTarget of this.subTargets) {
      this.expandedSubtargets.push(subTarget);
    }
  }

  collapseAll() {
    this.expandedSubtargets = [];
  }


}

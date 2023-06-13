import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { DocumentDetail, SubTarget } from 'app/shared/interfaces/document.interface';
import { detailExpandAnimation } from 'app/shared/table-animation';
import { PlanEntryTableComponent } from '../plan-entry-table/plan-entry-table.component';

@Component({
  selector: 'app-sub-target-entry-table',
  templateUrl: './sub-target-entry-table.component.html',
  styleUrls: ['./sub-target-entry-table.component.scss'],
  animations: [detailExpandAnimation],
})
export class SubTargetEntryTableComponent implements OnInit {
  @Input() subTargets: SubTarget[];
  @Input() targetId: number;
  @Input() documentId: number;
  @Input() document: Partial<DocumentDetail>;
  @Input() user: User;
  hideSubTargetIds: number[] = [];

  subTargetHeader = ['expandIcon', 'priority', 'targetDetailDescription', 'targetIndex', 'measureType', 'targetValue', 'targetUnit', 'currentTarget', 'startMonth', 'startYear', 'finishMonth', 'finishYear']
  subTargetRow1 = ['expandIcon', 'priority', 'targetDetailDescription', 'targetIndex', 'measureType', 'targetValue', 'targetUnit', 'currentTarget', 'startMonth', 'startYear', 'finishMonth', 'finishYear'];
  subTargetRow2 = ['expandedDetail'];

  expandedSubtargets: SubTarget[] = [];

  @ViewChildren(PlanEntryTableComponent) planEntryTables: QueryList<PlanEntryTableComponent>;

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

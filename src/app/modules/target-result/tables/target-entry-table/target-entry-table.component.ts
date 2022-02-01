import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TargetRecord } from 'app/modules/target-info/target.types';
import { SubTargetEntryTableComponent } from '../sub-target-entry-table/sub-target-entry-table.component';

@Component({
  selector: 'app-target-entry-table',
  templateUrl: './target-entry-table.component.html',
  styleUrls: ['./target-entry-table.component.scss'],
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
export class TargetEntryTableComponent implements OnInit {
  @Input() dataSource: TargetRecord[];
  @Input() runningNo: string;

  @ViewChildren(SubTargetEntryTableComponent) subTargetEntryTables: QueryList<SubTargetEntryTableComponent>;

  targetHeader1 = ['targetDetailSpanned', 'ownerSpanned', 'year', 'blankSpanned', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  targetHeader2 = ['blank'];
  targetRow1 = ['targetDetail'];
  targetRow2 = ['expandedDetail'];

  expandedTargets: TargetRecord[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges(); // temp fix ExpressionChangedAfterItHasBeenCheckedError
  }

  checkExpanded(element): boolean {
    let flag = false;
    this.expandedTargets.forEach(e => {
      if (e === element) {
        flag = true;
      }
    });
    return flag;
  }

  pushPopElement(element) {
    const index = this.expandedTargets.indexOf(element);
    if (index === -1) {
      this.expandedTargets.push(element);
    } else {
      this.expandedTargets.splice(index, 1);
    }
  }

  expandAll() {
    for (let target of this.dataSource) {
      this.expandedTargets.push(target);
    }
    for (let subTargetEntryTable of this.subTargetEntryTables) {
      subTargetEntryTable.expandAll();
    }
  }

  collapseAll() {
    this.expandedTargets = [];
    for (let subTargetEntryTable of this.subTargetEntryTables) {
      subTargetEntryTable.collapseAll();
    }
  }

}

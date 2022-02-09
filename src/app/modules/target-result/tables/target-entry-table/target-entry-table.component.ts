import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TargetRecord } from 'app/modules/target-info/target.types';
import { detailExpandAnimation } from 'app/shared/table-animation';
import { SubTargetEntryTableComponent } from '../sub-target-entry-table/sub-target-entry-table.component';

@Component({
  selector: 'app-target-entry-table',
  templateUrl: './target-entry-table.component.html',
  styleUrls: ['./target-entry-table.component.scss'],
  animations: [detailExpandAnimation],
})
export class TargetEntryTableComponent implements OnInit {
  @Input() targets: TargetRecord[];
  @Input() runningNo: string;

  @ViewChildren(SubTargetEntryTableComponent) subTargetEntryTables: QueryList<SubTargetEntryTableComponent>;

  targetHeader = ['expandIcon', 'targetId', 'name', 'standard', 'relativeTarget'];
  targetRow1 = ['expandIcon', 'targetId', 'name', 'standard', 'relativeTarget'];
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
    for (let target of this.targets) {
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

import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { DocumentDetail, Target } from 'app/shared/interfaces/document.interface';
import { detailExpandAnimation } from 'app/shared/table-animation';
import { SubTargetEntryTableComponent } from '../sub-target-entry-table/sub-target-entry-table.component';

@Component({
  selector: 'app-target-entry-table',
  templateUrl: './target-entry-table.component.html',
  styleUrls: ['./target-entry-table.component.scss'],
  animations: [detailExpandAnimation],
})
export class TargetEntryTableComponent implements OnInit {
  @Input() targets: Target[];
  @Input() documentId: number;
  @Input() document: Partial<DocumentDetail>;
  @Input() user: User;
  hideTargetIds: number[] = [];

  @ViewChildren(SubTargetEntryTableComponent) subTargetEntryTables: QueryList<SubTargetEntryTableComponent>;

  targetHeader = ['expandIcon', 'priority', 'targetName', 'targetType', 'standard'];
  targetRow1 = ['expandIcon', 'priority', 'targetName', 'targetType', 'standard'];
  targetRow2 = ['expandedDetail'];

  expandedTargets: Target[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges(); // temp fix ExpressionChangedAfterItHasBeenCheckedError
  }

  checkExpandAll(): boolean {
    return this.targets && this.targets.length > 0 && this.expandedTargets.length == this.targets.length;
  }

  expandOrCollapseAll() {
    if (this.checkExpandAll()) {
      this.collapseAll();
    } else {
      this.expandAll();
    }
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

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ModalMode } from 'app/modules/target-info/target-management/modals/modal.type';
import { Cause, CauseRecord } from 'app/modules/target-info/target.types';
import { detailExpandAnimation } from 'app/shared/table-animation';
import { CauseModalComponent } from '../../modals/cause-modal/cause-modal.component';

@Component({
  selector: 'app-cause-table',
  templateUrl: './cause-table.component.html',
  styleUrls: ['./cause-table.component.scss'],
  animations: [detailExpandAnimation],
})
export class CauseTableComponent implements OnInit {
  @Input() causes: CauseRecord[];
  @Input() readonly = false;

  @ViewChild('causeTable') causeTable: MatTable<Cause>;

  expandedCauses = [];
  dataColumns = [
    'expandIcon',
    'causeNo',
    'causeDetail',
    'causeNote',
    'causeStatus',
    'editIcon',
    'deleteIcon'
  ];

  constructor(
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  checkExpanded(element): boolean {
    let flag = false;
    this.expandedCauses.forEach(e => {
      if (e === element) {
        flag = true;
      }
    });
    return flag;
  }

  pushPopElement(element) {
    const index = this.expandedCauses.indexOf(element);
    if (index === -1) {
      this.expandedCauses.push(element);
    } else {
      this.expandedCauses.splice(index, 1);
    }
  }

  checkExpandAll(): boolean {
    return this.causes.length > 0 && this.expandedCauses.length == this.causes.length;
  }

  expandOrCollapseAll() {
    if (this.checkExpandAll()) {
      this.collapseAll();
    } else {
      this.expandAll();
    }
  }

  expandAll() {
    for (let cause of this.causes) {
      if (this.expandedCauses.indexOf(cause) === -1) this.expandedCauses.push(cause);
    }
  }

  collapseAll() {
    this.expandedCauses = [];
  }

  addCause(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CauseModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((cause: Cause) => {
        if (!cause) return; // cancel
        this.causes.push({
          data: cause,
          kids: {
            fixRecords: [],
            protectRecords: []
          }
        });
        this.causeTable.renderRows();
      });
  };

  editCause(index: number): void {
    const dialogRef = this._matDialog.open(CauseModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.causes[index].data
      }
    });
    dialogRef.afterClosed()
      .subscribe((cause: Cause) => {
        if (!cause) return; // cancel
        this.causes[index].data = cause;
        this.causeTable.renderRows();
      });
  };

  deleteCause(index: number): void {
    this.causes.splice(index, 1);
    this.causeTable.renderRows();
  };

}

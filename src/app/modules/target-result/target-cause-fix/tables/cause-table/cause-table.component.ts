import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ModalMode } from 'app/modules/target-info/target-management/modals/modal.type';
import { Cause } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { detailExpandAnimation } from 'app/shared/table-animation';
import { CauseModalComponent } from '../../modals/cause-modal/cause-modal.component';
import { FixTableComponent } from '../fix-table/fix-table.component';
import { ProtectTableComponent } from '../protect-table/protect-table.component';

@Component({
  selector: 'app-cause-table',
  templateUrl: './cause-table.component.html',
  styleUrls: ['./cause-table.component.scss'],
  animations: [detailExpandAnimation],
})
export class CauseTableComponent implements OnInit {
  @Input() causes: Cause[];
  @Input() readonly = false;
  @Input() targetReferenceId: number;
  @ViewChild('causeTable') causeTable: MatTable<Cause>;
  @ViewChildren('fixTable') fixTables: QueryList<FixTableComponent>;
  @ViewChildren('protectTable') protectTables: QueryList<ProtectTableComponent>;

  expandedCauses = [];
  dataColumns = [
    'expandIcon',
    'sequenceNo',
    'causeTopic',
    'causeDescription',
    'causeStatus',
    'editIcon',
    'deleteIcon'
  ];

  constructor(
    private _matDialog: MatDialog,
    private _confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void { }

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
        data: undefined,
        index: this.causes.filter(v => !v.markForDelete).length + 1
      }
    });
    dialogRef.afterClosed()
      .subscribe((cause: Cause) => {
        if (!cause) return; // cancel
        this.causes.push({
          id: 0,
          sequenceNo: cause.sequenceNo,
          causeTopic: cause.causeTopic,
          causeStatus: cause.causeStatus,
          causeDescription: cause.causeDescription,
          solutions: []
        });
        this.causeTable.renderRows();
      });
  };

  editCause(index: number): void {
    const dialogRef = this._matDialog.open(CauseModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.causes[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((cause: Cause) => {
        if (!cause) return; // cancel
        this.causes[index].causeTopic = cause.causeTopic;
        this.causes[index].causeDescription = cause.causeDescription;
        this.causes[index].causeStatus = cause.causeStatus;
        this.causes[index].markForEdit = true;
        this.causeTable.renderRows();
      });
  };

  deleteCause(index: number): void {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        if (this.causes[index].id === 0) {
          this.causes.splice(index, 1);
        } else {
          this.causes[index].markForDelete = true;
        }
        // reindex
        let newSequenceNo = 1;
        for (let cause of this.causes) {
          if (!cause.markForDelete) {
            if (cause.sequenceNo !== newSequenceNo) {
              cause.sequenceNo = newSequenceNo;
              cause.markForEdit = true;
            }
            newSequenceNo++;
          }
        }
        this.causeTable.renderRows();
        // this.markForEdit.emit(this.documentId);
      }
    });
  };

  markForEditHandler(causeId: number) {
    const target = this.causes.find(v => v.id === causeId);
    if (target) target.markForEdit = true;
  }

}

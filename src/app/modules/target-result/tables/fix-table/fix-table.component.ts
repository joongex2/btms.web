import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ModalMode } from 'app/modules/target-info/target-management/modals/modal.type';
import { Fix, FixRecord } from 'app/modules/target-info/target.types';
import { FixModalComponent } from '../../modals/fix-modal/fix-modal.component';

@Component({
  selector: 'app-fix-table',
  templateUrl: './fix-table.component.html',
  styleUrls: ['./fix-table.component.scss']
})
export class FixTableComponent implements OnInit {
  @Input() fixs: FixRecord[];

  @ViewChild('fixTable') fixTable: MatTable<Fix>

  dataColumns = [
    'fixNo',
    'fixDetail',
    'fixOwner',
    'fixDueDate',
    'fixFollow',
    'fixStartDate',
    'editIcon',
    'deleteIcon'
  ];

  constructor(
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  addFix(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(FixModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((fix: Fix) => {
        if (!fix) return; // cancel
        this.fixs.push({
          data: fix
        });
        this.fixTable.renderRows();
      });
  };

  editFix(index: number): void {
    const dialogRef = this._matDialog.open(FixModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.fixs[index].data
      }
    });
    dialogRef.afterClosed()
      .subscribe((fix: Fix) => {
        if (!fix) return; // cancel
        this.fixs[index].data = fix;
        this.fixTable.renderRows();
      });
  };

  deleteFix(index: number): void {
    this.fixs.splice(index, 1);
    this.fixTable.renderRows();
  };

}

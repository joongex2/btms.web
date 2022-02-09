import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ModalMode } from 'app/modules/target-info/modals/modal.type';
import { Protect, ProtectRecord } from 'app/modules/target-info/target.types';
import { ProtectModalComponent } from '../../modals/protect-modal/protect-modal.component';

@Component({
  selector: 'app-protect-table',
  templateUrl: './protect-table.component.html',
  styleUrls: ['./protect-table.component.scss']
})
export class ProtectTableComponent implements OnInit {
  @Input() protects: ProtectRecord[]

  @ViewChild('protectTable') protectTable: MatTable<Protect>;

  dataColumns = [
    'protectNo',
    'protectDetail',
    'protectOwner',
    'protectDueDate',
    'protectFollow',
    'protectStartDate',
    'editIcon',
    'deleteIcon'
  ];

  constructor(
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }


  addProtect(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(ProtectModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((protect: Protect) => {
        if (!protect) return; // cancel
        this.protects.push({
          data: protect
        });
        this.protectTable.renderRows();
      });
  };
  editProtect(index: number): void {
    const dialogRef = this._matDialog.open(ProtectModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.protects[index].data
      }
    });
    dialogRef.afterClosed()
      .subscribe((protect: Protect) => {
        if (!protect) return; // cancel
        this.protects[index].data = protect;
        this.protectTable.renderRows();
      });
  };
  deleteProtect(index: number): void {
    this.protects.splice(index, 1);
    this.protectTable.renderRows();
  };

}

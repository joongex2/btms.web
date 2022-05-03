import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { detailExpandAnimation } from 'app/shared/table-animation';

export interface ReceiveMail {
  id: number;
  role: string;
  name: string;
  email: string;
}

const receiveMails: ReceiveMail[] = [
  { id: 1, role: 'ผู้สร้างเป้าหมาย', name: 'Nawapat Prasong', email: 'thanawans@betagro.com' },
  { id: 2, role: 'ผู้สร้างเป้าหมาย', name: 'Thanawan Sankum', email: 'thanawans@betagro.com' },
  { id: 3, role: 'ผู้สร้างเป้าหมาย', name: 'Matsupa Luesat', email: 'thanawans@betagro.com' }
];

@Component({
  selector: 'app-receive-mail-table',
  templateUrl: './receive-mail-table.component.html',
  styleUrls: ['./receive-mail-table.component.scss'],
  animations: [detailExpandAnimation],
})
export class ReceiveMailTableComponent implements OnInit {
  displayedColumns: string[] = ['select', 'role', 'name', 'email'];
  dataSource = new MatTableDataSource<ReceiveMail>(receiveMails);
  selection = new SelectionModel<ReceiveMail>(true, []);

  constructor(
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ReceiveMail): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}

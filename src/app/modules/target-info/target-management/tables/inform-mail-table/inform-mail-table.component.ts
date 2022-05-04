import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { detailExpandAnimation } from 'app/shared/table-animation';

export interface InformMail {
  id: number;
  name: string;
  email: string;
}

const informMails: InformMail[] = [
  { id: 1, name: 'Matsupa Luesat', email: 'thanawans@betagro.com' },
  { id: 2, name: 'Nawapat Prasong', email: 'thanawans@betagro.com' },
  { id: 3, name: 'Thanawan Sankum', email: 'thanawans@betagro.com' }
];

@Component({
  selector: 'app-inform-mail-table',
  templateUrl: './inform-mail-table.component.html',
  styleUrls: ['./inform-mail-table.component.scss'],
  animations: [detailExpandAnimation],
})
export class InformMailTable implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'email'];
  dataSource = new MatTableDataSource<InformMail>(informMails);
  selection = new SelectionModel<InformMail>(true, []);

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
  checkboxLabel(row?: InformMail): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}

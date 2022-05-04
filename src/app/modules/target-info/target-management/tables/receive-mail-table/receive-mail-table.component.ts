import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ReceiveEmail } from 'app/shared/interfaces/document.interface';
import { detailExpandAnimation } from 'app/shared/table-animation';

@Component({
  selector: 'app-receive-mail-table',
  templateUrl: './receive-mail-table.component.html',
  styleUrls: ['./receive-mail-table.component.scss'],
  animations: [detailExpandAnimation],
})
export class ReceiveMailTableComponent implements OnInit {
  dataSource = new MatTableDataSource<ReceiveEmail>([]);
  _receiveEmails: ReceiveEmail[];
  get receiveEmails(): ReceiveEmail[] {
    return this._receiveEmails;
  }
  @Input() set receiveEmails(value: ReceiveEmail[]) {
    this._receiveEmails = value;
    if (this._receiveEmails) {
      this.dataSource.data = this._receiveEmails;
    }
  }
  displayedColumns: string[] = ['select', 'role', 'name', 'email'];
  selection = new SelectionModel<ReceiveEmail>(true, []);

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
  checkboxLabel(index: number, row?: ReceiveEmail): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${index + 1}`;
  }
}

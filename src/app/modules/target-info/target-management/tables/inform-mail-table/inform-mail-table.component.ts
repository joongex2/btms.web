import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InformEmail } from 'app/shared/interfaces/document.interface';
import { detailExpandAnimation } from 'app/shared/table-animation';

@Component({
  selector: 'app-inform-mail-table',
  templateUrl: './inform-mail-table.component.html',
  styleUrls: ['./inform-mail-table.component.scss'],
  animations: [detailExpandAnimation],
})
export class InformMailTableComponent implements OnInit {
  dataSource = new MatTableDataSource<InformEmail>([]);
  _informEmails: InformEmail[];
  get informEmails(): InformEmail[] {
      return this._informEmails;
  }
  @Input() set informEmails(value: InformEmail[]) {
      this._informEmails = value;
      if (this._informEmails) {
        this.dataSource.data = this._informEmails;
      }
  }
  displayedColumns: string[] = ['select', 'name', 'email'];
  selection = new SelectionModel<InformEmail>(true, []);

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
  checkboxLabel(index: number, row?: InformEmail): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${index + 1}`;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalMode } from 'app/shared/interfaces/modal.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { LookupService } from 'app/shared/services/lookup.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { Lookup } from './lookup.interface';
import { LookupModalComponent } from './modals/lookup-modal/lookup-modal.component';



@Component({
  selector: 'lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // bind value
  dataSource: MatTableDataSource<Lookup> = new MatTableDataSource([]);
  code: string;
  selectedType: string;

  // select option
  types: any[];

  // table setting
  displayedColumns: string[] = [
    'index',
    'lookupType',
    'lookupCode',
    'lookupDescription',
    'lookupSequence',
    'isActive',
    'editDeleteIcon'
  ];

  keyToColumnName: any = {
    'index': 'No.',
    'lookupType': 'Type',
    'lookupCode': 'Code',
    'lookupDescription': 'Description',
    'lookupSequence': 'Sequence',
    'isActive': 'Status',
    'editDeleteIcon': ''
  };

  notSortColumn: string[] = [
    'index',
    'editDeleteIcon'
  ];

  constructor(
    private _lookupService: LookupService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _matDialog: MatDialog
  ) {
    this.loadLookups();
  }

  ngOnInit(): void {
    this._lookupService.getLookupTypes().subscribe({
      next: (types: any[]) => {
        this.types = types.map((type) => ({ title: type, value: type }));
      },
      error: (e) => console.log(e)
    });

    // default
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Lookup, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.code || data.lookupCode.toString().trim().toLowerCase().indexOf(searchString.code.toLowerCase()) !== -1)
        && (searchString.type == undefined || data.lookupType == searchString.type)
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      code: this.code,
      type: this.selectedType
    }
    this.dataSource.filter = JSON.stringify(filterValue);
    this.paginator.pageIndex = 0;
  }

  clear() {
    this.dataSource.filter = '{}';
    this.code = '';
    this.selectedType = undefined;
    this.paginator.pageIndex = 0;
  }

  addLookup(): void {
    const dialogRef = this._matDialog.open(LookupModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((isAdd: boolean) => {
        if (!isAdd) return; // cancel
        this.loadLookups();
      });
  }

  editLookup(element: Lookup) {
    this._lookupService.getLookup(element.id).subscribe({
      next: (lookup: Lookup) => {
        const dialogRef = this._matDialog.open(LookupModalComponent, {
          data: {
            mode: ModalMode.EDIT,
            data: lookup
          }
        });
        dialogRef.afterClosed()
          .subscribe((isEdit: boolean) => {
            if (!isEdit) return; // cancel
            this.loadLookups();
          });
      },
      error: (e) => {
        this._snackBarService.error();
        console.error(e)
      }
    });
  }

  deleteLookup(element: Lookup) {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this._lookupService.deleteLookup(element.id).subscribe({
          next: (v) => {
            this._snackBarService.success();
            this.loadLookups()
          },
          error: (e) => {
            this._snackBarService.error();
            console.error(e)
          }
        });
      }
    });
  }

  loadLookups() {
    this._lookupService.getLookups().subscribe({
      next: (lookups: Lookup[]) => this.dataSource.data = lookups,
      error: (e) => console.log(e)
    });
  }
}

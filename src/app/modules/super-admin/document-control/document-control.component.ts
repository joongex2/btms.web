import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ModalMode } from 'app/shared/interfaces/modal.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { DocumentControlService } from './document-control.service';
import { DocumentControl } from './document-control.types';
import { DocumentControlModalComponent } from './modals/document-control-modal/document-control-modal.component';




@Component({
  selector: 'document-control',
  templateUrl: './document-control.component.html',
  styleUrls: ['./document-control.component.scss']
})
export class DocumentControlComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  organizes: any[];
  documentTypes: any[] = [
    'BTMS_01',
    'BTMS_02',
    'BTMS_03'
  ];
  isActives: any = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];

  // bind value
  dataSource: MatTableDataSource<DocumentControl> = new MatTableDataSource([]);
  selectedOrganizeCode: string | any;
  documentCode: string;
  selectedDocumentType: string;
  prefix: string;
  // suffix: string;
  lengthOfRunningNo: string;
  lastDocumentNo: string;
  lastRunningNo: string;
  selectedIsActive: boolean;

  // table setting
  displayedColumns: string[] = [
    'index',
    'organizeCode',
    'documentCode',
    'documentType',
    'prefix',
    // 'suffix',
    'lengthOfRunningNo',
    'lastDocumentNo',
    'lastRunningNo',
    'isActive',
    'editDeleteIcon',
  ];

  keyToColumnName: any = {
    'index': 'No.',
    'organizeCode': 'Organize Code',
    'documentCode': 'Document Code',
    'documentType': 'Document Type',
    'prefix': 'Prefix',
    // 'suffix': 'Suffix',
    'lengthOfRunningNo': 'Length of Running No.',
    'lastDocumentNo': 'Last Document No.',
    'lastRunningNo': 'Last Running No.',
    'isActive': 'Status',
    'editDeleteIcon': ''
  };

  notSortColumn: string[] = [
    'index',
    'editDeleteIcon'
  ];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _documentControlService: DocumentControlService,
    private _confirmationService: ConfirmationService,
    private _snackBarService: SnackBarService,
    private _matDialog: MatDialog
  ) {
    this.loadDocumentControls();
  }

  ngOnInit(): void {
    const organizes = this._activatedRoute.snapshot.data.organizes;
    this.organizes = organizes.map((v) => ({ title: v.organizeName, value: v.organizeCode }))

    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: DocumentControl, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.documentCode || data.documentCode.toString().trim().toLowerCase().indexOf(searchString.documentType.toLowerCase()) !== -1)
        && (!searchString.prefix || data.prefix.toString().trim().toLowerCase().indexOf(searchString.prefix.toLowerCase()) !== -1)
        // && (!searchString.suffix || data.suffix.toString().trim().toLowerCase().indexOf(searchString.suffix.toLowerCase()) !== -1)
        && (!searchString.lengthOfRunningNo || data.lengthOfRunningNo.toString().trim().toLowerCase().indexOf(searchString.lengthOfRunningNo.toLowerCase()) !== -1)
        && (!searchString.lastDocumentNo || data.lastDocumentNo.toString().trim().toLowerCase().indexOf(searchString.lastDocumentNo.toLowerCase()) !== -1)
        && (!searchString.lastRunningNo || data.lastRunningNo.toString().trim().toLowerCase().indexOf(searchString.lastRunningNo.toLowerCase()) !== -1)
        && (searchString.organizeCode == undefined || data.organizeCode == searchString.organizeCode)
        && (searchString.documentType == undefined || data.documentType == searchString.documentType)
        && (searchString.isActive == undefined || data.isActive == searchString.isActive)
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      organizeCode: typeof this.selectedOrganizeCode === 'string' ? this.selectedOrganizeCode : this.selectedOrganizeCode?.value,
      documentCode: this.documentCode,
      documentType: this.selectedDocumentType,
      prefix: this.prefix,
      // suffix: this.suffix,
      lengthOfRunningNo: this.lengthOfRunningNo,
      lastDocumentNo: this.lastDocumentNo,
      lastRunningNo: this.lastRunningNo,
      isActive: this.selectedIsActive
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.selectedOrganizeCode = undefined;
    this.documentCode = '';
    this.selectedDocumentType = undefined;
    this.prefix = '';
    // this.suffix = '';
    this.lengthOfRunningNo = '';
    this.lastDocumentNo = '';
    this.lastRunningNo = '';
    this.selectedIsActive = undefined;
  }

  addDocumentControl(): void {
    const dialogRef = this._matDialog.open(DocumentControlModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined,
        organizes: this.organizes
      },
      autoFocus: false
    });
    dialogRef.afterClosed()
      .subscribe((dc: DocumentControl) => {
        if (!dc) return; // cancel
        this.loadDocumentControls();
      });
  }

  editDocumentControl(element: DocumentControl) {
    this._documentControlService.getDocumentControl(element.id).subscribe({
      next: (documentControl: DocumentControl) => {
        const dialogRef = this._matDialog.open(DocumentControlModalComponent, {
          data: {
            mode: ModalMode.EDIT,
            data: documentControl,
            organizes: this.organizes
          },
          autoFocus: false
        });
        dialogRef.afterClosed()
          .subscribe((documentControl: DocumentControl) => {
            if (!documentControl) return; // cancel
            this.loadDocumentControls();
          });
      },
      error: (e) => {
        this._snackBarService.error();
        console.error(e)
      }
    });
  }

  deleteDocumentControl(element: DocumentControl) {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this._documentControlService.deleteDocumentControl(element.id).subscribe({
          next: (v) => {
            this._snackBarService.success();
            this.loadDocumentControls()
          },
          error: (e) => {
            this._snackBarService.error();
            console.error(e)
          }
        });
      }
    });
  }

  loadDocumentControls() {
    this._documentControlService.getDocumentControls().subscribe({
      next: (documentControls: DocumentControl[]) => this.dataSource.data = documentControls,
      error: (e) => console.log(e)
    });
  }
}

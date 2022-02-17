import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ModalMode } from '../../super-admin/modals/modal.types';
import { AdminService } from '../admin.service';
import { DocumentControl, Status } from '../admin.types';
import { DocumentControlModalComponent } from '../modals/document-control-modal/document-control-modal.component';


@Component({
  selector: 'app-document-control',
  templateUrl: './document-control.component.html',
  styleUrls: ['./document-control.component.scss']
})
export class DocumentControlComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('documentTable') documentControlTable: MatTable<DocumentControl>;
  documentControls: DocumentControl[];
  organizationCodes: any[];
  documentTypes: any[];

  // bind value
  dataSource: MatTableDataSource<DocumentControl>;
  selectedOrganizationCode: string;
  selectedDocumentType: string;
  prefix: string;
  suffix: string;
  lengthOfRunning: string;
  lastRunning: string;
  lastDocument: string;
  selectedStatus: Status;

  // select option
  statuses: any = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ]

  // table setting
  displayedColumns: string[] = [
    'organizationCode',
    'documentType',
    'prefix',
    'suffix',
    'lengthOfRunning',
    'lastRunning',
    'lastDocumentNo',
    'status',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'organizationCode': 'Organization Code',
    'documentType': 'Document Type',
    'prefix': 'Prefix',
    'suffix': 'Suffix',
    'lengthOfRunning': 'Length of Running',
    'lastRunning': 'Last Running',
    'lastDocumentNo': 'Last Document',
    'status': 'Status'
  };

  constructor(
    private _adminService: AdminService,
    private _matDialog: MatDialog
  ) {
    this.documentControls = this._adminService.getDocumentControls();
    this.dataSource = new MatTableDataSource(this.documentControls);
  }

  ngOnInit(): void {
    this.organizationCodes = this._adminService.getOrganizations().map((org) => ({ title: org.organizationCode, value: org.organizationCode }));
    this.documentTypes = this._adminService.getDocumentTypes().map((dt) => ({ title: dt, value: dt }));

    // default
    this.selectedStatus = Status.ACTIVE;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: DocumentControl, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.organizationCode || data.organizationCode.toString().trim().toLowerCase().indexOf(searchString.organizationCode.toLowerCase()) !== -1)
        && (!searchString.documentType || data.documentType.toString().trim().toLowerCase().indexOf(searchString.documentType.toLowerCase()) !== -1)
        && (!searchString.prefix || data.prefix.toString().trim().toLowerCase().indexOf(searchString.prefix.toLowerCase()) !== -1)
        && (!searchString.suffix || data.suffix.toString().trim().toLowerCase().indexOf(searchString.suffix.toLowerCase()) !== -1)
        && (!searchString.lengthOfRunning || data.lengthOfRunning.toString().trim().toLowerCase().indexOf(searchString.lengthOfRunning.toLowerCase()) !== -1)
        && (!searchString.lastRunning || data.lastRunning.toString().trim().toLowerCase().indexOf(searchString.lastRunning.toLowerCase()) !== -1)
        && (!searchString.lastDocument || data.lastDocument.toString().trim().toLowerCase().indexOf(searchString.lastDocument.toLowerCase()) !== -1)
        && (!searchString.status || data.status.toString().trim().toLowerCase().indexOf(searchString.status.toLowerCase()) !== -1)
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      organizationCode: this.selectedOrganizationCode,
      documentType: this.selectedDocumentType,
      prefix: this.prefix,
      suffix: this.suffix,
      lengthOfRunning: this.lengthOfRunning,
      lastRunning: this.lastRunning,
      lastDocument: this.lastDocument,
      status: this.selectedStatus
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.selectedOrganizationCode = undefined;
    this.selectedDocumentType = undefined;
    this.prefix = undefined;
    this.suffix = undefined;
    this.lengthOfRunning = undefined;
    this.lastRunning = undefined;
    this.lastDocument = undefined;
    this.selectedStatus = undefined;
  }

  addDocumentControl(): void {
    const dialogRef = this._matDialog.open(DocumentControlModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((dc: DocumentControl) => {
        if (!dc) return; // cancel
        this.documentControls.push(dc);
        this.dataSource.data = this.documentControls;
        this.documentControlTable.renderRows();
      });
  }

  editDocumentControl(index: number) {
    const dialogRef = this._matDialog.open(DocumentControlModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.documentControls[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((documentControl: DocumentControl) => {
        if (!documentControl) return; // cancel
        this.documentControls[index] = documentControl;
        this.dataSource.data = this.documentControls;
        this.documentControlTable.renderRows();
      });
  }

  deleteDocumentControl(index: number) {
    this.documentControls.splice(index, 1);
    this.dataSource.data = this.documentControls;
    this.documentControlTable.renderRows();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DocumentPermissionModalComponent } from '../modals/document-permission-modal/document-permission-modal.component';
import { ModalMode } from '../modals/modal.types';
import { SuperAdminService } from '../super-admin.service';
import { DocumentPermission, Role } from '../super-admin.types';

@Component({
  selector: 'app-document-permission',
  templateUrl: './document-permission.component.html',
  styleUrls: ['./document-permission.component.scss']
})
export class DocumentPermissionComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('documentPermissionTable') documentPermissionTable: MatTable<Role>;
  roles: Role[];

  // bind value
  dataSource: MatTableDataSource<Role>;
  roleCode: string;
  roleDescription: string;
  selectedDocumentPermission: string;

  // select option
  documentPermissions: any = [
    { title: DocumentPermission.DOCUMENT_CANCEL, value: DocumentPermission.DOCUMENT_CANCEL },
    { title: DocumentPermission.DOCUMENT_DRAFT, value: DocumentPermission.DOCUMENT_DRAFT },
    { title: DocumentPermission.DOCUMENT_ISSUED, value: DocumentPermission.DOCUMENT_ISSUED },
    { title: DocumentPermission.DOCUMENT_MODIFY, value: DocumentPermission.DOCUMENT_MODIFY },
    { title: DocumentPermission.DOCUMENT_REVISE, value: DocumentPermission.DOCUMENT_REVISE },
    { title: DocumentPermission.DOCUMENT_WAIT_FOR_APPROVE, value: DocumentPermission.DOCUMENT_WAIT_FOR_APPROVE },
    { title: DocumentPermission.DOCUMENT_WAIT_FOR_ISSUE, value: DocumentPermission.DOCUMENT_WAIT_FOR_ISSUE },
    { title: DocumentPermission.DOCUMENT_WAIT_FOR_PRINT, value: DocumentPermission.DOCUMENT_WAIT_FOR_PRINT },
    { title: DocumentPermission.DOCUMENT_WAIT_FOR_VERIFY, value: DocumentPermission.DOCUMENT_WAIT_FOR_VERIFY },
    { title: DocumentPermission.SOLVE_CLOSED, value: DocumentPermission.SOLVE_CLOSED },
    { title: DocumentPermission.SOLVE_CLOSED_NEW, value: DocumentPermission.SOLVE_CLOSED_NEW },
    { title: DocumentPermission.SOLVE_DRAFT, value: DocumentPermission.SOLVE_DRAFT }
  ]

  // table setting
  displayedColumns: string[] = [
    'roleCode',
    'roleDescription',
    'documentPermissions',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'roleCode': 'Role Code',
    'roleDescription': 'Role Description',
    'documentPermissions': 'Workflow Status'
  };

  constructor(
    private _superAdminService: SuperAdminService,
    private _matDialog: MatDialog
  ) {
    this.roles = this._superAdminService.getRoles();
    this.dataSource = new MatTableDataSource(this.roles);
  }

  ngOnInit(): void {
    // default
    this.selectedDocumentPermission = undefined;
    this.dataSource.filterPredicate = this.customFilterPredicate();
    this.dataSource.filter = '{}'; // trigger filter mode
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Role, filter: string): boolean {
      if (!data.documentPermissions) return false;
      let searchString = JSON.parse(filter);
      return (!searchString.roleCode || data.roleCode.toString().trim().toLowerCase().indexOf(searchString.roleCode.toLowerCase()) !== -1)
        && (!searchString.roleDescription || data.roleDescription.toString().trim().toLowerCase().indexOf(searchString.roleDescription.toLowerCase()) !== -1)
        && (!searchString.selectedDocumentPermission || data.documentPermissions.indexOf(searchString.selectedDocumentPermission) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      roleCode: this.roleCode,
      roleDescription: this.roleDescription,
      selectedDocumentPermission: this.selectedDocumentPermission
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.roleCode = undefined;
    this.roleDescription = undefined;
    this.selectedDocumentPermission = undefined;
  }

  addDocumentPermission(): void {
    const dialogRef = this._matDialog.open(DocumentPermissionModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((result: any) => {
        if (!result) return; // cancel
        const role = this.roles.find((role) => role.roleCode == result.roleCode)
        for (let docPerm of result.documentPermissions) {
          if (docPerm.checked) {
            if (!role.documentPermissions) role.documentPermissions = [];
            if (role.documentPermissions.indexOf(docPerm.title) == -1) role.documentPermissions.push(docPerm.title);
          }
        }
        this.dataSource.data = this.roles;
        this.documentPermissionTable.renderRows();
      });
  }

  editDocumentPermission(element: Role) {
    const dialogRef = this._matDialog.open(DocumentPermissionModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: element
      }
    });
    dialogRef.afterClosed()
      .subscribe((result: any) => {
        if (!result) return; // cancel
        const role = this.roles.find((role) => role.roleCode == result.roleCode)
        for (let docPerm of result.documentPermissions) {
          if (docPerm.checked) {
            if (!role.documentPermissions) role.documentPermissions = [];
            if (role.documentPermissions.indexOf(docPerm.title) == -1) role.documentPermissions.push(docPerm.title);
          } else {
            role.documentPermissions = role.documentPermissions.filter(_docPerm => _docPerm != docPerm.title);
            if (role.documentPermissions.length === 0) role.documentPermissions = undefined;
          }
        }
        this.dataSource.data = this.roles;
        this.documentPermissionTable.renderRows();
      });
  }

  deleteDocumentPermission(element: Role) {
    element.documentPermissions = undefined;
    this.dataSource.data = this.roles;
    this.documentPermissionTable.renderRows();
  }
}

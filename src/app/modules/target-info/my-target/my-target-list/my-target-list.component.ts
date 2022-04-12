import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from 'app/modules/admin/master/master.service';
import { Master } from 'app/modules/admin/master/master.types';
import { OrganizationService } from 'app/modules/admin/organization/organization.service';
import { Organization } from 'app/modules/admin/organization/organization.types';
import { DocumentParams } from 'app/shared/interfaces/document.interface';
import { Lookup } from 'app/shared/interfaces/lookup.interface';
import { DocumentService } from 'app/shared/services/document.service';
import { LookupService } from 'app/shared/services/lookup.service';


@Component({
  selector: 'my-target-list',
  templateUrl: './my-target-list.component.html',
  styleUrls: ['./my-target-list.component.scss'],
})
export class MyTargetListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatExpansionPanel) matExpansionPanel: MatExpansionPanel;
  defaultPageSize = 5;
  resultsLength = 0;
  documents: Document[];

  // bind value
  selectedOrganize: string;
  selectedBu: string;
  selectedSubBu: string;
  selectedPlant: string;
  selectedDivision: string;
  selectedStatus: string;
  selectedDocumentType: string;
  documentNo: string;
  documentYear: string;

  // select option
  organizes: any[] = [];
  bus: any[] = [];
  subBus: any[] = [];
  plants: any[] = [];
  divisions: any[] = [];
  statuses: any[] = [];
  documentTypes: any[] = [];

  // table setting
  displayedColumns: string[] = [
    'documentNo',
    'revisionNo',
    'modifyNo',
    'createDate',
    'issueDate',
    'documentYear',
    'documentStatus',
    'creator',
    'detail'
  ];

  keyToColumnName: any = {
    'documentNo': 'Running No.',
    'revisionNo': 'Revision No.',
    'modifyNo': 'Modify No.',
    'createDate': 'Create Date',
    'issueDate': 'Issued Date',
    'documentYear': 'Year',
    'documentStatus': 'Status',
    'creator': 'Creator',
    'detail': ''
  };

  notSortColumn: string[] = [
    'index',
    'detail'
  ];

  constructor(
    private _lookupService: LookupService,
    private _organizationService: OrganizationService,
    private _masterService: MasterService,
    private _documentService: DocumentService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    this.setDefault();
  }

  ngOnInit(): void {
    const params = (this._activatedRoute.snapshot.queryParamMap as any).params;
    if (params.expand === 'true') setTimeout(() => this.matExpansionPanel.open());
    const page = params.page ? parseInt(params.page) : 1;
    const size = params.size ? parseInt(params.size) : this.defaultPageSize;
    const sort = params.sort || undefined;
    const order = params.order || undefined;
    this.selectedOrganize = params.OrganizeCode || '';
    this.selectedBu = params.BusinessUnitCode || '';
    this.selectedSubBu = params.SubBusinessUnitCode || '';
    this.selectedPlant = params.PlantCode || '';
    this.selectedDivision = params.DivisionCode || '';
    this.documentNo = params.DocumentNo || undefined;
    this.documentYear = params.DocumentYear || undefined;
    this.selectedStatus = params.DocumentStatus || '';
    this.selectedDocumentType = params.DocumentType || '';

    this.loadDocuments(page, size, sort, order, this.getDocumentParams());

    // load select
    this._organizationService.getOrganizations().subscribe({
      next: (organizations: Organization[]) => {
        this.organizes = organizations.map((org) => ({ title: org.code, value: org.code }));
      },
      error: (e) => console.log(e)
    });

    this._masterService.getMasters().subscribe({
      next: (masters: Master[]) => {
        this.bus = masters.filter((master) => master.type == 'BNU').map((master) => ({ title: master.name, value: master.code }));
        this.subBus = masters.filter((master) => master.type == 'SBU').map((master) => ({ title: master.name, value: master.code }));
        this.plants = masters.filter((master) => master.type == 'PLT').map((master) => ({ title: master.name, value: master.code }));
        this.divisions = masters.filter((master) => master.type == 'DIV').map((master) => ({ title: master.name, value: master.code }));
      },
      error: (e) => console.log(e)
    });

    this._lookupService.getLookups('STATUS').subscribe({
      next: (lookups: Lookup[]) => {
        this.statuses = lookups.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
      },
      error: (e) => console.error(e)
    });

    this._lookupService.getLookups('DOCUMENT_TYPE').subscribe({
      next: (lookups: Lookup[]) => {
        this.documentTypes = lookups.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
      },
      error: (e) => console.error(e)
    });
  }

  ngAfterViewInit() {
    this.matExpansionPanel.opened.subscribe((v) => this.addQueryParam({ expand: true }));
    this.matExpansionPanel.closed.subscribe((v) => this.addQueryParam({ expand: undefined }));

    this.paginator.page.subscribe((v) => {
      const jobApplicantParams = this.getDocumentParams();
      this.loadDocuments(v.pageIndex + 1, v.pageSize, this.sort.active, this.sort.direction, jobApplicantParams);
      this.addQueryParam({ page: v.pageIndex + 1, size: v.pageSize })
    });

    this.sort.sortChange.subscribe((v) => {
      const jobApplicantParams = this.getDocumentParams();
      this.loadDocuments(1, this.paginator.pageSize, this.sort.active, this.sort.direction, jobApplicantParams);
      this.addQueryParam({ page: undefined, sort: this.sort.active, order: this.sort.direction });
    });
  }

  search() {
    const documentParams = this.getDocumentParams();
    this.loadDocuments(1, this.paginator.pageSize, this.sort.active, this.sort.direction, documentParams);
    this.addQueryParam({ page: undefined, ...documentParams });
  }

  clear() {
    this.setDefault();
    this.sort.active = undefined;
    this.sort.direction = '';
    this.sort._stateChanges.next(); // fix arrow not disappear
    this.loadDocuments(1, this.paginator.pageSize, this.sort.active, this.sort.direction, this.getDocumentParams());
    this.addQueryParam({ page: undefined, sort: undefined, order: undefined, ...this.getClearDocumentParams() });
  }

  getDocumentParams(): DocumentParams {
    const filter = new DocumentParams();
    filter.OrganizeCode = this.selectedOrganize ? this.selectedOrganize : undefined;
    filter.BusinessUnitCode = this.selectedBu ? this.selectedBu : undefined;
    filter.SubBusinessUnitCode = this.selectedSubBu ? this.selectedSubBu : undefined;
    filter.PlantCode = this.selectedPlant ? this.selectedPlant : undefined;
    filter.DivisionCode = this.selectedDivision ? this.selectedDivision : undefined;
    filter.DocumentNo = this.documentNo ? this.documentNo : undefined;
    filter.DocumentYear = this.documentYear ? this.documentYear : undefined;
    filter.DocumentStatus = this.selectedStatus ? this.selectedStatus : undefined;
    filter.DocumentType = this.selectedDocumentType ? this.selectedDocumentType : undefined;
    return filter;
  }

  getClearDocumentParams(): DocumentParams {
    const filter = new DocumentParams();
    filter.OrganizeCode = undefined;
    filter.BusinessUnitCode = undefined;
    filter.SubBusinessUnitCode = undefined;
    filter.PlantCode = undefined;
    filter.DivisionCode = undefined;
    filter.DocumentNo = undefined;
    filter.DocumentYear = undefined;
    filter.DocumentStatus = undefined;
    filter.DocumentType = undefined;
    return filter;
  }

  setDefault() {
    this.selectedOrganize = '';
    this.selectedBu = '';
    this.selectedSubBu = '';
    this.selectedPlant = '';
    this.selectedDivision = '';
    this.selectedStatus = '';
    this.selectedDocumentType = '';
    this.documentNo = undefined;
    this.documentYear = undefined;
  }

  private addQueryParam(param?: object): void {
    this._router.navigate(['./'], {
      relativeTo: this._activatedRoute,
      queryParams: param,
      queryParamsHandling: 'merge'
    })
  }

  loadDocuments(page: number, size: number, sort?: string, order?: string, params?: DocumentParams) {
    this._documentService.getDocuments(
      page,
      size,
      sort,
      order,
      params
    ).subscribe({
      next: (v) => {
        this.documents = v.model;
        this.paginator.pageIndex = v.pageNumber - 1;
        this.paginator.pageSize = v.pageSize;
        this.resultsLength = v.itemsCount;
      },
      error: (e) => console.error(e)
    });
  }

}

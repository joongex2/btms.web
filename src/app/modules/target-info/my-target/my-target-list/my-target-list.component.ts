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
  selectedOrganize: any;
  selectedBu: any;
  selectedSubBu: any;
  selectedPlant: any;
  selectedDivision: any;
  selectedStatus: any;
  selectedDocumentType: any;
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
  filteredOrganizes: any[] = [];
  filteredBus: any[] = [];
  filteredSubBus: any[] = [];
  filteredPlants: any[] = [];
  filteredDivisions: any[] = [];
  filteredStatuses: any[] = [];
  filteredDocumentTypes: any[] = [];

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
    const organizes = this._activatedRoute.snapshot.data.organizes;
    const statuses = this._activatedRoute.snapshot.data.statuses;
    const documentTypes = this._activatedRoute.snapshot.data.documentTypes;
    const bus = this._activatedRoute.snapshot.data.bus;
    const subBus = this._activatedRoute.snapshot.data.subBus;
    const plants = this._activatedRoute.snapshot.data.plants;
    const divisions = this._activatedRoute.snapshot.data.divisions;

    this.organizes = organizes.map((org) => ({ title: org.organizeName, value: org.organizeCode }));
    this.filteredOrganizes = organizes.map((org) => ({ title: org.organizeName, value: org.organizeCode }));
    this.statuses = statuses.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
    this.filteredStatuses = statuses.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
    this.documentTypes = documentTypes.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
    this.filteredDocumentTypes = documentTypes.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
    this.bus = bus.filter((master) => master.type == 'BUSINESS_UNIT').map((master) => ({ title: master.name, value: master.code }));
    this.filteredBus = bus.filter((master) => master.type == 'BUSINESS_UNIT').map((master) => ({ title: master.name, value: master.code }));
    this.subBus = subBus.filter((master) => master.type == 'SUB_BUSINESS_UNIT').map((master) => ({ title: master.name, value: master.code }));
    this.filteredSubBus = subBus.filter((master) => master.type == 'SUB_BUSINESS_UNIT').map((master) => ({ title: master.name, value: master.code }));
    this.plants = plants.filter((master) => master.type == 'PLANT').map((master) => ({ title: master.name, value: master.code }));
    this.filteredPlants = plants.filter((master) => master.type == 'PLANT').map((master) => ({ title: master.name, value: master.code }));
    this.divisions = divisions.filter((master) => master.type == 'DIVISION').map((master) => ({ title: master.name, value: master.code }));
    this.filteredDivisions = divisions.filter((master) => master.type == 'DIVISION').map((master) => ({ title: master.name, value: master.code }));

    const params = (this._activatedRoute.snapshot.queryParamMap as any).params;
    if (params.expand === 'true') setTimeout(() => this.matExpansionPanel.open());
    const page = params.page ? parseInt(params.page) : 1;
    const size = params.size ? parseInt(params.size) : this.defaultPageSize;
    const sort = params.sort || undefined;
    const order = params.order || undefined;
    this.selectedOrganize = this.organizes.find((v) => v.value === params.OrganizeCode) || '';
    this.selectedBu = this.bus.find((v) => v.value === params.BusinessUnitCode) || '';
    this.selectedSubBu = this.subBus.find((v) => v.value === params.SubBusinessUnitCode) || '';
    this.selectedPlant = this.plants.find((v) => v.value === params.PlantCode) || '';
    this.selectedDivision = this.divisions.find((v) => v.value === params.DivisionCode) || '';
    this.documentNo = params.DocumentNo || undefined;
    this.documentYear = params.DocumentYear || undefined;
    this.selectedStatus = this.statuses.find((v) => v.value === params.DocumentStatus) || '';
    this.selectedDocumentType = this.documentTypes.find((v) => v.value === params.DocumentType) || '';

    this.loadDocuments(page, size, sort, order, this.getDocumentParams());
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

  organizeFilter(value: any) {
    const filterValue = typeof value === 'string' ? value : value.title;
    this.filteredOrganizes = this.organizes.filter(v => v.title.toLowerCase().includes(filterValue.toLowerCase()));
  }

  buFilter(value: any) {
    const filterValue = typeof value === 'string' ? value : value.title;
    this.filteredBus = this.bus.filter(v => v.title.toLowerCase().includes(filterValue.toLowerCase()));
  }

  subBuFilter(value: any) {
    const filterValue = typeof value === 'string' ? value : value.title;
    this.filteredSubBus = this.subBus.filter(v => v.title.toLowerCase().includes(filterValue.toLowerCase()));
  }

  plantFilter(value: any) {
    const filterValue = typeof value === 'string' ? value : value.title;
    this.filteredPlants = this.plants.filter(v => v.title.toLowerCase().includes(filterValue.toLowerCase()));
  }

  divisionFilter(value: any) {
    const filterValue = typeof value === 'string' ? value : value.title;
    this.filteredDivisions = this.divisions.filter(v => v.title.toLowerCase().includes(filterValue.toLowerCase()));
  }

  statusFilter(value: any) {
    const filterValue = typeof value === 'string' ? value : value.title;
    this.filteredStatuses = this.statuses.filter(v => v.title.toLowerCase().includes(filterValue.toLowerCase()));
  }

  documentTypeFilter(value: any) {
    const filterValue = typeof value === 'string' ? value : value.title;
    this.filteredDocumentTypes = this.documentTypes.filter(v => v.title.toLowerCase().includes(filterValue.toLowerCase()));
  }

  displayFn(value: any): string {
    return value && value.title ? value.title : '';
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
    filter.OrganizeCode = this.getOptionValue(this.selectedOrganize);
    filter.BusinessUnitCode = this.getOptionValue(this.selectedBu);
    filter.SubBusinessUnitCode = this.getOptionValue(this.selectedSubBu);
    filter.PlantCode = this.getOptionValue(this.selectedPlant);
    filter.DivisionCode = this.getOptionValue(this.selectedDivision);
    filter.DocumentNo = this.documentNo ? this.documentNo : undefined;
    filter.DocumentYear = this.documentYear ? this.documentYear : undefined;
    filter.DocumentStatus = this.getOptionValue(this.selectedStatus);
    filter.DocumentType = this.getOptionValue(this.selectedDocumentType);
    return filter;
  }

  getOptionValue(selectedOption: any) {
    if (typeof selectedOption === 'string') {
      return selectedOption ? selectedOption : undefined;
    } else {
      return selectedOption.value ? selectedOption.value : undefined;
    }
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

    onClick() {
      return false;
    }
}

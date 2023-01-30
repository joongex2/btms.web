import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Document, DocumentParams } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { DocumentService } from 'app/shared/services/document.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'target-list',
  templateUrl: './target-list.component.html',
  styleUrls: ['./target-list.component.scss'],
})
export class TargetListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatExpansionPanel) matExpansionPanel: MatExpansionPanel;
  defaultPageSize = 10;
  resultsLength = 0;
  documents: Document[];
  fromUrl: string; // my-target/ target-entry/ result-info

  // bind value
  selectedOrganize: any;
  selectedBu: any;
  selectedSubBu: any;
  selectedPlant: any;
  selectedDivision: any;
  selectedStatus: any;
  selectedDocumentType: any;
  selectedTargetType: any;
  documentNo: string;
  documentYear: string;
  toDocumentYear: string;
  searchText: string;
  isCritical: boolean;
  selectedRow: Document;

  // select option
  organizes: any[] = [];
  bus: any[] = [];
  subBus: any[] = [];
  plants: any[] = [];
  divisions: any[] = [];
  statuses: any[] = [];
  documentTypes: any[] = [];
  targetTypes: any[] = [];

  // table setting
  displayedColumns: string[] = [
    'organizeCode',
    'documentNo',
    'revisionNo',
    'createDate',
    'issueDate',
    'documentYear',
    'documentStatus',
    'creator',
    'detail'
  ];

  keyToColumnName: any = {
    'radio': '',
    'organizeCode': 'Organize Code',
    'documentNo': 'Running No.',
    'revisionNo': 'Revision No.',
    'createDate': 'Create Date',
    'issueDate': 'Issued Date',
    'documentYear': 'Year',
    'documentStatus': 'Status',
    'creator': 'Creator',
    'detail': ''
  };

  notSortColumn: string[] = [
    'index',
    'detail',
    'radio'
  ];

  constructor(
    private _documentService: DocumentService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _confirmationService: ConfirmationService
  ) {
    this.setDefault();
  }

  ngOnInit(): void {
    this.setTitle();
    if (this.fromUrl === 'my-target') this.displayedColumns.splice(0, 0, 'radio');
    const organizes = this._activatedRoute.snapshot.data.organizes;
    const statuses = this._activatedRoute.snapshot.data.statuses;
    const documentTypes = this._activatedRoute.snapshot.data.documentTypes;
    const targetTypes = this._activatedRoute.snapshot.data.targetTypes;
    const bus = this._activatedRoute.snapshot.data.bus;
    const subBus = this._activatedRoute.snapshot.data.subBus;
    const plants = this._activatedRoute.snapshot.data.plants;
    const divisions = this._activatedRoute.snapshot.data.divisions;

    this.organizes = organizes.map((org) => ({ title: org.organizeName, value: org.organizeCode }));
    this.statuses = statuses.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
    this.documentTypes = documentTypes.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
    this.targetTypes = targetTypes.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
    this.bus = bus.filter((master) => master.type == 'BUSINESS_UNIT').map((master) => ({ title: master.name, value: master.code }));
    this.subBus = subBus.filter((master) => master.type == 'SUB_BUSINESS_UNIT').map((master) => ({ title: master.name, value: master.code }));
    this.plants = plants.filter((master) => master.type == 'PLANT').map((master) => ({ title: master.name, value: master.code }));
    this.divisions = divisions.filter((master) => master.type == 'DIVISION').map((master) => ({ title: master.name, value: master.code }));

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
    this.toDocumentYear = params.ToDocumentYear || undefined;
    this.selectedStatus = this.statuses.find((v) => v.value === params.DocumentStatus) || '';
    this.selectedDocumentType = this.documentTypes.find((v) => v.value === params.DocumentType) || '';
    this.selectedTargetType = this.targetTypes.find((v) => v.value === params.TargetType) || '';
    this.searchText = params.SearchText || undefined;
    this.isCritical = params.IsCritical || false;

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
    filter.ToDocumentYear = this.toDocumentYear ? this.toDocumentYear : undefined;
    filter.DocumentStatus = this.getOptionValue(this.selectedStatus);
    filter.DocumentType = this.getOptionValue(this.selectedDocumentType);
    filter.TargetType = this.getOptionValue(this.selectedTargetType);
    filter.SearchText = this.searchText ? this.searchText : undefined;
    filter.IsCritical = this.isCritical ? this.isCritical.toString() : undefined;
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
    filter.ToDocumentYear = undefined;
    filter.DocumentStatus = undefined;
    filter.DocumentType = undefined;
    filter.TargetType = undefined;
    filter.SearchText = undefined;
    filter.IsCritical = undefined;
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
    this.selectedTargetType = '';
    this.documentNo = undefined;
    this.documentYear = undefined;
    this.toDocumentYear = undefined;
    this.searchText = undefined;
    this.isCritical = false;
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

  setTitle() {
    if (this._router.url.includes('my-target')) {
      this.fromUrl = 'my-target';
    } else if (this._router.url.includes('target-entry')) {
      this.fromUrl = 'target-entry';
    } else {
      this.fromUrl = 'result-info';
    }
  }

  copyDocument() {
    this._confirmationService.save('ยืนยัน', `ต้องการ copy ข้อมูล document's runningNo: ${this.selectedRow.documentNo} ใช่หรือไม่`).afterClosed().subscribe(async (result) => {
      if (result == 'confirmed') {
        const res = (await firstValueFrom(this._documentService.copyDocument(this.selectedRow.id)));
        if (!res.didError) {
          this._router.navigate([`./${res.model}`], { relativeTo: this._activatedRoute });
        } else {
          this._confirmationService.warning(res.errorMessage);
        }
      }
    });
  }
}

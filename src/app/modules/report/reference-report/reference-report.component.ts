import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from 'app/modules/super-admin/master/master.service';
import { getOptionValue } from 'app/shared/helpers/get-option-value';
import { Document } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import * as FileSaver from 'file-saver';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { ReportService } from '../report.service';
import { ReferenceReportParams } from 'app/shared/interfaces/document.interface';
import moment from 'moment';

@Component({
  selector: 'reference-report',
  templateUrl: './reference-report.component.html',
  styleUrls: ['./reference-report.component.scss'],
})
export class ReferenceReportComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatExpansionPanel) matExpansionPanel: MatExpansionPanel;
  defaultPageSize = 10;
  resultsLength = 0;
  documents: Document[];
  fromUrl: string; // my-target/ target-entry/ result-info
  selection = new SelectionModel<Document>(true, []);

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
    // 'checkbox',
    'documentNo',
    'runningNo',
    'targetRunning',
    'targetDetailDescription',
    'targetIndex',
    'targetValue',
    'targetUnit',
    'targetMonth',
    'targetReferenceStatusName',
    'result',
    'resultValue',
    'resultReportor',
    'resultApprovedDate',
    'causeSequenceNo',
    'causeTopic',
    'causeDescription',
    'causeStatus',
    'targetSolutionType',
    // 'solutionSequenceNo',
    'solutionTopic',
    'finishDate',
    'solutionDescription',
    'actionDate',
    'userResponsibility',
    'detail'
  ];

  keyToColumnName: any = {
    // 'checkbox': '',
    'documentNo': 'Document No.',
    'runningNo': 'Reference No.',
    'targetRunning': 'Target Running',
    'targetDetailDescription': 'Target Description',
    'targetIndex': 'TargetIndex',
    'targetValue': 'Target Value',
    'targetUnit': 'Target Unit',
    'targetMonth': 'Target Month',
    'targetReferenceStatusName': 'Reference Status',
    'result': 'Result',
    'resultValue': 'Result Value',
    'resultReportor': 'Reportor',
    'resultApprovedDate': 'Approved Date',
    'causeSequenceNo': 'Sequence No.',
    'causeTopic': 'Cause Topic',
    'causeDescription': 'Cause Description',
    'causeStatus': 'Cause Status',
    'targetSolutionType': 'Solution Type',
    // 'solutionSequenceNo': 'Solution Running No.',
    'solutionTopic': 'Solution Topic',
    'finishDate': 'Finish Date',
    'solutionDescription': 'Solution Description',
    'actionDate': 'Action Date',
    'userResponsibility': 'User Responsibility',
    'detail': ''
  };

  notSortColumn: string[] = [
    'index',
    'detail',
    // 'checkbox'
  ];

  constructor(
    private _reportService: ReportService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _masterService: MasterService
  ) {
    this.setDefault();
  }

  ngOnInit(): void {
    const organizes = this._activatedRoute.snapshot.data.organizes;
    const statuses = this._activatedRoute.snapshot.data.statuses;
    const documentTypes = this._activatedRoute.snapshot.data.documentTypes;
    const targetTypes = this._activatedRoute.snapshot.data.targetTypes;
    this.bus = this._activatedRoute.snapshot.data.bus;
    this.divisions = this._activatedRoute.snapshot.data.divisions;

    this.organizes = organizes.map((org) => ({ title: org.organizeName, value: org.organizeCode }));
    this.statuses = statuses.map((v) => ({ title: v.workflowStatusName, value: v.workflowStatus }));
    this.documentTypes = documentTypes.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
    this.targetTypes = targetTypes.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));

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
    // this.documentYear = params.DocumentYear || undefined;
    // this.toDocumentYear = params.ToDocumentYear || undefined;
    this.documentYear = params.DocumentYear || moment().year();
    this.toDocumentYear = params.ToDocumentYear || moment().year();
    this.selectedStatus = this.statuses.find((v) => v.value === params.DocumentStatus) || '';
    this.selectedDocumentType = this.documentTypes.find((v) => v.value === params.DocumentType) || '';
    this.selectedTargetType = this.targetTypes.find((v) => v.value === params.TargetType) || '';
    this.searchText = params.SearchText || undefined;
    this.isCritical = params.IsCritical || false;

    // this.loadDocuments(page, size, sort, order, this.getDocumentParams());
  }

  ngAfterViewInit() {
    this.matExpansionPanel.opened.subscribe((v) => this.addQueryParam({ expand: true }));
    this.matExpansionPanel.closed.subscribe((v) => this.addQueryParam({ expand: undefined }));

    this.paginator.page.subscribe((v) => {
      const jobApplicantParams = this.getParams();
      let toggleAll = false;
      if (v.previousPageIndex !== v.pageIndex && this.isAllSelected()) {
        toggleAll = true;
      } else {
        this.selection.clear();
      }
      this.loadData(v.pageIndex + 1, v.pageSize, this.sort.active, this.sort.direction, jobApplicantParams, toggleAll);
      this.addQueryParam({ page: v.pageIndex + 1, size: v.pageSize });
    });

    this.sort.sortChange.subscribe((v) => {
      const jobApplicantParams = this.getParams();
      this.loadData(1, this.paginator.pageSize, this.sort.active, this.sort.direction, jobApplicantParams);
      this.addQueryParam({ page: undefined, sort: this.sort.active, order: this.sort.direction });
    });
  }

  search() {
    const documentParams = this.getParams();
    this.loadData(1, this.paginator.pageSize, this.sort.active, this.sort.direction, documentParams);
    this.addQueryParam({ page: undefined, ...documentParams });
  }

  clear() {
    this.setDefault();
    this.sort.active = undefined;
    this.sort.direction = '';
    this.sort._stateChanges.next(); // fix arrow not disappear
    this.loadData(1, this.paginator.pageSize, this.sort.active, this.sort.direction, this.getParams());
    this.addQueryParam({ page: undefined, sort: undefined, order: undefined, ...this.getClearParams() });
    this.selection.clear();
  }

  getParams(): ReferenceReportParams {
    const filter = new ReferenceReportParams();
    filter.OrganizeCode = getOptionValue(this.selectedOrganize);
    filter.BusinessUnitCode = getOptionValue(this.selectedBu);
    filter.SubBusinessUnitCode = getOptionValue(this.selectedSubBu);
    filter.PlantCode = getOptionValue(this.selectedPlant);
    filter.DivisionCode = getOptionValue(this.selectedDivision);
    filter.DocumentNo = this.documentNo ? this.documentNo : undefined;
    filter.DocumentYear = this.documentYear ? this.documentYear : undefined;
    filter.ToDocumentYear = this.toDocumentYear ? this.toDocumentYear : undefined;
    filter.DocumentStatus = getOptionValue(this.selectedStatus);
    filter.DocumentType = getOptionValue(this.selectedDocumentType);
    filter.TargetType = getOptionValue(this.selectedTargetType);
    filter.SearchText = this.searchText ? this.searchText : undefined;
    filter.IsCritical = this.isCritical ? this.isCritical.toString() : undefined;
    return filter;
  }

  getClearParams(): ReferenceReportParams {
    const filter = new ReferenceReportParams();
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

  loadData(page: number, size: number, sort?: string, order?: string, params?: ReferenceReportParams, toggleSelectAll?: boolean) {
    this._reportService.getReportReferences(page, size, sort, order, params).subscribe({
      next: (v) => {
        this.documents = v.model;
        this.paginator.pageIndex = v.pageNumber - 1;
        this.paginator.pageSize = v.pageSize;
        this.resultsLength = v.itemsCount;
        if (toggleSelectAll) {
          this.selection.clear();
          this.documents.forEach(row => this.selection.select(row));
        }
      },
      error: (e) => console.error(e)
    });
  }

  onClick() {
    return false;
  }

  // async export() {
  //   if (this.selection.selected.length === 0) {
  //     return;
  //   }

  //   let documents: Document[] = [];
  //   let reportDocuments: any[] = [];
  //   if (this.isAllSelected()) {
  //     const jobApplicantParams = this.getParams();
  //     // fire api
  //     const _documents = await firstValueFrom(this._reportService.getReportDocuments(
  //       this.paginator.pageIndex + 1,
  //       -1,
  //       this.sort.active,
  //       this.sort.direction,
  //       jobApplicantParams
  //     ));
  //     documents = _documents?.model;
  //     const ids = documents.map(v => v.id);
  //     reportDocuments = (await firstValueFrom(this._reportService.getReportDocumentsExcel(ids))).model;
  //   } else {
  //     // use selection
  //     documents = this.selection.selected;
  //     const ids = documents.map(v => v.id);
  //     reportDocuments = (await firstValueFrom(this._reportService.getReportDocumentsExcel(ids))).model;
  //   }

  //   // const Heading = [['ลำดับ']];
  //   const Heading = [[]];
  //   const exportTemplate = [];

  //   for (let i = 0; i <= reportDocuments.length - 1; i++) {
  //     if (i === 0) {
  //       for (let key of Object.keys(reportDocuments[0])) {
  //         Heading[0].push(key);
  //       }
  //     }
  //     // exportTemplate.push({ index: i + 1, ...reportDocuments[i] });
  //     exportTemplate.push({ ...reportDocuments[i] });
  //   }

  //   const ws = XLSX.utils.aoa_to_sheet(Heading);
  //   XLSX.utils.sheet_add_json(ws, exportTemplate, { origin: 'A2', skipHeader: true });
  //   const workbook: XLSX.WorkBook = {
  //     Sheets: { Sheet1: ws },
  //     SheetNames: ['Sheet1'],
  //   };

  //   const excelBuffer: any = XLSX.write(workbook, {
  //     bookType: 'xlsx',
  //     type: 'array',
  //   });

  //   const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //   const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
  //   const fileName = 'export_report_';

  //   FileSaver.saveAs(data, fileName + new Date().getTime() + '.xlsx');
  // }
  async export() {
    let documents: Document[] = [];
    let reportDocuments: any[] = [];
   
      const jobApplicantParams = this.getParams();
      // fire api
      const _documents = await firstValueFrom(this._reportService.getReportReferences(
        this.paginator.pageIndex + 1,
        -1,
        this.sort.active,
        this.sort.direction,
        jobApplicantParams
      ));
      documents = _documents?.model;
      
    // const Heading = [['ลำดับ']];
    const Heading = [[]];
    const exportTemplate = [];

    for (let i = 0; i <= documents.length - 1; i++) {
      if (i === 0) {
        for (let key of Object.keys(documents[0])) {
          Heading[0].push(key);
        }
      }
      // exportTemplate.push({ index: i + 1, ...reportDocuments[i] });
      exportTemplate.push({ ...documents[i] });
    }

    const ws = XLSX.utils.aoa_to_sheet(Heading);
    XLSX.utils.sheet_add_json(ws, exportTemplate, { origin: 'A2', skipHeader: true });
    const workbook: XLSX.WorkBook = {
      Sheets: { Sheet1: ws },
      SheetNames: ['Sheet1'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    const fileName = 'btms_reference_report_';

    FileSaver.saveAs(data, fileName + new Date().getTime() + '.xlsx');
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.documents.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.documents.forEach(row => this.selection.select(row));
  }

  async buChange(bu: any) {
    if (typeof bu === 'string') {
      this.selectedSubBu = null;
      this.selectedPlant = null;
    } else {
      this.subBus = await firstValueFrom(this._masterService.getSubBus(bu.id));
    }
  }

  async subBuChange(subBu: any) {
    if (typeof subBu === 'string') {
      this.selectedPlant = null;
    } else {
      this.plants = await firstValueFrom(this._masterService.getPlants(subBu.id));
    }
  }
}

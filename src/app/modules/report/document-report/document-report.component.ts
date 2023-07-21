import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from 'app/modules/super-admin/master/master.service';
import { firstUpperCase } from 'app/shared/helpers/first-upper-case';
import { getOptionValue } from 'app/shared/helpers/get-option-value';
import { Document, DocumentParams } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import * as FileSaver from 'file-saver';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { ReportService } from '../report.service';

@Component({
  selector: 'document-report',
  templateUrl: './document-report.component.html',
  styleUrls: ['./document-report.component.scss'],
})
export class DocumentReportComponent implements OnInit, AfterViewInit {
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
  fromMonth: number;
  toMonth: number;

  // select option
  organizes: any[] = [];
  bus: any[] = [];
  subBus: any[] = [];
  plants: any[] = [];
  divisions: any[] = [];
  statuses: any[] = [];
  documentTypes: any[] = [];
  targetTypes: any[] = [];
  months = [
    { title: 'January', value: 1 },
    { title: 'February', value: 2 },
    { title: 'March', value: 3 },
    { title: 'April', value: 4 },
    { title: 'May', value: 5 },
    { title: 'June', value: 6 },
    { title: 'July', value: 7 },
    { title: 'August', value: 8 },
    { title: 'September', value: 9 },
    { title: 'October', value: 10 },
    { title: 'November', value: 11 },
    { title: 'December', value: 12 }
  ];

  // table setting
  initialHeader = [
    'checkbox',
    'organizeCode',
    'documentNo',
    'revisionNo',
    'documentDate',
    'issuedDate',
    'documentYear',
    'documentStatus',
    'userHolder',
    'detail'
  ];

  displayedHeaders1: string[] = [...this.initialHeader];
  displayedHeaders2: string[] = [];
  displayedColumns: string[] = [...this.initialHeader];

  keyToColumnName: any = {
    'checkbox': '',
    'organizeCode': 'Organize Code',
    'documentNo': 'Running',
    'revisionNo': 'Revision',
    'documentDate': 'Create Date',
    'issuedDate': 'Issued Date',
    'documentYear': 'Year',
    'documentStatus': 'Status',
    'userHolder': 'Creator',
    'detail': '',

    'jan': 'Jan',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Apr',
    'may': 'May',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Aug',
    'sep': 'Sep',
    'oct': 'Oct',
    'nov': 'Nov',
    'dec': 'Dec',

    'UseReport': 'Use Report',
    'ActualValue': 'Actual Value',
    'ActualResult': 'Actual Result',
    'ActualStatus': 'Actual Status',
    'ReferenceNo': 'Reference No',
    'ReferenceStatus': 'Reference Status',
    'CauseTopic': 'Cause Topic',
    'SolutionType': 'Solution Type',
    'SolutionTopic': 'Solution Topic',
    'SolutionDueDate': 'Solution Due Date',
    'SolutionActual': 'Solution Actual',
    'SolutionActualDate': 'Solution Actual Date',
    // 'Preventive': 'Preventive',
    // 'PreventiveDueDate': 'Preventive Due Date',
    // 'PreventiveActual': 'Preventive Actual',
    // 'PreventiveActualDate': 'Preventive Actual Date'
  };

  monthColumns: string[] = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  notSortColumn: string[] = [
    'index',
    'detail',
    'checkbox'
  ].concat(this.monthColumns);

  monthsSplit = /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/;

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
    this.documentYear = params.DocumentYear || moment().year();
    this.toDocumentYear = params.ToDocumentYear || moment().year();
    this.selectedStatus = this.statuses.find((v) => v.value === params.DocumentStatus) || '';
    this.selectedDocumentType = this.documentTypes.find((v) => v.value === params.DocumentType) || '';
    this.selectedTargetType = this.targetTypes.find((v) => v.value === params.TargetType) || '';
    this.searchText = params.SearchText || undefined;
    this.isCritical = params.IsCritical || false;
    this.fromMonth = params.FromMonth ? parseInt(params.FromMonth) : 1;
    this.toMonth = params.ToMonth ? parseInt(params.ToMonth) : moment().month() + 1;

    // this.loadDocuments(page, size, sort, order, this.getDocumentParams());
    this.appendColumns(0, 12);
  }

  ngAfterViewInit() {
    this.matExpansionPanel.opened.subscribe((v) => this.addQueryParam({ expand: true }));
    this.matExpansionPanel.closed.subscribe((v) => this.addQueryParam({ expand: undefined }));

    this.paginator.page.subscribe((v) => {
      const jobApplicantParams = this.getDocumentParams();
      let toggleAll = false;
      if (v.previousPageIndex !== v.pageIndex && this.isAllSelected()) {
        toggleAll = true;
      } else {
        this.selection.clear();
      }
      this.loadDocuments(v.pageIndex + 1, v.pageSize, this.sort.active, this.sort.direction, jobApplicantParams, toggleAll);
      this.addQueryParam({ page: v.pageIndex + 1, size: v.pageSize });
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
    this.selection.clear();
  }

  clear() {
    this.setDefault();
    this.sort.active = undefined;
    this.sort.direction = '';
    this.sort._stateChanges.next(); // fix arrow not disappear
    this.loadDocuments(1, this.paginator.pageSize, this.sort.active, this.sort.direction, this.getDocumentParams());
    this.addQueryParam({ page: undefined, sort: undefined, order: undefined, ...this.getClearDocumentParams() });
    this.selection.clear();
  }

  getDocumentParams(): DocumentParams {
    const filter = new DocumentParams();
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
    filter.FromMonth = this.fromMonth ? this.fromMonth.toString() : undefined;
    filter.ToMonth = this.toMonth ? this.toMonth.toString() : undefined;
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
    filter.ToDocumentYear = undefined;
    filter.DocumentStatus = undefined;
    filter.DocumentType = undefined;
    filter.TargetType = undefined;
    filter.SearchText = undefined;
    filter.IsCritical = undefined;
    filter.FromMonth = undefined;
    filter.ToMonth = undefined;
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
    this.fromMonth = undefined;
    this.toMonth = undefined;
  }

  private addQueryParam(param?: object): void {
    this._router.navigate(['./'], {
      relativeTo: this._activatedRoute,
      queryParams: param,
      queryParamsHandling: 'merge'
    })
  }

  loadDocuments(page: number, size: number, sort?: string, order?: string, params?: DocumentParams, toggleSelectAll?: boolean) {
    this._reportService.getReportActuals(page, size, sort, order, params).subscribe({
      next: (v) => {
        this.documents = v.model;
        // this.mockData(); // mock
        this.changeColumns();
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

  async export() {
    if (this.selection.selected.length === 0) {
      return;
    }

    let documents: Document[] = [];
    let reportActuals: any[] = [];
    if (this.isAllSelected()) {
      const jobApplicantParams = this.getDocumentParams();
      // fire api
      const _documents = await firstValueFrom(this._reportService.getReportActuals(
        this.paginator.pageIndex + 1,
        -1,
        this.sort.active,
        this.sort.direction,
        jobApplicantParams
      ));
      documents = _documents?.model;
      const ids = documents.map(v => v.id);
      reportActuals = (await firstValueFrom(this._reportService.getReportActualsExcel(ids))).model;
    } else {
      // use selection
      documents = this.selection.selected;
      const ids = documents.map(v => v.id);
      reportActuals = (await firstValueFrom(this._reportService.getReportActualsExcel(ids))).model;
    }

    // const Heading = [['ลำดับ']];
    const Heading = [[]];
    const exportTemplate = [];

    const fromMonth = this.fromMonth ? this.fromMonth - 1 : 0;
    const toMonth = this.toMonth ? this.toMonth : 12;
    const selectedMonthColumns = this.monthColumns.slice(fromMonth, toMonth);
    const monthsRegExp = new RegExp(selectedMonthColumns.join('|'));
    const generalCols = ['id', 'organizeCode', 'businessUnitCode', 'subBusinessUnitCode', 'plantCode', 'divisionCode', 'documentNo', 'documentYear', 'revisionNo', 'modifyNo', 'documentType', 'documentStatus', 'documentDate', 'issuedDate', 'userHolder', 'targetName', 'targetType', 'standard', 'measureType', 'targetDetailDescription', 'targetIndex', 'targetValue', 'targetUnit', 'currentTarget', 'startMonth', 'startYear', 'finishMonth', 'finishYear', 'isCritical', 'planDescription', 'planYear'];

    for (let i = 0; i <= reportActuals.length - 1; i++) {
      for (let key of Object.keys(reportActuals[i])) {
        if (!key.match(monthsRegExp) && !generalCols.includes(key)) {
          // filter key
          delete reportActuals[i][key];
          continue;
        }

        if (i === 0) {
          Heading[0].push(firstUpperCase(key));
        }
      }

      // exportTemplate.push({ index: i + 1, ...reportActuals[i] });
      exportTemplate.push({ ...reportActuals[i] });
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
    const fileName = 'target_actual_report_';

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

  changeColumns() {
    // reset
    this.displayedHeaders1 = [...this.initialHeader];
    this.displayedHeaders2 = [];
    this.displayedColumns = [...this.initialHeader];

    const fromMonth = this.fromMonth ? this.fromMonth - 1 : 0;
    const toMonth = this.toMonth ? this.toMonth : 12;
    this.appendColumns(fromMonth, toMonth);
  }

  appendColumns(from: number, to: number) {
    const selectedMonthColumns = this.monthColumns.slice(from, to);
    for (let month of selectedMonthColumns) {
      const appendColumn2 = ['UseReport', 'ActualValue', 'ActualResult', 'ActualStatus', 'ReferenceNo', 'ReferenceStatus', 'CauseTopic', 'SolutionType', 'SolutionTopic', 'SolutionDueDate', 'SolutionActual', 'SolutionActualDate']
      this.displayedHeaders1.push(month);
      this.displayedHeaders2 = this.displayedHeaders2.concat(appendColumn2.map(v => `${month}${v}`));
      this.displayedColumns = this.displayedColumns.concat(appendColumn2.map(v => `${month}${v}`));
    }
  }
}

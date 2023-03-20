import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from 'app/modules/super-admin/master/master.service';
import { DocumentParams } from 'app/shared/interfaces/document.interface';
import { DocumentService } from 'app/shared/services/document.service';
import { firstValueFrom } from 'rxjs';
import { SaveCauseTrackService } from './save-cause-track.service';
import { SaveCauseTrack } from './save-cause-track.types';


@Component({
  selector: 'save-cause-track',
  templateUrl: './save-cause-track.component.html',
  styleUrls: ['./save-cause-track.component.scss'],
})
export class SaveCauseTrackComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatExpansionPanel) matExpansionPanel: MatExpansionPanel;
  defaultPageSize = 10;
  resultsLength = 0;
  // documents: Document[];
  saveCauseTracks: SaveCauseTrack[];

  // bind value
  selectedOrganize: any;
  selectedBu: any;
  selectedSubBu: any;
  selectedPlant: any;
  selectedDivision: any;
  // selectedStatus: any;
  selectedDocumentType: any;
  selectedTargetType: any;
  documentNo: string;

  selectedReportStatus: any;
  selectedCauseTrackStatus: any;
  selectedTargetResult: any;
  selectedFromMonth = '';
  selectedCauseTrackResult: any;
  selectedToMonth = '';
  // documentYear: string;
  // toDocumentYear: string;
  // searchText: string;
  // isCritical: boolean;

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
    'index',
    'plant',
    'targetYear',
    'targetType',
    'targetName'
  ];

  keyToColumnName: any = {
    'index': 'No.',
    'plant': 'Plant',
    'targetYear': 'Target Year',
    'targetType': 'Target Type',
    'targetName': 'เป้าหมายหลัก',
  };

  notSortColumn: string[] = [
    'index'
  ];

  // mock
  reportStatuses: any[];
  causeTrackStatuses: any[];
  targetResults: any[];
  causeTrackResults: any[];
  months: any[];

  constructor(
    // private _documentService: DocumentService,
    private _standardFormService: SaveCauseTrackService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
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
    this.statuses = statuses.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
    this.documentTypes = documentTypes.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));
    this.targetTypes = targetTypes.map((v) => ({ title: v.lookupDescription, value: v.lookupCode }));

    // TODO: mock
    this.reportStatuses = [
      { title: 'สถานะการรายงานผล 1', value: 'result_status_1' },
      { title: 'สถานะการรายงานผล 2', value: 'result_status_2' },
      { title: 'สถานะการรายงานผล 3', value: 'result_status_3' },
    ];
    this.causeTrackStatuses = [
      { title: 'สถานะการติดตามสาเหตุฯ 1', value: 'cause_track_status_1' },
      { title: 'สถานะการติดตามสาเหตุฯ 2', value: 'cause_track_status_2' },
      { title: 'สถานะการติดตามสาเหตุฯ 3', value: 'cause_track_status_3' },
    ];
    this.targetResults = [
      { title: 'ผลการดำเนินงาน 1', value: 'target_result_1' },
      { title: 'ผลการดำเนินงาน 2', value: 'target_result_2' },
      { title: 'ผลการดำเนินงาน 3', value: 'target_result_3' }
    ];
    this.months = [
      { title: 'January', value: 'January' },
      { title: 'February', value: 'February' },
      { title: 'March', value: 'March' },
      { title: 'April', value: 'April' },
      { title: 'May', value: 'May' },
      { title: 'June', value: 'June' },
      { title: 'July', value: 'July' },
      { title: 'August', value: 'August' },
      { title: 'September', value: 'September' },
      { title: 'October', value: 'October' },
      { title: 'November', value: 'November' },
      { title: 'December', value: 'December' }
    ];
    this.causeTrackResults = [
      { title: 'ผลการติดตามสาเหตุฯ 1', value: 'cause_track_result_1' },
      { title: 'ผลการติดตามสาเหตุฯ 2', value: 'cause_track_result_2' },
      { title: 'ผลการติดตามสาเหตุฯ 3', value: 'cause_track_result_3' }
    ];
  
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
    // this.selectedStatus = this.statuses.find((v) => v.value === params.DocumentStatus) || '';
    this.selectedDocumentType = this.documentTypes.find((v) => v.value === params.DocumentType) || '';
    this.selectedTargetType = this.targetTypes.find((v) => v.value === params.TargetType) || '';
    // this.searchText = params.SearchText || undefined;
    // this.isCritical = params.IsCritical || false;
    this.selectedReportStatus = this.reportStatuses.find((v) => v.value === params.ReportStatus) || '';
    this.selectedCauseTrackStatus = this.causeTrackStatuses.find((v) => v.value === params.CauseTrackStatus) || '';
    this.selectedTargetResult = this.targetResults.find((v) => v.value === params.TargetResult) || '';
    this.selectedFromMonth = params.FromMonth || '';
    this.selectedCauseTrackResult = this.causeTrackResults.find((v) => v.value === params.CauseTrackResult) || '';
    this.selectedToMonth = params.ToMonth || '';

    // this.loadDocuments(page, size, sort, order, this.getDocumentParams());
    setTimeout(() => this._standardFormService.getSaveCauseTracks().subscribe(v => {
      this.saveCauseTracks = v;
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = 5;
      this.resultsLength = 2;
    }), 200); // TODO: bind api
  }

  ngAfterViewInit() {
    this.matExpansionPanel.opened.subscribe((v) => this.addQueryParam({ expand: true }));
    this.matExpansionPanel.closed.subscribe((v) => this.addQueryParam({ expand: undefined }));

    this.paginator.page.subscribe((v) => {
      const jobApplicantParams = this.getDocumentParams();
      // this.loadDocuments(v.pageIndex + 1, v.pageSize, this.sort.active, this.sort.direction, jobApplicantParams);
      // this.addQueryParam({ page: v.pageIndex + 1, size: v.pageSize })
    });

    this.sort.sortChange.subscribe((v) => {
      const jobApplicantParams = this.getDocumentParams();
      // this.loadDocuments(1, this.paginator.pageSize, this.sort.active, this.sort.direction, jobApplicantParams);
      // this.addQueryParam({ page: undefined, sort: this.sort.active, order: this.sort.direction });
    });
  }

  search() {
    const documentParams = this.getDocumentParams();
    // this.loadDocuments(1, this.paginator.pageSize, this.sort.active, this.sort.direction, documentParams);
    // this.addQueryParam({ page: undefined, ...documentParams });
  }

  clear() {
    this.setDefault();
    this.sort.active = undefined;
    this.sort.direction = '';
    this.sort._stateChanges.next(); // fix arrow not disappear
    // this.loadDocuments(1, this.paginator.pageSize, this.sort.active, this.sort.direction, this.getDocumentParams());
    // this.addQueryParam({ page: undefined, sort: undefined, order: undefined, ...this.getClearDocumentParams() });
  }

  getDocumentParams(): DocumentParams {
    const filter = new DocumentParams();
    filter.OrganizeCode = this.getOptionValue(this.selectedOrganize);
    filter.BusinessUnitCode = this.getOptionValue(this.selectedBu);
    filter.SubBusinessUnitCode = this.getOptionValue(this.selectedSubBu);
    filter.PlantCode = this.getOptionValue(this.selectedPlant);
    filter.DivisionCode = this.getOptionValue(this.selectedDivision);
    filter.DocumentNo = this.documentNo ? this.documentNo : undefined;
    // filter.DocumentYear = this.documentYear ? this.documentYear : undefined;
    // filter.ToDocumentYear = this.toDocumentYear ? this.toDocumentYear : undefined;
    // filter.DocumentStatus = this.getOptionValue(this.selectedStatus);
    filter.DocumentType = this.getOptionValue(this.selectedDocumentType);
    filter.TargetType = this.getOptionValue(this.selectedTargetType);
    filter.ReportStatus = this.getOptionValue(this.selectedReportStatus);
    filter.CauseTrackStatus = this.getOptionValue(this.selectedCauseTrackStatus);
    filter.TargetResult = this.getOptionValue(this.selectedTargetResult);
    filter.FromMonth = this.selectedFromMonth;
    filter.CauseTrackResult = this.getOptionValue(this.selectedCauseTrackResult);
    filter.ToMonth = this.selectedToMonth;
    // filter.SearchText = this.searchText ? this.searchText : undefined;
    // filter.IsCritical = this.isCritical ? this.isCritical.toString() : undefined;
    return filter;
  }

  getOptionValue(selectedOption: any) {
    if (typeof selectedOption === 'string') {
      return selectedOption ? selectedOption : undefined;
    } else {
      return selectedOption?.value ? selectedOption.value : undefined;
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
    // filter.DocumentYear = undefined;
    // filter.ToDocumentYear = undefined;
    // filter.DocumentStatus = undefined;
    filter.DocumentType = undefined;
    filter.TargetType = undefined;
    // filter.SearchText = undefined;
    // filter.IsCritical = undefined;
    return filter;
  }

  setDefault() {
    this.selectedOrganize = '';
    this.selectedBu = '';
    this.selectedSubBu = '';
    this.selectedPlant = '';
    this.selectedDivision = '';
    // this.selectedStatus = '';
    this.selectedDocumentType = '';
    this.selectedTargetType = '';
    this.documentNo = undefined;
    this.selectedReportStatus = '';
    this.selectedCauseTrackStatus = '';
    this.selectedTargetResult = '';
    this.selectedFromMonth = '';
    this.selectedCauseTrackResult = '';
    this.selectedToMonth = '';
    // this.documentYear = undefined;
    // this.toDocumentYear = undefined;
    // this.searchText = undefined;
    // this.isCritical = false;
  }

  private addQueryParam(param?: object): void {
    this._router.navigate(['./'], {
      relativeTo: this._activatedRoute,
      queryParams: param,
      queryParamsHandling: 'merge'
    })
  }

  // loadDocuments(page: number, size: number, sort?: string, order?: string, params?: DocumentParams) {
  //   this._documentService.getDocuments(
  //     page,
  //     size,
  //     sort,
  //     order,
  //     params
  //   ).subscribe({
  //     next: (v) => {
  //       this.documents = v.model;
  //       this.paginator.pageIndex = v.pageNumber - 1;
  //       this.paginator.pageSize = v.pageSize;
  //       this.resultsLength = v.itemsCount;
  //     },
  //     error: (e) => console.error(e)
  //   });
  // }

  onClick() {
    return false;
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

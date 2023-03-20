import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { TargetTemplateService } from '../target-template.service';

@Component({
  selector: 'target-template-list',
  templateUrl: './target-template-list.component.html',
  styleUrls: ['./target-template-list.component.scss']
})
export class TargetTemplateListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatExpansionPanel) matExpansionPanel: MatExpansionPanel;
  defaultPageSize = 10;
  resultsLength = 0;
  documents: Document[];

  // bind value
  searchText: string;

  // table setting
  displayedColumns: string[] = [
    'index',
    'documentName',
    'documentType',
    'documentYear',
    'detail'
  ];

  keyToColumnName: any = {
    'index': 'No.',
    'documentName': 'Document Name',
    'documentType': 'Document Type',
    'documentYear': 'Document Year',
    'detail': ''
  };

  notSortColumn: string[] = [
    'index',
    'detail'
  ];

  constructor(
    private _targetTemplateService: TargetTemplateService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    const params = (this._activatedRoute.snapshot.queryParamMap as any).params;
    if (params.expand === 'true') setTimeout(() => this.matExpansionPanel.open());
    const page = params.page ? parseInt(params.page) : 1;
    const size = params.size ? parseInt(params.size) : this.defaultPageSize;
    const sort = params.sort || undefined;
    const order = params.order || undefined;
    this.searchText = params.search || undefined;

    this.loadTargetTemplates(page, size, sort, order, this.getParams());
  }

  ngAfterViewInit() {
    this.matExpansionPanel.opened.subscribe((v) => this.addQueryParam({ expand: true }));
    this.matExpansionPanel.closed.subscribe((v) => this.addQueryParam({ expand: undefined }));

    this.paginator.page.subscribe((v) => {
      const jobApplicantParams = this.getParams();
      this.loadTargetTemplates(v.pageIndex + 1, v.pageSize, this.sort.active, this.sort.direction, jobApplicantParams);
      this.addQueryParam({ page: v.pageIndex + 1, size: v.pageSize })
    });

    this.sort.sortChange.subscribe((v) => {
      const jobApplicantParams = this.getParams();
      this.loadTargetTemplates(1, this.paginator.pageSize, this.sort.active, this.sort.direction, jobApplicantParams);
      this.addQueryParam({ page: undefined, sort: this.sort.active, order: this.sort.direction });
    });
  }

  search() {
    const documentParams = this.getParams();
    this.loadTargetTemplates(1, this.paginator.pageSize, this.sort.active, this.sort.direction, documentParams);
    this.addQueryParam({ page: undefined, ...documentParams });
  }

  clear() {
    this.searchText = undefined;
    this.sort.active = undefined;
    this.sort.direction = '';
    this.sort._stateChanges.next(); // fix arrow not disappear
    this.loadTargetTemplates(1, this.paginator.pageSize, this.sort.active, this.sort.direction, this.getParams());
    this.addQueryParam({ page: undefined, sort: undefined, order: undefined, ...this.getClearParams() });
  }

  getParams(): any {
    const filter = {} as any;
    filter.search = this.searchText ? this.searchText : undefined;
    return filter;
  }

  getOptionValue(selectedOption: any) {
    if (typeof selectedOption === 'string') {
      return selectedOption ? selectedOption : undefined;
    } else {
      return selectedOption?.value ? selectedOption.value : undefined;
    }
  }

  getClearParams(): any {
    const filter = {} as any;
    filter.search = undefined;
    return filter;
  }

  private addQueryParam(param?: object): void {
    this._router.navigate(['./'], {
      relativeTo: this._activatedRoute,
      queryParams: param,
      queryParamsHandling: 'merge'
    })
  }

  loadTargetTemplates(page: number, size: number, sort?: string, order?: string, params?: any) {
    this._targetTemplateService.getTargetTemplates(
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

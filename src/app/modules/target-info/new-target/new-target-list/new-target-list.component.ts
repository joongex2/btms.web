import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { Organize, User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'new-target-list',
  templateUrl: './new-target-list.component.html',
  styleUrls: ['./new-target-list.component.scss']
})
export class NewTargetListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  organizes: Organize[];
  defaultPageSize = 10;

  // bind value
  dataSource: MatTableDataSource<Organize> = new MatTableDataSource([]);

  // table setting
  displayedColumns: string[] = [
    'index',
    'organizeName',
    'businessUnit',
    'subBusinessUnit',
    'plant',
    'division',
    'chooseIcon'
  ];

  keyToColumnName: any = {
    'index': 'No.',
    'organizeName': 'Organize',
    'businessUnit': 'Business Unit',
    'subBusinessUnit': 'Sub Business Unit',
    'plant': 'Plant',
    'division': 'Division/Department',
    'chooseIcon': 'Select'
  };

  notSortColumn: string[] = [
    'index',
    'chooseIcon'
  ];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const params = (this._activatedRoute.snapshot.queryParamMap as any).params;
    const page = params.page ? parseInt(params.page) - 1 : 0;
    const size = params.size ? parseInt(params.size) : this.defaultPageSize;

    // Subscribe to user changes
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.organizes = user.organizes;
        if (!this.organizes) this.organizes = [];
        for (let org of this.organizes) {
          org.canCreate = false;
          for (let role of org.roles) {
            if (role.roleCode === 'D01') org.canCreate = true;
          }
        }
        this.dataSource.data = this.organizes;
        setTimeout(() => {
          const maxPage = Math.floor(this.paginator.length / size);
          this.paginator.pageIndex = page > maxPage ? 0 : page;
          this.paginator.pageSize = size;
        });
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.paginator.page.subscribe((v) => this.addQueryParam({
      page: v.pageIndex + 1,
      size: v.pageSize
    }));
  }

  private addQueryParam(param?: object): void {
    this._router.navigate(['./'], {
      relativeTo: this._activatedRoute,
      queryParams: param,
      queryParamsHandling: 'merge'
    })
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}

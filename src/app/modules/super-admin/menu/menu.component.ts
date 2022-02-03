import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MenuModalComponent } from '../modals/menu-modal/menu-modal.component';
import { ModalMode } from '../modals/modal.types';
import { SuperAdminService } from '../super-admin.service';
import { Menu, MenuStatus } from '../super-admin.types';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('menuTable') roleTable: MatTable<Menu>;
  menus: Menu[];

  // bind value
  dataSource: MatTableDataSource<Menu>;
  menuId: string;
  menuTitle: string;
  menuDescription: string;
  parentId: string;
  menuUrl: string;
  pageId: string;
  menuSequence: string;
  selectedStatus: string;

  // select option
  statuses: any = [
    { title: 'Active', value: MenuStatus.ACTIVE },
    { title: 'In Active', value: MenuStatus.INACTIVE }
  ]

  // table setting
  displayedColumns: string[] = [
    'detailIcon',
    'parentId',
    'menuId',
    'menuTitle',
    'menuSequence',
    'menuUrl',
    'status',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'parentId': 'Parent ID',
    'menuId': 'Menu ID',
    'menuTitle': 'Title',
    'menuSequence': 'Sequence',
    'menuUrl': 'Url',
    'status': 'Status'
  };

  constructor(
    private _superAdminService: SuperAdminService,
    private _matDialog: MatDialog
  ) {
    this.menus = this._superAdminService.getMenus();
    this.dataSource = new MatTableDataSource(this.menus);
  }

  ngOnInit(): void {
    // default
    this.selectedStatus = MenuStatus.ACTIVE;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Menu, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.menuId || data.menuId.toString().trim().toLowerCase().indexOf(searchString.menuId.toLowerCase()) !== -1)
        && (!searchString.menuTitle || data.menuTitle.toString().trim().toLowerCase().indexOf(searchString.menuTitle.toLowerCase()) !== -1)
        && (!searchString.menuDescription || data.menuDescription.toString().trim().toLowerCase().indexOf(searchString.menuDescription.toLowerCase()) !== -1)
        && (!searchString.parentId || data.parentId.toString().trim().toLowerCase().indexOf(searchString.parentId.toLowerCase()) !== -1)
        && (!searchString.menuUrl || data.menuUrl.toString().trim().toLowerCase().indexOf(searchString.menuUrl.toLowerCase()) !== -1)
        && (!searchString.pageId || data.pageId.toString().trim().toLowerCase().indexOf(searchString.pageId.toLowerCase()) !== -1)
        && (!searchString.menuSequence || data.menuSequence.toString().trim().toLowerCase().indexOf(searchString.menuSequence.toLowerCase()) !== -1)
        && (!searchString.status || data.status.toString().trim().toLowerCase().indexOf(searchString.status.toLowerCase()) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      menuId: this.menuId,
      menuTitle: this.menuTitle,
      menuDescription: this.menuDescription,
      parentId: this.parentId,
      menuUrl: this.menuUrl,
      pageId: this.pageId,
      menuSequence: this.menuSequence,
      status: this.selectedStatus
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.menuId = undefined;
    this.menuTitle = undefined;
    this.menuDescription = undefined;
    this.parentId = undefined;
    this.menuUrl = undefined;
    this.pageId = undefined;
    this.menuSequence = undefined;
    this.selectedStatus = undefined;
  }

  addMenu(): void {
    const dialogRef = this._matDialog.open(MenuModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((menu: Menu) => {
        if (!menu) return; // cancel
        this.menus.push(menu);
        this.dataSource.data = this.menus;
        this.roleTable.renderRows();
      });
  }

  editMenu(index: number) {
    const dialogRef = this._matDialog.open(MenuModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.menus[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((menu: Menu) => {
        if (!menu) return; // cancel
        this.menus[index] = menu;
        this.dataSource.data = this.menus;
        this.roleTable.renderRows();
      });
  }

  deleteMenu(index: number) {
    this.menus.splice(index, 1);
    this.dataSource.data = this.menus;
    this.roleTable.renderRows();
  }

}

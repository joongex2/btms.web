import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { GroupMenuModalComponent } from '../modals/group-menu-modal/group-menu-modal.component';
import { ModalMode } from '../modals/modal.types';
import { SuperAdminService } from '../super-admin.service';
import { GroupMenu, GroupStatus, Menu } from '../super-admin.types';

@Component({
  selector: 'app-group-menu',
  templateUrl: './group-menu.component.html',
  styleUrls: ['./group-menu.component.scss']
})
export class GroupMenuComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('groupMenuTable') groupMenuTable: MatTable<GroupMenu>;
  groupMenus: GroupMenu[];
  groups: any[];
  menus: any[];

  // bind value
  dataSource: MatTableDataSource<GroupMenu>;
  group: any;
  menu: Menu;
  selectedStatus: string;

  // select option
  statuses: any = [
    { title: 'Active', value: GroupStatus.ACTIVE },
    { title: 'Expired', value: GroupStatus.EXPIRED }
  ]

  // table setting
  displayedColumns: string[] = [
    'group.groupCode',
    'group.groupDescription',
    'menu.menuId',
    'menu.menuTitle',
    'status',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'group.groupCode': 'Group Code',
    'group.groupDescription': 'Group Description',
    'menu.menuId': 'Menu ID',
    'menu.menuTitle': 'Menu Name',
    'status': 'status'
  };

  constructor(
    private _superAdminService: SuperAdminService,
    private _matDialog: MatDialog
  ) {
    this.groupMenus = this._superAdminService.getGroupMenus();
    this.dataSource = new MatTableDataSource(this.groupMenus);
  }

  ngOnInit(): void {
    this.groups = this._superAdminService.getGroups().map((group) => ({ title: group.groupDescription, value: group }));
    this.menus = this._superAdminService.getMenus().map((menu) => ({ title: menu.menuTitle, value: menu }));

    // default
    this.selectedStatus = GroupStatus.ACTIVE;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: GroupMenu, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.group || data.group.groupCode == searchString.group.groupCode)
        && (!searchString.menu || data.menu.menuId == searchString.menu.menuId)
        && (!searchString.status || data.status.toString().trim().toLowerCase().indexOf(searchString.status.toLowerCase()) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      group: this.group,
      menu: this.menu,
      status: this.selectedStatus
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.group = undefined;
    this.menu = undefined;
    this.selectedStatus = undefined;
  }

  addGroupMenu(): void {
    const dialogRef = this._matDialog.open(GroupMenuModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((groupMenu: GroupMenu) => {
        if (!groupMenu) return; // cancel
        this.groupMenus.push(groupMenu);
        this.dataSource.data = this.groupMenus;
        this.groupMenuTable.renderRows();
      });
  }

  editGroupMenu(index: number) {
    const dialogRef = this._matDialog.open(GroupMenuModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.groupMenus[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((groupMenu: GroupMenu) => {
        if (!groupMenu) return; // cancel
        this.groupMenus[index] = groupMenu;
        this.dataSource.data = this.groupMenus;
        this.groupMenuTable.renderRows();
      });
  }

  deleteGroupMenu(index: number) {
    this.groupMenus.splice(index, 1);
    this.dataSource.data = this.groupMenus;
    this.groupMenuTable.renderRows();
  }

  findColumnValue(key: string, elem: any) {
    return key.split('.').reduce((prev, cur) => prev[cur], elem);
  }
}

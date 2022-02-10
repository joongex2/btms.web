import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../admin.service';
import { Plant, Status } from '../admin.types';
import { ModalMode } from '../modals/modal.types';
import { PlantModalComponent } from '../modals/plant-modal/plant-modal.component';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('plantTable') plantTable: MatTable<Plant>;
  plants: Plant[];

  // bind value
  dataSource: MatTableDataSource<Plant>;
  plantCode: string;
  plantDescription: string;
  selectedStatus: Status;

  // select option
  statuses: any = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ]

  // table setting
  displayedColumns: string[] = [
    'plantCode',
    'plantDescription',
    'status',
    'editIcon',
    'deleteIcon'
  ];

  keyToColumnName: any = {
    'plantCode': 'Plant Code',
    'plantDescription': 'Plant Description',
    'status': 'Status'
  };

  constructor(
    private _adminService: AdminService,
    private _matDialog: MatDialog
  ) {
    this.plants = this._adminService.getPlants();
    this.dataSource = new MatTableDataSource(this.plants);
  }

  ngOnInit(): void {
    // default
    this.selectedStatus = Status.ACTIVE;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Plant, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return (!searchString.plantCode || data.plantCode.toString().trim().toLowerCase().indexOf(searchString.plantCode.toLowerCase()) !== -1)
        && (!searchString.plantDescription || data.plantDescription.toString().trim().toLowerCase().indexOf(searchString.plantDescription.toLowerCase()) !== -1)
        && (!searchString.status || data.status.toString().trim().toLowerCase().indexOf(searchString.status.toLowerCase()) !== -1);
    }
    return myFilterPredicate;
  }

  search() {
    const filterValue: any = {
      plantCode: this.plantCode,
      plantDescription: this.plantDescription,
      status: this.selectedStatus
    }
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clear() {
    this.dataSource.filter = '{}';
    this.plantCode = undefined;
    this.plantDescription = undefined;
    this.selectedStatus = undefined;
  }

  addPlant(): void {
    const dialogRef = this._matDialog.open(PlantModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined
      }
    });
    dialogRef.afterClosed()
      .subscribe((plant: Plant) => {
        if (!plant) return; // cancel
        this.plants.push(plant);
        this.dataSource.data = this.plants;
        this.plantTable.renderRows();
      });
  }

  editPlant(index: number) {
    const dialogRef = this._matDialog.open(PlantModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.plants[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((plant: Plant) => {
        if (!plant) return; // cancel
        this.plants[index] = plant;
        this.dataSource.data = this.plants;
        this.plantTable.renderRows();
      });
  }

  deletePlant(index: number) {
    this.plants.splice(index, 1);
    this.dataSource.data = this.plants;
    this.plantTable.renderRows();
  }
}

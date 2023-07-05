import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { DeployLog } from "app/modules/super-admin/target-template/target-template.interface";

@Component({
    selector: 'deploy-log-modal',
    templateUrl: './deploy-log-modal.component.html',
    styleUrls: ['./deploy-log-modal.component.scss']
})
export class DeployLogModalComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataColumns = [
        'description',
        'deployDate',
        'deployBy'
    ];
    deployLogs: DeployLog[];

    //bind value
    dataSource: MatTableDataSource<DeployLog>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public modalData: any,
        public matDialogRef: MatDialogRef<DeployLogModalComponent>
    ) { }

    ngOnInit(): void {
        this.deployLogs = this.modalData.deployLogs;
        this.dataSource = new MatTableDataSource(this.deployLogs);
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    close(): void {
        this.matDialogRef.close();
    }
}
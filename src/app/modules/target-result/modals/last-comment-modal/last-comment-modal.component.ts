import { OnInit, Inject, Component, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ModalData } from "app/modules/target-info/target-management/modals/modal.type";
import { TargetResultService } from "../../target-result.service";
import { LastComment } from "../../target-result.types";

@Component({
    selector: 'app-last-comment-modal',
    templateUrl: './last-comment-modal.component.html',
    styleUrls: ['./last-comment-modal.component.scss']
})
export class LastCommentModalComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataColumns = [
        'comment',
        'from',
        'date'
    ];
    lastComments: LastComment[];

    //bind value
    dataSource: MatTableDataSource<LastComment>;
    
    constructor(
        @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
        public matDialogRef: MatDialogRef<LastCommentModalComponent>,
        private _targetResultService: TargetResultService
    ) { }

    ngOnInit(): void {
        this.lastComments = this._targetResultService.getLastComments();
        this.dataSource = new MatTableDataSource(this.lastComments);
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    close(): void {
        this.matDialogRef.close();
    }
}
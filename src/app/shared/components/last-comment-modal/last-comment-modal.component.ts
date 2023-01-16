import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Comment } from "app/shared/interfaces/document.interface";
import { TargetResultService } from "../../../modules/target-result/target-result.service";

@Component({
    selector: 'app-last-comment-modal',
    templateUrl: './last-comment-modal.component.html',
    styleUrls: ['./last-comment-modal.component.scss']
})
export class LastCommentModalComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataColumns = [
        'commentDate',
        'commentBy',
        'documentStatus',
        'comment'
    ];
    comments: Comment[];

    //bind value
    dataSource: MatTableDataSource<Comment>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public modalData: any,
        public matDialogRef: MatDialogRef<LastCommentModalComponent>,
        private _targetResultService: TargetResultService
    ) { }

    ngOnInit(): void {
        // this.lastComments = this._targetResultService.getLastComments();
        this.comments = this.modalData.comments;
        this.dataSource = new MatTableDataSource(this.comments);
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    close(): void {
        this.matDialogRef.close();
    }
}
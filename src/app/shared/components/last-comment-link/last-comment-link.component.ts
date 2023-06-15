import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Comment } from "app/shared/interfaces/document.interface";
import { LastCommentModalComponent } from "../last-comment-modal/last-comment-modal.component";

@Component({
    selector: 'last-comment-link',
    templateUrl: './last-comment-link.component.html',
    styleUrls: ['./last-comment-link.component.scss']
})
export class LastCommentLinkComponent {
    @Input() comments: Comment[];

    constructor(private _matDialog: MatDialog) { }

    openLastComment() {
        this._matDialog.open(LastCommentModalComponent, {
            data: {
                comments: this.comments
            }
        });
    }
}
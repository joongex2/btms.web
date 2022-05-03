import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Topic } from 'app/shared/interfaces/document.interface';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { ModalMode } from '../../modals/modal.type';
import { TopicModalComponent } from '../../modals/topic-modal/topic-modal.component';

@Component({
  selector: 'app-topic-table',
  templateUrl: './topic-table.component.html',
  styleUrls: ['./topic-table.component.scss']
})
export class TopicTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetId: number;
  @Input() subTargetId: number;
  @Input() topics: Topic[];
  @Input() isEdit: boolean;
  @Output() markForEdit: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('topicTable') topicTable: MatTable<Topic>;

  displayedColumns: string[] = [
    'priority',
    'planDescription',
    'planTargetDate',
    'resource',
    'undertaker',
    'editIcon',
    'deleteIcon'
  ];

  constructor(
    private _matDialog: MatDialog,
    private _confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void { }

  addTopic(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(TopicModalComponent, {
      data: {
        mode: ModalMode.ADD,
        data: undefined,
        index: this.topics.length + 1
      }
    });
    dialogRef.afterClosed()
      .subscribe((topic: Topic) => {
        if (!topic) return; // cancel
        this.topics.push({
          id: 0,
          priority: topic.priority,
          planDescription: topic.planDescription,
          planTargetDate: topic.planTargetDate,
          resource: topic.resource,
          undertaker: topic.undertaker,
          markForEdit: false,
          markForDelete: false
        });
        this.topicTable.renderRows();
        this.markForEdit.emit(this.subTargetId);
      });
  }

  editTopic(index: number): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(TopicModalComponent, {
      data: {
        mode: ModalMode.EDIT,
        data: this.topics[index]
      }
    });
    dialogRef.afterClosed()
      .subscribe((topic: Topic) => {
        if (!topic) return; // cancel
        this.topics[index].planDescription = topic.planDescription;
        this.topics[index].planTargetDate = topic.planTargetDate;
        this.topics[index].resource = topic.resource;
        this.topics[index].undertaker = topic.undertaker;
        this.topics[index].markForEdit = true;
        this.topicTable.renderRows();
        this.markForEdit.emit(this.subTargetId);
      });
  }

  deleteTopic(index: number): void {
    this._confirmationService.delete().afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        if (this.topics[index].id === 0) {
          this.topics.splice(index, 1);
        } else {
          this.topics[index].markForDelete = true;
        }
        // reindex
        let newPriority = 1;
        for (let topic of this.topics) {
          if (!topic.markForDelete) {
            topic.priority = newPriority;
            newPriority++;
          }
        }
        this.topicTable.renderRows();
        this.markForEdit.emit(this.subTargetId);
      }
    });
  }
}

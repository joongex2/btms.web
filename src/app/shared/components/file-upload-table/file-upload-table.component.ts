import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Attachment, FileUpload } from 'app/modules/target-result/target-result.types';
import { FileService } from 'app/shared/services/file.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';


@Component({
  selector: 'app-file-upload-table',
  templateUrl: './file-upload-table.component.html',
  styleUrls: ['./file-upload-table.component.scss']
})
export class FileUploadTableComponent implements OnInit {
  @ViewChild('uploadFileInput') uploadFileInput: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @Input() attachments: Attachment[];
  @Input() readonly = false;
  isDeleting: boolean;
  deleteProgress: number;

  dataSource: MatTableDataSource<Attachment>; // saveResult File Table Source

  dataColumns = [
    'originalFilename',
    'uploader',
    'date',
    'deleteIcon'
  ];

  constructor(
    private _fileService: FileService,
    private _snackbarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.attachments);
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Attachment, filter: string): boolean {
      return !data.markForDelete;
    }
    return myFilterPredicate;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.attachments && !changes.attachments.isFirstChange()) {
      this.dataSource.data = changes.attachments.currentValue;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  uploadFile(fileUpload: FileUpload): void {
    this.attachments.push({
      id: 0,
      originalFilename: fileUpload.name,
      fileUrl: fileUpload.path,
      markForDelete: false
    });
    this.dataSource.data = this.attachments;
  }

  deleteAttachment(attachment: Attachment, index: number): void {
    if (attachment.id === 0) {
      const filePath = attachment.fileUrl.split('/');
      const realFileName = attachment.fileUrl.split('/')[filePath.length - 1];
      this.isDeleting = true;
      this._fileService.deleteFile(realFileName).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            this.deleteProgress = Math.round((100 * event.loaded) / event.total);
          }
          if (event.type === HttpEventType.Response) {
            this.attachments.splice(index, 1);
            this.dataSource.data = this.attachments;
          }
          this.isDeleting = false;
          this.attachments.splice(index, 1);
          this.dataSource.data = this.attachments;
        },
        error: (error) => {
          this._snackbarService.error(error.message)
        }
      })
    } else {
      attachment.markForDelete = true;
      this.dataSource.filter = '{}';
    }
  }
}

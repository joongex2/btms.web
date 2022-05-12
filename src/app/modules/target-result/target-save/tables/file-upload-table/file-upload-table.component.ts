import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FileUpload } from 'app/modules/target-result/target-result.types';


@Component({
  selector: 'app-file-upload-table',
  templateUrl: './file-upload-table.component.html',
  styleUrls: ['./file-upload-table.component.scss']
})
export class FileUploadTableComponent implements OnInit {
  @ViewChild('uploadFileInput') uploadFileInput: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @Input() fileUploads: FileUpload[];
  @Input() readonly = false;

  dataSource: MatTableDataSource<FileUpload>; // saveResult File Table Source

  dataColumns = [
    'fileName',
    'uploader',
    'date',
    'deleteIcon'
  ];
  fileList: FileList;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.fileUploads);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  uploadFile(fileList: FileList): void {
    this.fileList = fileList;
  }

  uploadFileClick(): void {
    if (this.fileList && this.fileList.length > 0) {
      this.fileUploads.push({
        fileName: this.fileList[0].name,
        uploader: 'xxx',
        date: 'xxx'
      });
      this.dataSource.data = this.fileUploads;
      this.fileList = undefined;
      this.uploadFileInput.nativeElement.value = '';
    }
  }

  deleteFileUpload(index: number): void {
    this.fileUploads.splice(index, 1);
    this.dataSource.data = this.fileUploads;
  }
}

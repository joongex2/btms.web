import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileUpload } from 'app/modules/target-result/target-result.types';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { FileService } from 'app/shared/services/file.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';


@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @ViewChild('inputFile') inputVariable: ElementRef;

  @Input() path?: string;
  @Input() label?: string;
  @Input() labelButton?: string = 'อัพโหลด';
  @Input() required?: boolean = false;
  // @Input() replaceFile?: boolean = false;
  @Input() multi?: boolean = false;
  @Input() filename?: string = 'ไฟล์อัพโหลด';
  @Input() accept?: string = '*'; // 'image/*'
  @Input() isButton? = true;

  @Output() complete: EventEmitter<FileUpload> = new EventEmitter<FileUpload>()
  file: File;
  isUpload: boolean;
  progress: number;
  name = 'input_file';
  constructor(
    private _fileService: FileService,
    private _confirmationService: ConfirmationService,
    private _snackbarService: SnackBarService
  ) { }

  ngOnInit() {
  }
  uploadFile(e) {
    this.file = (e as HTMLInputElement).files[0];
    // this._confirmationService.save('ต้องการอัพโหลดไฟล์ใช่หรือไม่').afterClosed().subscribe(async (result) => {
    //   if (result == 'confirmed') {
    this.uploadNewFile();
    //   }
    // });
    return;
  }
  uploadNewFile() {
    this.isUpload = true;
    this.inputVariable.nativeElement.value = '';
    this._fileService.uploadFile(this.file).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total);
        }
        if (event.type === HttpEventType.Response) {
          if (event.body) {
            const res = event.body.model as FileUpload;
            this.path = res.path;
            this._snackbarService.success('อัพโหลดไฟล์สำเร็จ')
            this.complete.emit(res);
          }
          this.isUpload = false;
        }
      },
      error: (error) => {
        this._snackbarService.error(error.message)
        this.isUpload = false;
      }
    });
  }
  deleteFile(fileName: string) {
    this._fileService.deleteFile(fileName).subscribe((event) => {

    });
  }
  isImage(path: string) {
    return path.match(/[^/]+(jpeg|jpg|png|gif)$/)
  }
}

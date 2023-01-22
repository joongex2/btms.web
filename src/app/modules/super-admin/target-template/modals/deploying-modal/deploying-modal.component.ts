import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ModalData } from 'app/shared/interfaces/modal.interface';
import { firstValueFrom } from 'rxjs';
import { TargetTemplateService } from '../../target-template.service';



@Component({
  selector: 'deploying-modal',
  templateUrl: './deploying-modal.component.html',
  styleUrls: ['./deploying-modal.component.scss'],
  animations: fuseAnimations
})
export class DeployingModalComponent implements OnInit {
  status = 'waiting'; // waiting, success, error
  errorMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<DeployingModalComponent>,
    private _targetTemplateService: TargetTemplateService
  ) { }

  async ngOnInit(): Promise<void> {
    const organizes = this.modalData.organizes;
    try {
      const res = await firstValueFrom(this._targetTemplateService.deployTemplates(organizes));
      if (res.didError) {
        for (let message of res.model.errors) {
          this.errorMessage += '• ' + message + '\r\n';
        }
        this.status = 'error';
      } else {
        this.status = 'success';
      }
    } catch (e) {
      this.errorMessage = e?.error;
      this.status = 'error';
    }
  }

  async saveAndClose() {
    this.matDialogRef.close(true);
  }

  close(): void {
    this.matDialogRef.close(this.status);
  }
}

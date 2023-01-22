import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { firstValueFrom } from 'rxjs';
import { TargetTemplateService } from '../../target-template.service';



@Component({
  selector: 'template-deploy-modal',
  templateUrl: './template-deploy-modal.component.html',
  styleUrls: ['./template-deploy-modal.component.scss'],
  animations: fuseAnimations
})
export class TemplateDeployModalComponent implements OnInit {
  status = 'waiting'; // waiting, success, error
  errorMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<TemplateDeployModalComponent>,
    private _targetTemplateService: TargetTemplateService
  ) { }

  async ngOnInit(): Promise<void> {
    const templateId = this.modalData.templateId;
    const organizes = this.modalData.organizes;
    try {
      const res = await firstValueFrom(this._targetTemplateService.deployTemplates(templateId, organizes));
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

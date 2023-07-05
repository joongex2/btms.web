import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { OrganizationService } from 'app/modules/super-admin/organization/organization.service';
import { Organization } from 'app/modules/super-admin/organization/organization.types';
import { FormErrorComponent } from 'app/shared/components/form-error/form-error.component';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { TemplateDeployModalComponent } from '../template-deploy-modal/template-deploy-modal.component';

@Component({
  selector: 'select-organizes-modal',
  templateUrl: './select-organizes-modal.component.html',
  styleUrls: ['./select-organizes-modal.component.scss'],
  animations: fuseAnimations
})
export class SelectOrganizesModalComponent implements OnInit {
  @ViewChild('deployError') deployError: FormErrorComponent;
  form: FormGroup;
  templateId: number;
  organizes: { title: string, value: any }[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public matDialogRef: MatDialogRef<SelectOrganizesModalComponent>,
    private _organizeService: OrganizationService,
    private _confirmationService: ConfirmationService,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
  ) { }

  async ngOnInit(): Promise<void> {
    this.templateId = this.modalData.templateId;
    this._organizeService.getOrganizations().subscribe({
      next: (organizes: Organization[]) => {
        this.organizes = organizes.map(v => ({ ...v, title: `${v.organizeCode}: ${v.organizeName}`, value: v.id }));
      }
    });

    this.form = this._formBuilder.group({ organizes: null });
  }

  async deploy() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.deployError.showError('กรุณาเลือกอย่างน้อย 1 organize');
      return;
    } else {
      this._confirmationService.save('ยืนยัน', 'ต้องการสร้าง document จาก template ที่เลือกใช่หรือไม่?').afterClosed().subscribe(async (result) => {
        if (result == 'confirmed') {
          this.matDialogRef.close();
          this._matDialog.open(TemplateDeployModalComponent, {
            data: {
              templateId: this.templateId,
              organizes: this.form.get('organizes').value.map(v => v.value)
            },
            disableClose: true
          });
        }
      });
    }
  }

  close(): void {
    this.matDialogRef.close();
  }
}

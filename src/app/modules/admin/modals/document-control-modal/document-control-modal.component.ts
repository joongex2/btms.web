import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalData, ModalMode } from '../../../super-admin/modals/modal.types';
import { AdminService } from '../../admin.service';
import { Status } from '../../admin.types';



@Component({
  selector: 'app-document-control-modal',
  templateUrl: './document-control-modal.component.html',
  styleUrls: ['./document-control-modal.component.scss']
})
export class DocumentControlModalComponent implements OnInit {
  isEdit: boolean = false;
  documentControlForm: FormGroup;
  statuses: any[] = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ];
  organizationCodes: any[];
  documentTypes: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<DocumentControlModalComponent>,
    private _formBuilder: FormBuilder,
    private _adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.organizationCodes = this._adminService.getOrganizations().map((org) => ({ title: org.organizationCode, value: org.organizationCode }));
    this.documentTypes = this._adminService.getDocumentTypes().map((dt) => ({ title: dt, value: dt }));

    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const organizationCode = this.isEdit ? this.modalData.data.organizationCode : undefined;
    const documentType = this.isEdit ? this.modalData.data.documentType : undefined;
    const prefix = this.isEdit ? this.modalData.data.prefix : '';
    const suffix = this.isEdit ? this.modalData.data.suffix : '';
    const lengthOfRunning = this.isEdit ? this.modalData.data.lengthOfRunning : '';
    const lastRunning = this.isEdit ? this.modalData.data.lastRunning : '';
    const lastDocumentNo = this.isEdit ? this.modalData.data.lastDocumentNo : '';
    const status = this.isEdit ? this.modalData.data.status : undefined;

    this.documentControlForm = this._formBuilder.group({
      organizationCode: [organizationCode, [Validators.required]],
      documentType: [documentType, [Validators.required]],
      prefix: [prefix, [Validators.required]],
      suffix: [suffix, [Validators.required]],
      lengthOfRunning: [lengthOfRunning, [Validators.required]],
      lastRunning: [lastRunning, [Validators.required]],
      lastDocumentNo: [lastDocumentNo, [Validators.required]],
      status: [status, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

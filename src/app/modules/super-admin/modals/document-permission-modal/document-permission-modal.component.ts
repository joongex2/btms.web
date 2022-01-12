import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuperAdminService } from '../../super-admin.service';
import { ModalData, ModalMode } from '../modal.types';


@Component({
  selector: 'app-document-permission-modal',
  templateUrl: './document-permission-modal.component.html',
  styleUrls: ['./document-permission-modal.component.scss']
})
export class DocumentPermissionModalComponent implements OnInit {
  isEdit: boolean = false;
  documentPermissionForm: FormGroup;
  roleCodes: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<DocumentPermissionModalComponent>,
    private _formBuilder: FormBuilder,
    private _superAdminService: SuperAdminService
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const roleCode = this.isEdit ? this.modalData.data.roleCode : undefined;
    const documentPermissions = this.isEdit ? this.modalData.data.documentPermissions : undefined;

    const _roles = this._superAdminService.getRoles();

    // prepare role combo box
    for (let role of _roles) {
      this.roleCodes.push({ title: `${role.roleCode}: ${role.roleDescription}`, value: role.roleCode });
    };

    // prepare document permission check box 
    let documentPermissionForms = this.createDocumentPermissionForms(roleCode, documentPermissions);
    this.documentPermissionForm = this._formBuilder.group({
      roleCode: [roleCode, [Validators.required]],
      documentPermissions: documentPermissionForms
    });

    if (this.isEdit) this.documentPermissionForm.get('roleCode').disable();

    this.documentPermissionForm.get('roleCode').valueChanges.subscribe(roleCode => {
      const documentPermissions = this._superAdminService.getRole(roleCode).documentPermissions;
      const documentPermissionForms = this.createDocumentPermissionForms(roleCode, documentPermissions);
      this.documentPermissionForm.setControl('documentPermissions', documentPermissionForms);
    });
  }

  createDocumentPermissionForms(roleCode: string, documentPermissions?: string[]): FormArray {
    let documentPermissionForms = this._formBuilder.array([]);
    const availDocPermissions = this._superAdminService.getRoleDocumentPermMap(roleCode);
    if (availDocPermissions) {
      for (let availDocPermission of availDocPermissions) {
        const checked = documentPermissions ? documentPermissions.indexOf(availDocPermission) !== -1 : false;
        documentPermissionForms.push(this._formBuilder.group({
          title: availDocPermission,
          checked: checked
        }));
      }
    }
    return documentPermissionForms;
  }

  close(): void {
    this.matDialogRef.close();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genRandomNumber } from '../../mock-super-admin-data';
import { MenuStatus } from '../../super-admin.types';
import { ModalData, ModalMode } from '../modal.types';


@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.scss']
})
export class MenuModalComponent implements OnInit {
  isEdit: boolean = false;
  menuForm: FormGroup;
  statuses: any[] = [
    { title: 'Active', value: MenuStatus.ACTIVE },
    { title: 'In Active', value: MenuStatus.INACTIVE }
  ];

  menuId: string;
  menuTitle: string;
  menuDescription: string;
  parentId: string;
  menuUrl: string;
  pageId: string;
  menuSequence: string;
  status: MenuStatus;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<MenuModalComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const menuId = this.isEdit ? this.modalData.data.menuId : genRandomNumber();
    const menuTitle = this.isEdit ? this.modalData.data.menuTitle : '';
    const menuDescription = this.isEdit ? this.modalData.data.menuDescription : '';
    const parentId = this.isEdit ? this.modalData.data.parentId : '';
    const menuUrl = this.isEdit ? this.modalData.data.menuUrl : '';
    const pageId = this.isEdit ? this.modalData.data.pageId : '';
    const menuSequence = this.isEdit ? this.modalData.data.menuSequence : '';
    const status = this.isEdit ? this.modalData.data.status : '';

    this.menuForm = this._formBuilder.group({
      menuId: [menuId, [Validators.required]],
      menuTitle: [menuTitle, [Validators.required]],
      menuDescription: [menuDescription, [Validators.required]],
      parentId: [parentId, [Validators.required]],
      menuUrl: [menuUrl, [Validators.required]],
      pageId: [pageId, [Validators.required]],
      menuSequence: [menuSequence, [Validators.required]],
      status: [status, [Validators.required]]
    });
  }

  close(): void {
    this.matDialogRef.close();
  }
}

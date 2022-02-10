import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../admin.service';
import { Status } from '../../admin.types';
import { genRandomNumber } from '../../mock-admin-data';
import { ModalData, ModalMode } from '../modal.types';



@Component({
  selector: 'app-organization-modal',
  templateUrl: './organization-modal.component.html',
  styleUrls: ['./organization-modal.component.scss']
})
export class OrganizationModalComponent implements OnInit {
  isEdit: boolean = false;
  organizationForm: FormGroup;
  statuses: any[] = [
    { title: 'Active', value: Status.ACTIVE },
    { title: 'Inactive', value: Status.INACTIVE }
  ];
  bus: any[];
  subBus: any[];
  plants: any[];
  divisions: any[];
  departments: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    public matDialogRef: MatDialogRef<OrganizationModalComponent>,
    private _formBuilder: FormBuilder,
    private _adminService: AdminService
  ) { }

  ngOnInit(): void {
    // get all admin values
    this.bus = this._adminService.getBus().map((bu) => ({ title: bu.buDescription, value: bu }));
    this.subBus = this._adminService.getSubBus().map((subBu) => ({ title: subBu.subBuDescription, value: subBu }));
    this.plants = this._adminService.getPlants().map((plant) => ({ title: plant.plantDescription, value: plant }));
    this.divisions = this._adminService.getDivisions().map((division) => ({ title: division.divisionDescription, value: division }));
    this.departments = this._adminService.getDepartments().map((department) => ({ title: department.departmentDescription, value: department }));

    this.isEdit = this.modalData.mode === ModalMode.EDIT;
    const organizationCode = this.isEdit ? this.modalData.data.organizationCode : genRandomNumber();
    const organizationDescription = this.isEdit ? this.modalData.data.organizationDescription : '';
    const bu = this.isEdit ? this.modalData.data.bu : undefined;
    const subBu = this.isEdit ? this.modalData.data.subBu : undefined;
    const plant = this.isEdit ? this.modalData.data.plant : undefined;
    const division = this.isEdit ? this.modalData.data.division : undefined;
    const department = this.isEdit ? this.modalData.data.department : undefined;
    const status = this.isEdit ? this.modalData.data.status : '';

    this.organizationForm = this._formBuilder.group({
      organizationCode: [organizationCode, [Validators.required]],
      organizationDescription: [organizationDescription, [Validators.required]],
      bu: [bu, [Validators.required]],
      subBu: [subBu, [Validators.required]],
      plant: [plant, [Validators.required]],
      division: [division, [Validators.required]],
      department: [department, [Validators.required]],
      status: [status, [Validators.required]]
    });
  }

  compareBuCodeFn(obj1, obj2): boolean {
    if (obj1 && obj2) {
      return obj1['buCode'] == obj2['buCode'];
    } else {
      return false;
    }
  }

  compareSubBuCodeFn(obj1, obj2): boolean {
    if (obj1 && obj2) {
      return obj1['subBuCode'] == obj2['subBuCode'];
    } else {
      return false;
    }
  }

  comparePlantCodeFn(obj1, obj2): boolean {
    if (obj1 && obj2) {
      return obj1['plantCode'] == obj2['plantCode'];
    } else {
      return false;
    }
  }

  compareDivisionCodeFn(obj1, obj2): boolean {
    if (obj1 && obj2) {
      return obj1['divisionCode'] == obj2['divisionCode'];
    } else {
      return false;
    }
  }

  compareDepartmentCodeFn(obj1, obj2): boolean {
    if (obj1 && obj2) {
      return obj1['departmentCode'] == obj2['departmentCode'];
    } else {
      return false;
    }
  }

  close(): void {
    this.matDialogRef.close();
  }
}

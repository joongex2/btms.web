import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'form-multi-select-dropdown',
  templateUrl: './form-multi-select-dropdown.component.html',
  styleUrls: ['./form-multi-select-dropdown.component.scss'],
})
export class FormMultiSelectDropdownComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  form: FormGroup
  @Input() label: string;
  @Input() name: string;
  @Input() placeholder: string;
  @Input() options: any;

  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    this.form = <FormGroup>this.controlContainer.control;
    // this.dropdownList = this.options;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
}

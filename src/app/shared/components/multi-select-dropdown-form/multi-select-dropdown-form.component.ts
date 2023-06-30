import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'multi-select-dropdown-form',
  templateUrl: './multi-select-dropdown-form.component.html',
  styleUrls: ['./multi-select-dropdown-form.component.scss'],
})
export class MultiSelectDropdownFormComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  form: FormGroup
  @Input() label: string;
  @Input() name: string;
  @Input() placeholder: string;
  @Input() options: any;
  @Input() itemsShowLimit: number = 3;

  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    this.form = <FormGroup>this.controlContainer.control;
    // this.dropdownList = this.options;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'title',
      tooltipField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: this.itemsShowLimit,
      allowSearchFilter: true
    };
  }
}

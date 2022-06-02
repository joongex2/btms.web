import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";


// autocomplete use with ngModel
@Component({
    selector: 'autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class AutocompleteComponent implements OnInit {
    @Input() label;
    @Input() name;
    @Input() options: any[] = [];
    @Input() showLabel = false;
    @Input() required = false;
    @Input() requireMatch = true;
    @Input() disabled = false;
    @Input()
    get value() {
        return this._value;
    }
    set value(value) {
        if (this._value !== value) {
            this._value = value;
            this.optionFilter(value);
        }
    }
    @Output() valueChange = new EventEmitter<string | any>();

    private _value: string | any;
    filteredOptions: any[] = [];

    constructor() { }

    ngOnInit(): void {
        this.filteredOptions = this.options.slice();
    }

    optionFilter(value: any) {
        let filterValue;
        if (!value) {
            filterValue = '';
        } else {
            filterValue = typeof value === 'string' ? value : value.title;
        }
        this.filteredOptions = this.options.filter(v => v.title.toLowerCase().includes(filterValue.toLowerCase()));
    }

    valueChangeHandler(value: any) {
        this.valueChange.emit(value);
    }

    displayFn(value: any): string {
        return value && value.title ? value.title : '';
    }
}
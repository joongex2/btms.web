import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";


// autocomplete use with ngModel
@Component({
    selector: 'autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class AutocompleteComponent {
    @Input() label;
    @Input() name;
    @Input() options: any[] = [];
    @Input() showLabel = false;
    @Input() showColon = true;
    @Input() required = false;
    @Input() requireMatch = false;
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
    passOptions: any[];

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.options) {
            if (this.value) {
                this.optionFilter(this.value);
            } else {
                this.filteredOptions = this.options.slice();
            }
            if (this.requireMatch !== false) {
                this.passOptions = this.options;
            }
        }
        if (changes.requireMatch) {
            if (changes.requireMatch.currentValue !== false) {
                this.passOptions = this.options;
            } else {
                this.passOptions = undefined;
            }
        }
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

    blurHandler() {
        if (this.requireMatch && typeof this.value === 'string') {
            const matchedOption = this.options.find(v => v.title === this.value);
            if (matchedOption) {
                this.value = matchedOption;
                this.valueChange.emit(this.value);
            }
        }
    }
}
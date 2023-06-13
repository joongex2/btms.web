import { Component, Input, OnInit, Optional, SimpleChanges } from "@angular/core";
import { ControlContainer, FormBuilder, FormGroup } from "@angular/forms";
import { requireMatchValidator } from "app/shared/directives/require-match.directive";
import { map, Observable, startWith } from "rxjs";


// autocomplete use with formControl
@Component({
    selector: 'autocomplete-form',
    templateUrl: './autocomplete-form.component.html',
    styleUrls: ['./autocomplete-form.component.scss']
})
export class AutocompleteFormComponent implements OnInit {
    public parentForm: FormGroup;
    @Input() label;
    @Input() name;
    @Input() options: any[] = [];
    @Input() showLabel = false;
    @Input() standAlone = false;
    @Input() addRequireMatch = false;
    filteredOptions: Observable<any[]>;

    constructor(
        @Optional() private controlContainer: ControlContainer,
        private _formBuilder: FormBuilder,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        // trigger new filteredOptions
        if (changes['options'] && !changes['options'].firstChange) {
            const value = typeof this.form.value === 'string' ? this.form.value : this.form.value?.title;
            this.form.setValue(value)
        }
    }

    ngOnInit(): void {
        if (this.standAlone) {
            this.parentForm = this._formBuilder.group({ [this.name]: null });
        } else {
            this.parentForm = this.controlContainer.control as FormGroup;
        }

        if (this.addRequireMatch) {
            this.form.addValidators(requireMatchValidator);
            this.form.updateValueAndValidity();
        }

        const startValue = this.form.value ? this.form.value : '';
        this.filteredOptions = this.form.valueChanges.pipe(
            startWith(startValue),
            map(value => (typeof value === 'string' ? value : value?.title)),
            map(name => (name ? this._filterOption(name) : this.options.slice())),
        );
    }

    private _filterOption(search: string): Partial<any>[] {
        const filterValue = search.toLowerCase();

        return this.options.filter(option => option.title.toLowerCase().includes(filterValue));
    }

    displayFn(value: any): string {
        return value && value.title ? value.title : value;
    }

    get value() {
        return this.parentForm.get(this.name).value;
    }

    get form() {
        return this.parentForm.get(this.name);
    }
}
import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormGroup, NgForm } from "@angular/forms";
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
    filteredOptions: Observable<any[]>;

    constructor(private controlContainer: ControlContainer) { }

    ngOnInit(): void {
        this.parentForm = this.controlContainer.control as FormGroup;
        this.filteredOptions = this.parentForm.get(this.name).valueChanges.pipe(
            startWith(''),
            map(value => (typeof value === 'string' ? value : value.title)),
            map(name => (name ? this._filterOption(name) : this.options.slice())),
        );
    }

    private _filterOption(search: string): Partial<any>[] {
        const filterValue = search.toLowerCase();

        return this.options.filter(option =>
            option.value.includes(search) || option.title.toLowerCase().includes(filterValue)
        );
    }

    displayFn(value: any): string {
        return value && value.title ? value.title : '';
    }
}
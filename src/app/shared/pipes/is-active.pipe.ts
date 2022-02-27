import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'isActive',
})
export class IsActivePipe implements PipeTransform {
    constructor() { }

    /**
     * Transform
     *
     * @param value isActive
     */
    transform(value: boolean): string {
        switch (value) {
            case true:
                return 'Active';
            case false:
                return 'Inactive';
            default:
                return '-';
        }
    }
}
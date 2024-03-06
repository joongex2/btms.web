import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'targetValueStatus',
})
export class TargetValueStatusPipe implements PipeTransform {
    constructor() { }

    /**
     * Transform
     *
     * @param value valueStatus
     */
    transform(value: string): string {
        switch (value) {
            case 'achieve':
                return 'A';
            case 'unachieved':
                return 'U';
            case 'na':
                return 'N';
            default:
                return '';
        }
    }
}
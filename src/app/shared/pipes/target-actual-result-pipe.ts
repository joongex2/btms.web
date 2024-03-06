import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'targetActualResult',
})
export class TargetActualResultPipe implements PipeTransform {
    constructor() { }

    /**
     * Transform
     *
     * @param value targetActualResult
     */
    transform(value: string): string {
        switch (value) {
            case 'A':
                return 'Achieve';
            case 'U':
                return 'Unachieved';
            case 'N':
                return 'N/A';
            default:
                return '';
        }
    }
}
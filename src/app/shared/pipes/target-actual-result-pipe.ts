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
                return 'Archive';
            case 'U':
                return 'Unarchive';
            case 'N':
                return 'N/A';
            default:
                return '';
        }
    }
}
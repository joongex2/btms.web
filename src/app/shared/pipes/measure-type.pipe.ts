import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'measureType',
})
export class MeasureTypePipe implements PipeTransform {
    constructor() { }

    /**
     * Transform
     *
     * @param value measureType
     */
    transform(value: string): string {
        switch (value) {
            case '1':
                return 'ปริมาณ';
            case '2':
                return 'คุณภาพ';
            default:
                return '-';
        }
    }
}
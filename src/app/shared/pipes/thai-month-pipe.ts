import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'thaiMonth',
})
export class ThaiMonthPipe implements PipeTransform {
    constructor() { }

    /**
     * Transform
     *
     * @param value A number of month 0-index 
     */
    transform(value: number): string {
        switch (value) {
            case 0:
                return 'ม.ค.';
            case 1:
                return 'ก.พ.';
            case 2:
                return 'มี.ค.';
            case 3:
                return 'เม.ย.';
            case 4:
                return 'พ.ค.';
            case 5:
                return 'มิ.ย.';
            case 6:
                return 'ก.ค.';
            case 7:
                return 'ส.ค.';
            case 8:
                return 'ก.ย.';
            case 9:
                return 'ต.ค.';
            case 10:
                return 'พ.ย.';
            case 11:
                return 'ธ.ค.';
            default:
                return '-';
        }
    }
}
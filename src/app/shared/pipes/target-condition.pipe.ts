import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'targetCondition',
})
export class TargetConditionPipe implements PipeTransform {
    constructor() { }

    /**
     * Transform
     *
     * @param value targetCondition
     */
    transform(value: string): string {
        switch (value) {
            case '1':
                return 'แบบเดี่ยว';
            case '2':
                return 'แบบช่วง';
            default:
                return '-';
        }
    }
}
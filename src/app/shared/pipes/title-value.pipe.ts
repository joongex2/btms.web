import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'titleValue',
})
export class TitleValuePipe implements PipeTransform {
    constructor() { }

    /**
     * Transform
     *
     * @param value value which can map to title
     * @param titleMap map between title and value
     */
    transform(value: string, titleMap = []): string {
        return titleMap.find(v => v.value === value)?.title;
    }
}
import * as moment from 'moment';
export interface DateParse { dateInput: any; }
export type DateDisplay = DateParse & {
    monthYearLabel?: string,
    dateA11yLabel?: string,
    monthYearA11yLabel?: string,
};
export class CustomDateFormat {
    private _parse: DateParse = {
        dateInput: 'DD/MM/YYYY'
    };
    private _display: DateDisplay = {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'DD/MM/YYYY',
        monthYearA11yLabel: 'MMMM YYYY'
    };

    set parse(parse: DateParse) {
        this._parse = Object.assign({}, this._parse, parse);
    }

    get parse(): DateParse {
        return this._parse;
    }

    set display(display: DateDisplay) {
        this._display = Object.assign({}, this._display, display);
    }

    get display(): DateDisplay {
        return this._display;
    }

    updateDateFormat(format: string) {
        this.parse = { dateInput: format };
        this.display = { dateInput: format, dateA11yLabel: format };
    }
}
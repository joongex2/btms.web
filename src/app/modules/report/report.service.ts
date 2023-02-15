import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { DocumentParams } from "app/shared/interfaces/document.interface";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    constructor(private _httpClient: HttpClient) { }

    getReports(
        page?: number,
        size?: number,
        sort?: string,
        order?: string,
        params?: DocumentParams
    ): Observable<any> {
        const _page = page ? `page=${page}` : '';
        const _size = size ? `size=${size}` : '';
        // sort
        let tempSort: string;
        if (sort && order) {
            tempSort = sort;
            if (order && order === 'desc') {
                tempSort = '-' + sort;
            }
        }
        const _sort = tempSort ? `sort=${tempSort}` : '';
        // query params
        const queryParams = [_page, _size, _sort].filter((q) => q != '');
        if (params) {
            for (let [key, value] of Object.entries(params)) {
                if (value) queryParams.push(`${key}=${value}`);
            };
        }
        let queryString = queryParams.filter((q) => q != '').join('&');
        if (queryString) queryString = `?${queryString}`;
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Reports${queryString}`));
    }
}
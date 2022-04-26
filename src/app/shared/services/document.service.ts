import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { map, Observable } from "rxjs";
import { DocumentParams, Target } from "../interfaces/document.interface";

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    constructor(private _httpClient: HttpClient) { }

    createDocument(
        id: number,
        organizeCode: string,
        businessUnitCode: string,
        subBusinessUnitCode: string,
        plantCode: string,
        divisionCode: string,
        documentType: string,
        targetType: string,
        documentYear: string,
        targets: Target[]
    ): Observable<any> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Documents'), {
            id,
            organizeCode,
            businessUnitCode,
            subBusinessUnitCode,
            plantCode,
            divisionCode,
            documentType,
            targetType,
            documentYear,
            targets
        });
    }

    getDocuments(
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
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Documents${queryString}`));
    }

    getDocument(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Documents/${id}`)).pipe(map(data => data.model));
    }
}
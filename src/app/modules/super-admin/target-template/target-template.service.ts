import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { DocumentParams, Target } from "app/shared/interfaces/document.interface";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { map, Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class TargetTemplateService {
    constructor(private _httpClient: HttpClient) { }

    createTargetTemplate(
        documentName: string,
        documentType: string,
        documentStatus: string,
        documentYear: string,
        targets: Target[]
    ): Observable<any> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Templates'), {
            id: 0,
            documentName,
            documentType,
            documentStatus,
            documentYear,
            targets
        });
    }

    editTargetTemplate(
        id: number,
        documentName: string,
        documentType: string,
        documentStatus: string,
        documentYear: string,
        targets: Target[]
    ) {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Templates'), {
            id,
            documentName,
            documentType,
            documentStatus,
            documentYear,
            targets,
            markForEdit: true
        });
    }

    getTargetTemplates(
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
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Templates${queryString}`));
    }

    getTargetTemplate(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Templates/${id}`)).pipe(map(data => data.model));;
    }

    deployTemplates(organizes: string[]): Observable<any> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Templates/deploy'), organizes);
    }
}
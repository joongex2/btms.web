import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TargetResultService } from "app/modules/target-result/target-result.service";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { map, Observable } from "rxjs";
import { DocumentDetail, DocumentParams, Target } from "../interfaces/document.interface";

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private mockDocument: DocumentDetail;

    constructor(
        private _httpClient: HttpClient,
        private _targetResultService: TargetResultService
    ) { }

    createDocument(
        id: number,
        organizeCode: string,
        businessUnitCode: string,
        subBusinessUnitCode: string,
        plantCode: string,
        divisionCode: string,
        documentType: string,
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
            documentYear,
            targets
        });
    }

    editDocument(
        id: number,
        documentStatus: string,
        targets: Target[]
    ): Observable<any> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Documents'), {
            id,
            documentStatus,
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

    getSubmitEmail(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Documents/${id}/submit`)).pipe(map(data => data.model));
    }

    getRejectEmail(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Documents/${id}/reject`)).pipe(map(data => data.model));
    }

    patchSubmitEmail(id: number, comment: string, informEmails: string[], receiveEmails: string[]): Observable<any> {
        return this._httpClient.patch(getBaseUrl(`/v1/Documents/${id}/submit`), {
            id,
            comment,
            informEmails,
            receiveEmails
        });
    }

    patchSendEmail(id: number, comment: string, informEmails: string[], receiveEmails: string[]): Observable<any> {
        return this._httpClient.patch(getBaseUrl(`/v1/Documents/${id}/send`), {
            id,
            comment,
            informEmails,
            receiveEmails
        });
    }

    patchRejectEmail(id: number, comment: string, informEmails: string[], receiveEmails: string[]): Observable<any> {
        return this._httpClient.patch(getBaseUrl(`/v1/Documents/${id}/reject`), {
            id,
            comment,
            informEmails,
            receiveEmails
        });
    }

    copyDocument(id: number): Observable<any> {
        return this._httpClient.post(getBaseUrl(`/v1/Documents/${id}/copy`), {});
    }

    // mockDocument
    setMockDocument(document: DocumentDetail) {
        this.mockDocument = document;
        this.mockActualTarget(document.targets); // TODO remove
        this._targetResultService.clear();
    }

    getMockDocument(): DocumentDetail {
        return this.mockDocument;
    }

    // mock actualTargets
    mockActualTarget(targets: Target[]) {
        for (let target of targets) {
            for (let subTarget of target.details) {
                for (let plan of subTarget.plans) {
                    for (let i = 1; i <= 12; i++) {
                        plan[`actualTarget${i}`] = null;
                    }
                }
            }
        }
    }
}
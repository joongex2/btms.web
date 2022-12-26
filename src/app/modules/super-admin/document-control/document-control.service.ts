import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DocumentControlService {
    constructor(private _httpClient: HttpClient) { }

    createDocumentControl(
        organizeCode: string,
        documentCode: string,
        documentType: string,
        prefix: string,
        suffix: string,
        lengthOfRunningNo: string,
        lastDocumentNo: string,
        lastRunningNo: string,
        isActive: boolean
    ): Observable<any> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/DocumentControls'), {
            organizeCode,
            documentCode,
            documentType,
            prefix,
            suffix,
            lengthOfRunningNo,
            lastDocumentNo,
            lastRunningNo,
            isActive
        }).pipe(map(data => data.model));
    }

    getDocumentControls(): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/DocumentControls`)).pipe(map(data => data.model));
    }

    getDocumentControl(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/DocumentControls/${id}`)).pipe(map(data => data.model));
    }

    updateDocumentControl(
        id: number,
        organizeCode: string,
        documentCode: string,
        documentType: string,
        prefix: string,
        suffix: string,
        lengthOfRunningNo: string,
        lastDocumentNo: string,
        lastRunningNo: string,
        isActive: boolean
    ): Observable<any> {
        return this._httpClient.put<ResultMapper>(getBaseUrl(`/v1/DocumentControls/${id}`), {
            organizeCode,
            documentCode,
            documentType,
            prefix,
            suffix,
            lengthOfRunningNo,
            lastDocumentNo,
            lastRunningNo,
            isActive
        }).pipe(map(data => data.model));
    }

    deleteDocumentControl(id: number): Observable<any> {
        return this._httpClient.delete<ResultMapper>(getBaseUrl(`/v1/DocumentControls/${id}`)).pipe(map(data => data.model));
    }
}
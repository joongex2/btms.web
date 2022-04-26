import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MasterService {
    constructor(private _httpClient: HttpClient) { }

    createMaster(
        type: string,
        code: string,
        name: string
    ): Observable<any> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Masters'), {
            type,
            code,
            name
        }).pipe(map(data => data.model));
    }

    getMasters(masterType?: string): Observable<any> {
        const queryString = masterType ? `?masterType=${masterType}` : '';
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Masters${queryString}`)).pipe(map(data => data.model));
    }

    getMaster(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Masters/${id}`)).pipe(map(data => data.model));
    }

    updateMaster(
        id: number,
        type: string,
        code: string,
        name: string,
        isActive: boolean
    ): Observable<any> {
        return this._httpClient.put<ResultMapper>(getBaseUrl(`/v1/Masters/${id}`), {
            type,
            code,
            name,
            isActive
        }).pipe(map(data => data.model));
    }

    deleteMaster(id: number): Observable<any> {
        return this._httpClient.delete<ResultMapper>(getBaseUrl(`/v1/Masters/${id}`)).pipe(map(data => data.model));
    }

    getMasterTypes(): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl('/v1/Masters/types')).pipe(map(data => data.model));
    }
}
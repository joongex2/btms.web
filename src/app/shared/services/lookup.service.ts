import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LookupService {
    constructor(private _httpClient: HttpClient) { }

    createLookup(
        lookupType: string,
        lookupCode: string,
        lookupDescription: string,
        lookupSequence: number,
        isActive: boolean,
    ): Observable<any> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Lookups'), {
            id: 0,
            lookupType,
            lookupCode,
            lookupDescription,
            lookupSequence,
            isActive
        }).pipe(map(data => data.model));
    }

    getLookups(type?: string, code?: string): Observable<any> {
        const _type = type ? `lookupType=${type}` : '';
        const _code = code ? `lookupCode=${code}` : '';
        const queryParams = [_type, _code].filter((q) => q != '');
        let queryString = queryParams.filter((q) => q != '').join('&');
        if (queryString) queryString = `?${queryString}`;
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Lookups${queryString}`)).pipe(map(data => data.model));
    }

    getLookup(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Lookups/${id}`)).pipe(map(data => data.model));
    }

    updateLookup(
        id: number,
        lookupType: string,
        lookupCode: string,
        lookupDescription: string,
        lookupSequence: number,
        isActive: boolean,
    ): Observable<any> {
        return this._httpClient.put<ResultMapper>(getBaseUrl(`/v1/Lookups/${id}`), {
            id,
            lookupType,
            lookupCode,
            lookupDescription,
            lookupSequence,
            isActive,
        }).pipe(map(data => data.model));
    }

    deleteLookup(id: number): Observable<any> {
        return this._httpClient.delete<ResultMapper>(getBaseUrl(`/v1/Lookups/${id}`)).pipe(map(data => data.model));
    }

    getLookupTypes(): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Lookups/types`)).pipe(map(data => data.model));
    }

    getLookupWorkflows(): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Lookups/workflows`));
    }
}
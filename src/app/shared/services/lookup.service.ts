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

    getLookups(type?: string, code?: string): Observable<any> {
        const _type = type ? `lookupType=${type}` : '';
        const _code = code ? `lookupCode=${code}` : '';
        const queryParams = [_type, _code].filter((q) => q != '');
        let queryString = queryParams.filter((q) => q != '').join('&');
        if (queryString) queryString = `?${queryString}`;
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Lookups${queryString}`)).pipe(map(data => data.model));
    }
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    constructor(private _httpClient: HttpClient) { }

    createOrganization(
        code: string,
        name: string,
        businessCode: string,
        subBusinessCode: string,
        plantCode: string,
        divisionCode: string
    ): Observable<any> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Organizes'), {
            code,
            name,
            businessCode,
            subBusinessCode,
            plantCode,
            divisionCode
        }).pipe(map(data => data.model));
    }

    getOrganizations(): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl('/v1/Organizes')).pipe(map(data => data.model));
    }

    getOrganization(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Organizes/${id}`)).pipe(map(data => data.model));
    }

    updateOrganization(
        id: number,
        code: string,
        name: string,
        businessCode: string,
        subBusinessCode: string,
        plantCode: string,
        divisionCode: string,
        isActive: boolean
    ): Observable<any> {
        return this._httpClient.put<ResultMapper>(getBaseUrl(`/v1/Organizes/${id}`), {
            code,
            name,
            businessCode,
            subBusinessCode,
            plantCode,
            divisionCode,
            isActive
        }).pipe(map(data => data.model));
    }

    deleteOrganization(id: number): Observable<any> {
        return this._httpClient.delete<ResultMapper>(getBaseUrl(`/v1/Organizes/${id}`)).pipe(map(data => data.model));
    }
}
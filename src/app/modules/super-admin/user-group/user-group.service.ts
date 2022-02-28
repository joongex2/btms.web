import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserGroupService {
    constructor(private _httpClient: HttpClient) { }

    createUserGroup(
        name: string,
        menus: any,
        isActive: boolean
    ): Observable<any> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Groups'), {
            name,
            menus,
            isActive
        }).pipe(map(data => data.model));
    }

    getUserGroups(): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl('/v1/Groups')).pipe(map(data => data.model));
    }

    getUserGroup(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Groups/${id}`)).pipe(map(data => data.model));
    }

    updateUserGroup(
        id: number,
        name: string,
        menus: any,
        isActive: boolean
    ): Observable<any> {
        return this._httpClient.put<ResultMapper>(getBaseUrl(`/v1/Groups/${id}`), {
            name,
            menus,
            isActive
        }).pipe(map(data => data.model));
    }

    deleteUserGroup(id: number): Observable<any> {
        return this._httpClient.delete<ResultMapper>(getBaseUrl(`/v1/Groups/${id}`)).pipe(map(data => data.model));
    }

    getDefaultMenu(): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Groups/menus`)).pipe(map(data => data.model));
    }
}
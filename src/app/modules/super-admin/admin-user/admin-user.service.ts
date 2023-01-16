import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AdminUserService {
    constructor(private _httpClient: HttpClient) { }

    createAdminUser(
        name: string,
        email: string,
        username: string,
        groupId: number,
        isActive: boolean,
        organizes: any
    ): Observable<any> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Users/admins'), {
            name,
            email,
            username,
            groupId,
            isActive,
            organizes
        }).pipe(map(data => data.model));
    }

    getAdminUsers(): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Users/admins`)).pipe(map(data => data.model));
    }

    getAdminUser(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Users/admins/${id}`)).pipe(map(data => data.model));
    }

    updateAdminUser(
        id: number,
        name: string,
        email: string,
        username: string,
        groupId: number,
        isActive: boolean,
        organizes: any
    ): Observable<any> {
        return this._httpClient.put<ResultMapper>(getBaseUrl(`/v1/Users/admins/${id}`), {
            id,
            name,
            username,
            email,
            groupId,
            isActive,
            organizes
        }).pipe(map(data => data.model));
    }

    deleteUser(id: number): Observable<any> {
        return this._httpClient.delete<ResultMapper>(getBaseUrl(`/v1/Users/${id}`)).pipe(map(data => data.model));
    }
}
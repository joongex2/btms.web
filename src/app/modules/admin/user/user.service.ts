import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private _httpClient: HttpClient) { }

    createUser(
        roleId: number,
        name: string,
        nameInThai: string,
        employeeCode: string,
        username: string,
        organizeUnit: string,
        isActive: boolean,
        menu: string
    ): Observable<any> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Users'), {
            roleId,
            name,
            nameInThai,
            employeeCode,
            username,
            organizeUnit,
            isActive,
            menu
        }).pipe(map(data => data.model));
    }

    getUsers(): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Users`)).pipe(map(data => data.model));
    }

    getUser(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Users/${id}`)).pipe(map(data => data.model));
    }

    updateUser(
        id: number,
        roleId: number,
        isActive: boolean,
        menu: string
    ): Observable<any> {
        return this._httpClient.put<ResultMapper>(getBaseUrl(`/v1/Users/${id}`), {
            id,
            roleId,
            isActive,
            menu
        }).pipe(map(data => data.model));
    }

    deleteUser(id: number): Observable<any> {
        return this._httpClient.delete<ResultMapper>(getBaseUrl(`/v1/Users/${id}`)).pipe(map(data => data.model));
    }
}
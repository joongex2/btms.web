import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    constructor(private _httpClient: HttpClient) { }

    createRole(
        code: string,
        name: string,
        workflowStatuses: any
    ): Observable<any> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Roles'), {
            code,
            name,
            workflowStatuses
        }).pipe(map(data => data.model));
    }

    getRoles(): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl('/v1/Roles')).pipe(map(data => data.model));
    }

    getRole(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Roles/${id}`)).pipe(map(data => data.model));
    }

    updateRole(
        id: number,
        name: string,
        isActive: boolean,
        workflowStatuses: any
    ): Observable<any> {
        return this._httpClient.put<ResultMapper>(getBaseUrl(`/v1/Roles/${id}`), {
            name,
            isActive,
            workflowStatuses
        }).pipe(map(data => data.model));
    }

    deleteRole(id: number): Observable<any> {
        return this._httpClient.delete<ResultMapper>(getBaseUrl(`/v1/Roles/${id}`)).pipe(map(data => data.model));
    }

    getWorkflowStatuses(): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl('/v1/Roles/workflow-statuses')).pipe(map(data => data.model));
    }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getBaseUrl } from 'app/shared/helpers/get-base-url';
import { ResultMapper } from 'app/shared/interfaces/result-mapper.interface';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ActionPlanStatus, QualityManagementPerformance, QualityManagementPerformanceByBu } from './dashboard.interfaces';

export interface BusinessUnit {
    businessUnitCode: string;
    plants: { plantCode: string }[];
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient.get('api/dashboards/project').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    qualityManagementPerformance(year: number, month: number, businessUnits: BusinessUnit[]): Observable<QualityManagementPerformance> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Dashboard/Quality-Management-Performance'), {
            year: year,
            month: month,
            businessUnits: businessUnits
        }).pipe(map(data => data.model));
    }

    qualityManagementPerformanceByBu(year: number, month: number, businessUnits: BusinessUnit[]): Observable<QualityManagementPerformanceByBu[]> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Dashboard/Quality-Management-Performance-by-BusinessUnit'), {
            year: year,
            month: month,
            businessUnits: businessUnits
        }).pipe(map(data => data.model));
    }

    actionPlanStatus(businessUnits: BusinessUnit[]): Observable<ActionPlanStatus[]> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Dashboard/Action-Plan-Status'), {
            businessUnits: businessUnits
        }).pipe(map(data => data.model));
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getBaseUrl } from 'app/shared/helpers/get-base-url';
import { ResultMapper } from 'app/shared/interfaces/result-mapper.interface';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ActionPlanStatus, QualityManagementPerformance, QualityManagementPerformanceByBu } from './dashboard.interfaces';

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

    qualityManagementPerformance(year: number, month: number, bus: string[], plants: string[]): Observable<QualityManagementPerformance> {
        const _year = `year=${year}`;
        const _month = `month=${month}`;
        const _bus = bus && bus.length > 0 ? `businessUnits=${encodeURIComponent(bus.join('|'))}` : '';
        const _plants = plants && plants.length > 0 ? `plants=${encodeURIComponent(plants.join('|'))}` : '';

        const queryParams = [_year, _month, _bus, _plants].filter((q) => q != '');
        let queryString = queryParams.filter((q) => q != '').join('&');
        if (queryString) queryString = `?${queryString}`;

        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Dashboard/Quality-Management-Performance${queryString}`)).pipe(map(data => data.model));
    }

    qualityManagementPerformanceByBu(year: number, month: number, bus: string[], plants: string[]): Observable<QualityManagementPerformanceByBu[]> {
        const _year = `year=${year}`;
        const _month = `month=${month}`;
        const _bus = bus && bus.length > 0 ? `businessUnits=${encodeURIComponent(bus.join('|'))}` : '';
        const _plants = plants && plants.length > 0 ? `plants=${encodeURIComponent(plants.join('|'))}` : '';

        const queryParams = [_year, _month, _bus, _plants].filter((q) => q != '');
        let queryString = queryParams.filter((q) => q != '').join('&');
        if (queryString) queryString = `?${queryString}`;

        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Dashboard/Quality-Management-Performance-by-BusinessUnit${queryString}`)).pipe(map(data => data.model));
    }

    actionPlanStatus(year: number, month: number,bus: string[], plants: string[]): Observable<ActionPlanStatus[]> {
        const _year = `year=${year}`;
        const _month = `month=${month}`;
        const _bus = bus && bus.length > 0 ? `businessUnits=${encodeURIComponent(bus.join('|'))}` : '';
        const _plants = plants && plants.length > 0 ? `plants=${encodeURIComponent(plants.join('|'))}` : '';

        const queryParams = [_year, _month,_bus, _plants].filter((q) => q != '');
        let queryString = queryParams.filter((q) => q != '').join('&');
        if (queryString) queryString = `?${queryString}`;

        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Dashboard/Action-Plan-Status${queryString}`)).pipe(map(data => data.model));
    }
}

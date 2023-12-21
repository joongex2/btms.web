import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { firstValueFrom, map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MasterService {
    constructor(private _httpClient: HttpClient) { }

    createMaster(
        type: string,
        code: string,
        name: string,
        parentId: number,
        displaySequence: number,
    ): Observable<any> {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Masters'), {
            type,
            code,
            name,
            parentId,
            displaySequence
        }).pipe(map(data => data.model));
    }

    getMasters(masterType?: string): Observable<any> {
        const queryString = masterType ? `?masterType=${masterType}` : '';
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Masters${queryString}`)).pipe(map(data => data.model));
    }

    getActiveMasters(masterType?: string): Observable<any> {
        const queryString = masterType ? `?masterType=${masterType}` : '';
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Masters${queryString}`)).pipe(map(data => data.model.filter((obj: { isActive: boolean; }) => obj.isActive == true)));
    }

    getMaster(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Masters/${id}`)).pipe(map(data => data.model));
    }

    updateMaster(
        id: number,
        type: string,
        code: string,
        name: string,
        parentId: number,
        displaySequence: number,
        isActive: boolean
    ): Observable<any> {
        return this._httpClient.put<ResultMapper>(getBaseUrl(`/v1/Masters/${id}`), {
            type,
            code,
            name,
            parentId,
            displaySequence,
            isActive
        }).pipe(map(data => data.model));
    }

    deleteMaster(id: number): Observable<any> {
        return this._httpClient.delete<ResultMapper>(getBaseUrl(`/v1/Masters/${id}`)).pipe(map(data => data.model));
    }

    getMasterTypes(): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl('/v1/Masters/types')).pipe(map(data => data.model));
    }

    // code
    getBus(): Observable<any> {
        return this.getActiveMasters('BUSINESS_UNIT').pipe(map((bus) => (bus.map(bu => ({ title: bu.name, value: bu.code, id: bu.id })))));
    }

    getSubBus(buId?: number): Observable<any> {
        return this.getActiveMasters('SUB_BUSINESS_UNIT').pipe(map((subBus) => (subBus
            .filter(subBu => buId ? subBu.parentId === buId : true)
            .map(subBu => ({ title: subBu.name, value: subBu.code, id: subBu.id, parentId: subBu.parentId }))
        )));
    }

    getPlants(subBuId?: number): Observable<any> {
        return this.getMasters('PLANT').pipe(map((plants) => (plants
            .filter(plant => subBuId ? plant.parentId === subBuId : true)
            .map(plant => ({ title: plant.name, value: plant.code, id: plant.id, parentId: plant.parentId }))
        )));
    }

    getDashboardPlants(subBuId?: number): Observable<any> {
        return this.getActiveMasters('PLANT').pipe(map((plants) => (plants
            .filter(plant => subBuId ? plant.parentId === subBuId : true)
            .map(plant => ({ title: `${plant.code} (${plant.name})`, value: plant.code, id: plant.id, parentId: plant.parentId }))
        )));
    }

    getDivisions(): Observable<any> {
        return this.getMasters('DIVISION').pipe(map((divisions) => (divisions.map(division => ({ title: division.name, value: division.code, id: division.id })))));
    }

    // id
    async getBuIds(): Promise<any> {
        return (await firstValueFrom(this.getMasters('BUSINESS_UNIT'))).map(bu => ({ title: bu.name, value: bu.id }));
    }

    async getSubBuIds(): Promise<any> {
        return (await firstValueFrom(this.getMasters('SUB_BUSINESS_UNIT'))).map(subBu => ({ title: subBu.name, value: subBu.id }));
    }

    async getPlantIds(): Promise<any> {
        return (await firstValueFrom(this.getMasters('PLANT'))).map(plant => ({ title: plant.name, value: plant.id }));
    }

    async getDivisionIds(): Promise<any> {
        return (await firstValueFrom(this.getMasters('DIVISION'))).map(division => ({ title: division.name, value: division.id }));
    }
}
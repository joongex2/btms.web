import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { map, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TargetTrackService {
    constructor(private _httpClient: HttpClient) { }

    getTargetTracks(): Observable<any> {
        return of([
        {
            id: 1,
            plant: 'บริษัท เบทาโกร จำกัด มหาชน (โรงงานลพบุรี 1)',
            targetYear: '2023',
            targetType: 'ระบบการจัดการ',
            runningNo: 'OBJ-A005-PD-22-01',
            status: 'Draft'
        },
        {
            id: 2,
            plant: 'บริษัท เบทาโกร จำกัด มหาชน (โรงงานลพบุรี 2)',
            targetYear: '2023',
            targetType: 'ระบบคุณภาพ',
            runningNo: 'OBJ-A006-PD-22-01',
            status: 'Issued'
        }
        ]);
        // return this._httpClient.get<ResultMapper>(getBaseUrl('/v1/AnnualReport')).pipe(map(data => data.model));
    }
}
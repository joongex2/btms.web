import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { map, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SaveCauseTrackService {
    constructor(private _httpClient: HttpClient) { }

    getSaveCauseTracks(): Observable<any> {
        return of([
        {
            id: 1,
            plant: 'บริษัท เบทาโกร จำกัด มหาชน (โรงงานลพบุรี 1)',
            targetYear: '2023',
            targetType: 'ระบบการจัดการ',
            targetName: 'ควบคุมค่าน้ำทิ้ง ให้อยู่ในเกณฑ์ที่กฎหมายกำหนด ISO14001'
        },
        {
            id: 2,
            plant: 'บริษัท เบทาโกร จำกัด มหาชน (โรงงานลพบุรี 2)',
            targetYear: '2023',
            targetType: 'ระบบคุณภาพ',
            targetName: 'จัดแผนการโยกสินค้ากลุ่ม Frozen ให้สอดคล้องกับแผนการผลิตสินค้าประจำเดือน'
        }
        ]);
        // return this._httpClient.get<ResultMapper>(getBaseUrl('/v1/AnnualReport')).pipe(map(data => data.model));
    }
}
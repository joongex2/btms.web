import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getBaseUrl } from "app/shared/helpers/get-base-url";
import { Cause, DocumentParams } from "app/shared/interfaces/document.interface";
import { ResultMapper } from "app/shared/interfaces/result-mapper.interface";
import { CookieService } from "app/shared/services/cookie.service";
import { LocalStorageService } from "app/shared/services/local-storage.service";
import { BehaviorSubject, map, Observable } from "rxjs";
import { PlanStatus, TargetSaveData } from "./target-result.interface";
import { Attachment, LastComment } from "./target-result.types";

@Injectable({
    providedIn: 'root'
})
export class TargetResultService {
    private planMonthToggleChange = new BehaviorSubject<boolean>(false);
    planMonthToggleChange$ = this.planMonthToggleChange.asObservable();

    lastComments: LastComment[] = [
        {
            comment: '',
            from: 'Phutsadee Yoksantea',
            date: '07/06/2019'
        },
        {
            comment: '',
            from: 'Pummarin tangsittisilp',
            date: '07/06/2019'
        },
        {
            comment: '',
            from: 'Sucheera Sukkasem',
            date: '07/06/2019'
        },
        {
            comment: '',
            from: 'Jate Hongsa',
            date: '07/06/2019'
        },
        {
            comment: '',
            from: 'Jate Hongsa',
            date: '07/06/2019'
        },
        {
            comment: '',
            from: 'Jate Hongsa',
            date: '07/06/2019'
        }
    ];

    saveResultFileUploads: Partial<Attachment>[] = [
        {
            originalFilename: 'save-result-1.xlsx',
            createdBy: '',
            createdDate: ''
        }
    ];

    causeAndFixFileUploads: Partial<Attachment>[] = [
        {
            originalFilename: 'cause-and-fix-1.xlsx',
            createdBy: '',
            createdDate: ''
        }
    ];

    constructor(
        private storage: LocalStorageService,
        private _cookieService: CookieService,
        private _httpClient: HttpClient,

    ) { }

    getLastComments() {
        return this.lastComments;
    }

    getSaveResultFileUploads() {
        return this.saveResultFileUploads;
    }

    getCauseAndFixFileUploads() {
        return this.causeAndFixFileUploads;
    }

    get targetSaveData(): TargetSaveData {
        return JSON.parse(this.storage.getItem('targetSaveData'));
    }

    set targetSaveData(targetSaveData: TargetSaveData) {
        this.storage.addItem('targetSaveData', JSON.stringify(targetSaveData));
    }

    clear() {
        this.storage.deleteItem('targetSaveData');
        this._cookieService.deleteCookie('planStatuses');
    }

    get PlanStatuses(): PlanStatus[] {
        const cookie = this._cookieService.getCookie('planStatuses');
        return cookie ? JSON.parse(cookie) : undefined;
    }

    set PlanStatuses(planStatus: PlanStatus[]) {
        this._cookieService.setCookie('planStatuses', JSON.stringify(planStatus), 1);
    }

    planMonthToggle() {
        this.planMonthToggleChange.next(true);
    }

    // actual
    postActual(
        targetDetailPlanId: number,
        targetYear: number,
        targetMonth: number,
        targetActualValue: number,
        targetActualResult: string,
        remarks: string,
        attachments: Attachment[]
    ) {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Targets/actuals'), {
            targetDetailPlanId,
            targetYear,
            targetMonth,
            targetActualValue,
            targetActualResult,
            remarks,
            attachments
        })
    }

    getActual(planId: number, month: number) {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Targets/actuals/${planId}/month/${month}`)).pipe(map(data => data.model));
    }

    getActualSubmitEmail(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Targets/actuals/${id}/submit`)).pipe(map(data => data.model));
    }

    getActualRejectEmail(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/Targets/actuals/${id}/reject`)).pipe(map(data => data.model));
    }

    patchActualSubmitEmail(targetActualIds: number[], comment: string, informEmails: string[], receiveEmails: string[]): Observable<any> {
        return this._httpClient.patch(getBaseUrl(`/v1/Targets/actuals/submit`), {
            targetActualIds,
            comment,
            informEmails,
            receiveEmails
        });
    }

    patchActualRejectEmail(targetActualIds: number[], comment: string, informEmails: string[], receiveEmails: string[]): Observable<any> {
        return this._httpClient.patch(getBaseUrl(`/v1/Targets/actuals/reject`), {
            targetActualIds,
            comment,
            informEmails,
            receiveEmails
        });
    }

    // references
    getReferences(
        page?: number,
        size?: number,
        sort?: string,
        order?: string,
        params?: DocumentParams
    ): Observable<any> {
        const _page = page ? `page=${page}` : '';
        const _size = size ? `size=${size}` : '';
        // sort
        let tempSort: string;
        if (sort && order) {
            tempSort = sort;
            if (order && order === 'desc') {
                tempSort = '-' + sort;
            }
        }
        const _sort = tempSort ? `sort=${tempSort}` : '';
        // query params
        const queryParams = [_page, _size, _sort].filter((q) => q != '');
        if (params) {
            for (let [key, value] of Object.entries(params)) {
                if (value) queryParams.push(`${key}=${value}`);
            };
        }
        let queryString = queryParams.filter((q) => q != '').join('&');
        if (queryString) queryString = `?${queryString}`;
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/References/documents${queryString}`));
    }

    getReference(id: number): Observable<any> {
        return this._httpClient.get<ResultMapper>(getBaseUrl(`/v1/References/${id}`)).pipe(map(data => data.model));
    }

    postReference(
        id: number,
        targetDetailPlanId: number,
        targetMonth: number,
        causes: Cause[],
        attachments: Attachment[],
        result: string,
        resultValue: number,
        resultApprovedDate: any
    ) {
        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/References'), {
            id,
            targetDetailPlanId,
            targetMonth,
            causes,
            attachments,
            result,
            resultValue,
            resultApprovedDate
        })
    }
}
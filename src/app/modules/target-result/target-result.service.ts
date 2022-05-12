import { Injectable } from "@angular/core";
import { CookieService } from "app/shared/services/cookie.service";
import { LocalStorageService } from "app/shared/services/local-storage.service";
import { PlanStatus, TargetSaveData } from "./target-result.interface";
import { FileUpload, LastComment } from "./target-result.types";

@Injectable({
    providedIn: 'root'
})
export class TargetResultService {
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

    saveResultFileUploads: FileUpload[] = [
        {
            fileName: 'save-result-1.xlsx',
            uploader: '',
            date: ''
        }
    ];

    causeAndFixFileUploads: FileUpload[] = [
        {
            fileName: 'cause-and-fix-1.xlsx',
            uploader: '',
            date: ''
        }
    ];

    constructor(
        private storage: LocalStorageService,
        private _cookieService: CookieService
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
    }

    get PlanStatuses(): PlanStatus[] {
        const cookie = this._cookieService.getCookie('planStatuses');
        return cookie ? JSON.parse(cookie): undefined;
    }

    set PlanStatuses(planStatus: PlanStatus[]) {
        this._cookieService.setCookie('planStatuses', JSON.stringify(planStatus), 1);
    }
}
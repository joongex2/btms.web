import { Injectable } from "@angular/core";
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

    constructor(){}

    getLastComments() {
        return this.lastComments;
    }
    
    getSaveResultFileUploads() {
        return this.saveResultFileUploads;
    }

    getCauseAndFixFileUploads() {
        return this.causeAndFixFileUploads;
    }
}
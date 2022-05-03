import { Injectable } from "@angular/core";
import { LocalStorageService } from "app/shared/services/local-storage.service";
import { NewTargetStatus } from "./new-target.interface";

@Injectable({
    providedIn: 'root'
})
export class NewTargetService {
    constructor(private storage: LocalStorageService) { }

    get documentId(): string {
        const documentId = this.storage.getItem('documentId');
        return documentId ? documentId : '';
    }

    set documentId(documentId: string) {
        this.storage.addItem('documentId', documentId);
    }

    get newTargetStatus(): NewTargetStatus {
        const newTargetStatus = this.storage.getItem('newTargetStatus');
        return newTargetStatus ? newTargetStatus as NewTargetStatus : undefined;
    }

    set newTargetStatus(newTargetStatus: NewTargetStatus) {
        this.storage.addItem('newTargetStatus', newTargetStatus);
    }

    clear() {
        this.storage.deleteItem('documentId');
        this.storage.deleteItem('newTargetStatus');
    }
}
import { Injectable } from "@angular/core";
import { LocalStorageService } from "app/shared/services/local-storage.service";
import { TargetManagementStatus } from "./target-management.interface";

@Injectable({
    providedIn: 'root'
})
export class TargetManagementService {
    constructor(private storage: LocalStorageService) { }

    get documentId(): string {
        const documentId = this.storage.getItem('documentId');
        return documentId ? documentId : '';
    }

    set documentId(documentId: string) {
        this.storage.addItem('documentId', documentId);
    }

    get targetManagementStatus(): TargetManagementStatus {
        const targetManagementStatus = this.storage.getItem('targetManagementStatus');
        return targetManagementStatus ? targetManagementStatus as TargetManagementStatus : undefined;
    }

    set targetManagementStatus(targetManagementStatus: TargetManagementStatus) {
        this.storage.addItem('targetManagementStatus', targetManagementStatus);
    }

    clear() {
        this.storage.deleteItem('documentId');
        this.storage.deleteItem('targetManagementStatus');
    }
}
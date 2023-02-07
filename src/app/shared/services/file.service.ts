import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { getBaseUrl } from "../helpers/get-base-url";

@Injectable({
    providedIn: 'root'
})
export class FileService {
    constructor(private _httpClient: HttpClient) { }

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this._httpClient.post(getBaseUrl(`/v1/Files/attachments`), formData,
            {
                reportProgress: true,
                observe: 'events'
            });
    }

    deleteFile(fileName: string): Observable<any> {
        return this._httpClient.delete(getBaseUrl(`/v1/Files/attachments/${fileName}`),
            {
                reportProgress: true,
                observe: 'events'
            });
    }
}
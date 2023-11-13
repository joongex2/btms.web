import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
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

    deleteFileNormal(fileName: string): Observable<any> {
        return this._httpClient.delete(getBaseUrl(`/v1/Files/attachments/${fileName}`));
    }

    loadFile(filename: string): Observable<Blob> {
        const mimeTypes = {
            '.aac': 'audio/aac',
            '.abw': 'application/x-abiword',
            '.arc': 'application/x-freearc',
            '.avi': 'video/x-msvideo',
            '.azw': 'application/vnd.amazon.ebook',
            '.bin': 'application/octet-stream',
            '.bmp': 'image/bmp',
            '.bz': 'application/x-bzip',
            '.bz2': 'application/x-bzip2',
            '.csh': 'application/x-csh',
            '.css': 'text/css',
            '.csv': 'text/csv',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.eot': 'application/vnd.ms-fontobject',
            '.epub': 'application/epub+zip',
            '.gz': 'application/gzip',
            '.gif': 'image/gif',
            '.htm': 'text/html',
            '.html': 'text/html',
            '.ico': 'image/vnd.microsoft.icon',
            '.ics': 'text/calendar',
            '.jar': 'application/java-archive',
            '.jpeg': '.jpg',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.jsonld': 'application/ld+json',
            '.mid': '.midi',
            '.mjs': 'text/javascript',
            '.mp3': 'audio/mpeg',
            '.mpeg': 'video/mpeg',
            '.mpkg': 'application/vnd.apple.installer+xml',
            '.odp': 'application/vnd.oasis.opendocument.presentation',
            '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
            '.odt': 'application/vnd.oasis.opendocument.text',
            '.oga': 'audio/ogg',
            '.ogv': 'video/ogg',
            '.ogx': 'application/ogg',
            '.opus': 'audio/opus',
            '.otf': 'font/otf',
            '.png': 'image/png',
            '.pdf': 'application/pdf',
            '.php': 'application/php',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.pptx':
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.rar': 'application/vnd.rar',
            '.rtf': 'application/rtf',
            '.sh': 'application/x-sh',
            '.svg': 'image/svg+xml',
            '.swf': 'application/x-shockwave-flash',
            '.tar': 'application/x-tar',
            '.tif': 'image/tiff',
            '.tiff': 'image/tiff',
            '.ts': 'video/mp2t',
            '.ttf': 'font/ttf',
            '.txt': 'text/plain',
            '.vsd': 'application/vnd.visio',
            '.wav': 'audio/wav',
            '.weba': 'audio/webm',
            '.webm': 'video/webm',
            '.webp': 'image/webp',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.xhtml': 'application/xhtml+xml',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.xml': 'XML',
            '.xul': 'application/vnd.mozilla.xul+xml',
            '.zip': 'application/zip',
            '.3gp': 'video/3gpp',
            '.3g2': 'video/3gpp2',
            '.7z': 'application/x-7z-compressed',
        };

        const filenameOnly = filename.split('/').pop();
        // console.log(filenameOnly)

        const fileType = mimeTypes['.' + filename.split('.').pop().toLowerCase()];
        //const ext = filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
        // const fileType = mime.lookup(filename) === false ? "" : mime.lookup(filename).toString();
        const url = getBaseUrl(`/v1/Files/attachments?filename=${filenameOnly}`);
        const options = { responseType: 'blob' as 'json' };

        // console.log(fileType)

        return this._httpClient
       .get<Blob>(url, options)
       .pipe(map(res => new Blob([res], { type: fileType })));
     }

     
}
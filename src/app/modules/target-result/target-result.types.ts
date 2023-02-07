export interface LastComment {
    comment: string;
    from: string;
    date: string;
}

export interface FileUpload {
    name: string;
    size: number;
    mimeType: string;
    path: string;
    url: string;
}

export interface Attachment {
    id: number;
    originalFilename: string;
    fileUrl: string;
    uploader?: string;
    date?: string;
    markForDelete: boolean;
}

export interface Document {
    id: number;
    documentNo: string;
    revisionNo: string;
    modifyNo: string;
    createDate: string;
    issueDate: string;
    documentYear: string;
    documentStatus: string;
    creator: string;
}

export interface DocumentDetail {
    id: number;
    userHolder: string;
    organizeCode: string;
    organize: string;
    businessUnitCode: string;
    businessUnit: string;
    subBusinessUnitCode: string;
    subBusinessUnit: string;
    plantCode: string;
    plant: string;
    divisionCode: string;
    division: string;
    documentType: string;
    documentTypeDescription: string;
    documentNo: string;
    documentStatus: string;
    documentStatusDescription: string;
    documentYear: string;
    documentDate: string;
    dueDate: string;
    revisionNo: string;
    modifyNo: string;
    issuedDate: string;
    effectiveDate: string;
}

export class DocumentParams {
    OrganizeCode?: string;
    BusinessUnitCode?: string;
    SubBusinessUnitCode?: string;
    PlantCode?: string;
    DivisionCode?: string;
    DocumentNo?: string;
    DocumentYear?: string;
    DocumentStatus?: string;
    DocumentType?: string;
}
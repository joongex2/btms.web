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
    targetType: string;
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
    targets: Target[];
}

export interface Target {
    id: number;
    standard: string;
    priority: number;
    targetName: string;
    targetMission: string;
    markForEdit: boolean;
    markForDelete: boolean;
    details: SubTarget[];
}

export interface SubTarget {
    id: number;
    priority: number;
    targetDetailDescription: string;
    targetCondition: string;
    targetIndex: string;
    targetOperator: string;
    targetValue: string;
    targetReferenceValue: string;
    targetUnit: string;
    currentTarget: string;
    startMonth: number;
    startYear: number;
    finishMonth: number;
    finishYear: number;
    measureType: string;
    isCritical: boolean;
    markForEdit: boolean;
    markForDelete: boolean;
    topics: Topic[];
    plans: Plan[];
}

export interface Topic {
    id: number;
    priority: number;
    planDescription: string;
    planTargetDate: string;
    resource: string;
    undertaker: string;
    markForEdit: boolean;
    markForDelete: boolean;
}

export interface Plan {
    id: number;
    priority: number;
    planDescription: string;
    planYear: number;
    useMonth1: boolean;
    useMonth2: boolean;
    useMonth3: boolean;
    useMonth4: boolean;
    useMonth5: boolean;
    useMonth6: boolean;
    useMonth7: boolean;
    useMonth8: boolean;
    useMonth9: boolean;
    useMonth10: boolean;
    useMonth11: boolean;
    useMonth12: boolean;
    valueMonth1: number;
    valueMonth2: number;
    valueMonth3: number;
    valueMonth4: number;
    valueMonth5: number;
    valueMonth6: number;
    valueMonth7: number;
    valueMonth8: number;
    valueMonth9: number;
    valueMonth10: number;
    valueMonth11: number;
    valueMonth12: number;
    undertaker: string;
    markForEdit: boolean;
    markForDelete: boolean;
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
    TargetType?: string;
}
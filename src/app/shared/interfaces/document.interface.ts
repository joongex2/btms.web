import { PlanFlow, TARGET_SOLUTION_TYPE } from "app/modules/target-result/target-result.interface";
import { Attachment } from "app/modules/target-result/target-result.types";

export interface Document {
    id: number;
    organizeCode: string;
    documentNo: string;
    revisionNo: string;
    modifyNo: string;
    createDate: string;
    issueDate: string;
    documentYear: string;
    documentStatus: string;
    creator: string;

    // mock for a document-report page
    jan?: DocReport;
    feb?: DocReport;
    mar?: DocReport;
    apr?: DocReport;
    may?: DocReport;
    jun?: DocReport;
    jul?: DocReport;
    aug?: DocReport;
    sep?: DocReport;
    oct?: DocReport;
    nov?: DocReport;
    dec?: DocReport;
}

export interface DocReport {
    useReport: any;
    actualValue: any;
    actualResult: any;
    actualStatus: any;
    sOVNo: any;
    cause: any;
    corrective: any;
    correctiveDueDate: any;
    actualCorrective: any;
    correctiveActualDate: any;
    preventive: any;
    preventiveDueDate: any;
    actualPreventive: any;
    preventiveActualDate: any;
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
    // targetType: string;
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
    targets: Target[];
    comments: Comment[];
}

export interface Comment {
    id: number;
    documentId: number;
    comment: string;
    commentBy: string;
    documentStatus: string;
    commentDate: string;
}

export interface Target {
    id: number;
    targetType: string;
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
    targetValue: string;
    conditions: Condition[];
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

export interface Condition {
    id: number;
    targetDetailId: number;
    targetCondition: string;
    targetOperator: string;
    targetValue: number;
    resultColor: string;
    isActive: boolean;
    markForEdit: boolean;
    markForDelete: boolean;
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

    // use for target-result flow
    flowMonth1?: PlanFlow;
    flowMonth2?: PlanFlow;
    flowMonth3?: PlanFlow;
    flowMonth4?: PlanFlow;
    flowMonth5?: PlanFlow;
    flowMonth6?: PlanFlow;
    flowMonth7?: PlanFlow;
    flowMonth8?: PlanFlow;
    flowMonth9?: PlanFlow;
    flowMonth10?: PlanFlow;
    flowMonth11?: PlanFlow;
    flowMonth12?: PlanFlow;

    actuals?: Actual[];
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
    ToDocumentYear?: string;
    SearchText?: string;
    IsCritical?: string;
    // save-cause-track
    ReportStatus?: string;
    CauseTrackStatus?: string;
    TargetResult?: string;
    CauseTrackResult?: string;
    FromMonth?: string;
    ToMonth?: string;
}

export interface ConfirmationInfo {
    title: string;
    from: string;
    dueDate: string;
    emails: InformEmail[] | ReceiveEmail[];
}

export interface InformEmail {
    type: string;
    name: string;
    email: string;
    selected: boolean;
}

export interface ReceiveEmail {
    type: string;
    role: string;
    name: string;
    email: string;
    selected: boolean;
}

export interface Actual {
    comments: Comment[];
    createdBy: string;
    createdDate: string;
    dueDate: string;
    id: number;
    targetActualResult: string // e.g. A, U, N
    isNotified: boolean;
    remarks: string;
    targetActualStatus: string; // e.g. TARGET REPORTING
    targetActualStatusName: string;
    targetActualValue: number;
    targetDetailPlanId: number;
    targetMonth: number;
    targetYear: number;
    attachments: Attachment[];
    targetReferenceId: number;
    targetReferenceRunningNo: string;
}

export interface Reference {
    id: number;
    organizeCode: string;
    businessUnitCode: string;
    subBusinessUnitCode: string;
    plantCode: string;
    divisionCode: string;
    documentType: string;
    documentNo: string;
    runningNo: string;
    createdDate: string;
    targetMonth: number;
    documentYear: number;
    targetReferenceStatus: string;
    createdBy: string;
}
export interface ReferenceDetail {
    targetReference: TargetReference;
    attachments: Attachment[];
}

export interface TargetReference {
    id: number;
    runningNo: string;
    targetDetailPlanId: number;
    targetMonth: number;
    targetReferenceStatus: string;
    targetReferenceStatusName: string;
    createdDate: string;
    createdBy: string;
    resultApprovedDate: string;
    resultValue: string;
    result: string;
    resultReportor: string;
    causes: Cause[];
    markForEdit?: boolean;
    markForDelete?: boolean;
}

export interface Cause {
    id: number;
    targetReferenceId?: number;
    sequenceNo: number;
    causeTopic: string;
    causeStatus: string;
    causeDescription: string;
    createdDate?: string;
    createdBy?: string;
    solutions: Solution[];
    markForEdit?: boolean;
    markForDelete?: boolean;
}

export interface Solution {
    id: number;
    targetCauseId: number;
    targetSolutionType: TARGET_SOLUTION_TYPE;
    sequenceNo: number;
    solutionTopic: string;
    userResponsibility: string;
    finishDate: string;
    solutionDescription: string;
    actionDate: string;
    createdDate?: string;
    createdBy?: string;
    markForEdit?: boolean;
    markForDelete?: boolean;
}
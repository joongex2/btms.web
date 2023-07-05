import { Target } from "app/shared/interfaces/document.interface";

export interface TargetTemplate {
    id: number;
    documentName: string;
    documentType: string;
    documentYear: number;
    targets: Target[];
    deployLogs: DeployLog[];
}

export interface DeployLog {
    id: number;
    templateId: number;
    description: string;
    deployDate: string;
    deployBy: string;
}
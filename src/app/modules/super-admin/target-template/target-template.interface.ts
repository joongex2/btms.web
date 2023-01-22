import { Target } from "app/shared/interfaces/document.interface";

export interface TargetTemplate {
    id: number;
    documentName: string;
    documentType: string;
    documentYear: number;
    targets: Target[];
}
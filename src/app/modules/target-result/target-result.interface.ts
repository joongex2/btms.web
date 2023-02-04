export interface  TargetSaveData {
    documentId: number;
    targetId: number;
    subTargetId: number;
    planId: number;
    month: string;
}

export interface PlanStatus {
    documentId: number;
    targetId: number;
    subTargetId: number;
    planId: number;
    month: number;
    flow: PlanFlow;
}

export enum PlanFlow {
    READY = 'ready',
    VISITED = 'visited',
    ACCEPT = 'accept',
    REJECT = 'reject'
}
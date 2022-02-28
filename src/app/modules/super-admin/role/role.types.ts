export interface Role {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
    workflowStatuses: any;
}
export interface UserGroup {
    groupCode: string;
    groupDescription: string;
    sequence: string;
    status: GroupStatus;
}

export enum GroupStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired'
}
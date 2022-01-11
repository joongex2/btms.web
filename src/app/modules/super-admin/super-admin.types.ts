export interface UserGroup {
    groupCode: string;
    groupDescription: string;
    sequence: string;
    status: GroupStatus;
}

export interface User {
    userLogin: string;
    password: string;
    userName: string;
    email: string;
    group: string;
    status: UserStatus;
}

export interface Role {
    roleCode: string;
    roleDescription: string;
    sequence: string;
    status: RoleStatus;
}

export enum GroupStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired'
}

export enum UserStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired'
}

export enum RoleStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired'
}
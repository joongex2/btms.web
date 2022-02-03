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
    documentPermissions?: DocumentPermission[];
}

export interface Menu {
    menuId: string;
    menuTitle: string;
    menuDescription: string;
    parentId: string;
    menuUrl: string;
    pageId: string;
    menuSequence: string;
    status: MenuStatus;
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

export enum RoleCode {
    D00 = 'D00',
    D01 = 'D01',
    D02 = 'D02',
    D03 = 'D03',
    D04 = 'D04',
    T01 = 'T01',
    T02 = 'T02',
    T03 = 'T03',
    T04 = 'T04'
}

export enum DocumentPermission {
    // DOCUMENT_CANCEL = 'DC',
    // DOCUMENT_DRAFT = 'DD',
    // DOCUMENT_ISSUED = 'DI',
    // DOCUMENT_MODIFY = 'DM',
    // DOCUMENT_REVISE = 'DR',
    // DOCUMENT_WAIT_FOR_APPROVE = 'DWFA',
    // DOCUMENT_WAIT_FOR_ISSUE = 'DWFI',
    // DOCUMENT_WAIT_FOR_PRINT = 'DWFP',
    // DOCUMENT_WAIT_FOR_VERIFY = 'DWFV',
    // SOLVE_CLOSED = 'SC',
    // SOLVE_CLOSED_NEW = 'SCN',
    // SOLVE_DRAFT = 'SD'
    DOCUMENT_CANCEL = 'DOCUMENT_CANCEL',
    DOCUMENT_DRAFT = 'DOCUMENT_DRAFT',
    DOCUMENT_ISSUED = 'DOCUMENT_ISSUED',
    DOCUMENT_MODIFY = 'DOCUMENT_MODIFY',
    DOCUMENT_REVISE = 'DOCUMENT_REVISE',
    DOCUMENT_WAIT_FOR_APPROVE = 'DOCUMENT_WAIT_FOR_APPROVE',
    DOCUMENT_WAIT_FOR_ISSUE = 'DOCUMENT_WAIT_FOR_ISSUE',
    DOCUMENT_WAIT_FOR_PRINT = 'DOCUMENT_WAIT_FOR_PRINT',
    DOCUMENT_WAIT_FOR_VERIFY = 'DOCUMENT_WAIT_FOR_VERIFY',
    SOLVE_CLOSED = 'SOLVE_CLOSED',
    SOLVE_CLOSED_NEW = 'SOLVE_CLOSED_NEW',
    SOLVE_DRAFT = 'SOLVE_DRAFT'
}

export enum MenuStatus {
    ACTIVE = 'active',
    INACTIVE = 'inActive'
}
import { Role } from "../super-admin/super-admin.types";

export interface Organization {
    organizationCode: string;
    organizationDescription: string;
    bu: Bu;
    subBu: SubBu;
    plant: Plant;
    division: Division;
    department: Department;
    status: Status;
    userRoles: UserRole[];
}

export interface Bu {
    buCode: string;
    buDescription: string;
    status: Status;
}

export interface SubBu {
    subBuCode: string;
    subBuDescription: string;
    status: Status;
}

export interface Plant {
    plantCode: string;
    plantDescription: string;
    status: Status;
}

export interface Department {
    departmentCode: string;
    departmentDescription: string;
    status: Status;
}

export interface Division {
    divisionCode: string;
    divisionDescription: string;
    status: Status;
}

export interface User {
    userLogin: string;
    password: string;
    userName: string;
    email: string;
    group: string;
    status: Status;
}

export interface UserRole {
    user: User;
    role: Role;
    status: Status;
}

export interface DocumentControl {
    organizationCode: string;
    documentType: string;
    prefix: string;
    suffix: string;
    lengthOfRunning: string;
    lastRunning: string;
    lastDocument: string;
    status: Status;
}

export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}
export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    menus: any;
    groupId: number;
    groupName: string;
    organizes: Organize[];
    avatar?: string;
    status?: string;
}

export interface Organize {
    organizeCode: string;
    organizeName: string;
    businessUnitCode: string;
    businessUnit: string;
    subBusinessUnitCode: string;
    subBusinessUnit: string;
    plantCode: string;
    plant: string;
    divisionCode: string;
    division: string;
    roles: Role[];
    canCreate?: boolean;
}

interface Role {
    roleId: number;
    roleCode: string;
}
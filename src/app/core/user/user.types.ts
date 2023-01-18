export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    status?: string;
    menus: any;
    organizes: Organize[];
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
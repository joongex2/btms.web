export interface OrganizeNode {
    organizeCode: string;
    isActive: boolean;
    roles: RoleNode[];
    expand: boolean;
}

export interface RoleNode {
    roleCode: string;
    isActive: boolean;
}
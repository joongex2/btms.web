export interface User {
    id: number;
    groupId: number;
    name: string;
    username: string;
    email: string;
    isActive: boolean;
    menu: string;
    organizes: any[];
}
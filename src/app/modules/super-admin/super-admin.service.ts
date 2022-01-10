import { Injectable } from "@angular/core";
import { GroupStatus, UserGroup } from "./super-admin.types";

@Injectable({
    providedIn: 'root'
})
export class SuperAdminService {
    groups: UserGroup[] = [
        {
            groupCode: '00',
            groupDescription: 'Administrator',
            sequence: '1',
            status: GroupStatus.ACTIVE
        },
        {
            groupCode: '01',
            groupDescription: 'Creator',
            sequence: '2',
            status: GroupStatus.ACTIVE
        },
        {
            groupCode: '02',
            groupDescription: 'Approver',
            sequence: '3',
            status: GroupStatus.ACTIVE
        },
        {
            groupCode: '03',
            groupDescription: 'Document Control',
            sequence: '4',
            status: GroupStatus.ACTIVE
        },
        {
            groupCode: '04',
            groupDescription: 'Verify Manager (plant manager up)',
            sequence: '5',
            status: GroupStatus.ACTIVE
        },
        {
            groupCode: '05',
            groupDescription: 'QS',
            sequence: '6',
            status: GroupStatus.ACTIVE
        },
        {
            groupCode: '06',
            groupDescription: 'General',
            sequence: '7',
            status: GroupStatus.ACTIVE
        },
        {
            groupCode: '07',
            groupDescription: 'Reporter',
            sequence: '8',
            status: GroupStatus.ACTIVE
        },
        {
            groupCode: '08',
            groupDescription: 'Supervisor',
            sequence: '9',
            status: GroupStatus.ACTIVE
        }
    ];

    constructor() {}

    getGroups(): UserGroup[] {
        return this.groups
    }
}
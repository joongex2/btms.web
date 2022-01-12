import { Injectable } from "@angular/core";
import { DocumentPermission, GroupStatus, Role, RoleCode, RoleStatus, User, UserGroup, UserStatus } from "./super-admin.types";

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

    users: User[] = [
        {
            userLogin: 'abs_account',
            password: '',
            userName: 'ABS_ACCOUNT',
            email: 'abs_account@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_dcc',
            password: '',
            userName: 'ABS_DCC',
            email: 'abs_dcc@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_engineer',
            password: '',
            userName: 'ABS_ENGINEER',
            email: 'abs_engineer@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_ga',
            password: '',
            userName: 'ABS_GA',
            email: 'abs_ga@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_lab',
            password: '',
            userName: 'ABS_LAB',
            email: 'abs_lab@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_mk',
            password: '',
            userName: 'ABS_MK',
            email: 'abs_mk@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_payroll',
            password: '',
            userName: 'ABS_Payroll',
            email: 'abs_payroll@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_pc',
            password: '',
            userName: 'ABS_PC',
            email: 'abs_pc@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_pd',
            password: '',
            userName: 'ABS_PD',
            email: 'abs_pd@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_personal',
            password: '',
            userName: 'ABS_PERSONAL',
            email: 'abs_personal@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_ppcd',
            password: '',
            userName: 'ABS_PPCD',
            email: 'abs_ppcd@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_qa',
            password: '',
            userName: 'ABS_QA',
            email: 'abs_qa@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_rd',
            password: '',
            userName: 'ABS_RD',
            email: 'abs_rd@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_sales',
            password: '',
            userName: 'ABS_Sales',
            email: 'ABS_Sales@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_sn',
            password: '',
            userName: 'ABS_SN',
            email: 'ABS_SN@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_training',
            password: '',
            userName: 'ABS_Training',
            email: 'ABS_Training@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abs_wh',
            password: '',
            userName: 'ABS_WH',
            email: 'abs_wh@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'abssafety',
            password: '',
            userName: 'ABS Safety',
            email: 'abssafety@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        },
        {
            userLogin: 'access_wh_btf',
            password: '',
            userName: 'Access_WH_BTF',
            email: 'abs_wh_btf@betagro.com',
            group: '06',
            status: UserStatus.ACTIVE
        }
    ];

    roles: Role[] = [
        {
            roleCode: 'D00',
            roleDescription: 'บุคคลทั่วไป',
            sequence: '0',
            status: RoleStatus.ACTIVE
        },
        {
            roleCode: 'D01',
            roleDescription: 'ผู้สร้างเป้าหมาย',
            sequence: '1',
            status: RoleStatus.ACTIVE
        },
        {
            roleCode: 'D02',
            roleDescription: 'ผู้ตรวจสอบเป้าหมาย',
            sequence: '2',
            status: RoleStatus.ACTIVE
        },
        {
            roleCode: 'D03',
            roleDescription: 'ผู้อนุมัติเป้าหมาย',
            sequence: '3',
            status: RoleStatus.ACTIVE
        },
        {
            roleCode: 'D04',
            roleDescription: 'ผู้ประกาศใช้เป้าหมาย',
            sequence: '4',
            status: RoleStatus.ACTIVE
        },
        {
            roleCode: 'S03',
            roleDescription: 'ผู้อนุมัติผลการติดตามการแก้ไขสาเหตุ',
            sequence: '9',
            status: RoleStatus.ACTIVE
        },
        {
            roleCode: 'T01',
            roleDescription: 'ผู้บันทึกผลการดำเนินงาน',
            sequence: '5',
            status: RoleStatus.ACTIVE
        },
        {
            roleCode: 'T02',
            roleDescription: 'ผู้ตรวจสอบผลการดำเนินงาน',
            sequence: '6',
            status: RoleStatus.ACTIVE
        },
        {
            roleCode: 'T03',
            roleDescription: 'ผู้อนุมัติผลการดำเนินงาน',
            sequence: '7',
            status: RoleStatus.ACTIVE
        },
        {
            roleCode: 'T04',
            roleDescription: 'ผู้ทบทวนผลการดำเนินงาน (QS)',
            sequence: '8',
            status: RoleStatus.ACTIVE
        }
    ];

    roleDocumentPermMap = {
        [RoleCode.D00]: [
            DocumentPermission.SOLVE_CLOSED,
            DocumentPermission.SOLVE_CLOSED_NEW
        ],
        [RoleCode.D01]: [
            DocumentPermission.DOCUMENT_CANCEL,
            DocumentPermission.DOCUMENT_DRAFT,
            DocumentPermission.DOCUMENT_ISSUED,
            DocumentPermission.DOCUMENT_MODIFY,
            DocumentPermission.DOCUMENT_REVISE
        ],
        [RoleCode.D02]: [
            DocumentPermission.DOCUMENT_WAIT_FOR_VERIFY
        ],
        [RoleCode.D03]: [
            DocumentPermission.DOCUMENT_WAIT_FOR_APPROVE
        ],
        [RoleCode.D04]: [
            DocumentPermission.DOCUMENT_WAIT_FOR_ISSUE
        ],
        [RoleCode.T01]: [
            DocumentPermission.SOLVE_CLOSED,
            DocumentPermission.SOLVE_CLOSED_NEW,
            DocumentPermission.SOLVE_DRAFT
        ],
        [RoleCode.T02]: [
            DocumentPermission.SOLVE_CLOSED,
            DocumentPermission.SOLVE_CLOSED_NEW
        ],
        [RoleCode.T03]: [
            DocumentPermission.SOLVE_CLOSED,
            DocumentPermission.SOLVE_CLOSED_NEW
        ],
        [RoleCode.T04]: [
            DocumentPermission.SOLVE_CLOSED,
            DocumentPermission.SOLVE_CLOSED_NEW
        ]
    };
 
    constructor() { }

    getGroups(): UserGroup[] {
        return this.groups
    }

    getUsers(): User[] {
        return this.users;
    }

    getRoles(): Role[] {
        return this.roles;
    }

    getRole(roleCode: string): Role {
        return this.roles.find((role) => role.roleCode === roleCode);
    }

    getRoleDocumentPermMap(roleCode: string): DocumentPermission[] {
        return this.roleDocumentPermMap[roleCode];
    }
}
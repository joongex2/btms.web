import { Injectable } from "@angular/core";
import { Status } from "../admin/admin.types";
import { DocumentPermission, GroupMenu, GroupStatus, Menu, MenuStatus, Role, RoleCode, RoleStatus } from "./super-admin.types";

@Injectable({
    providedIn: 'root'
})
export class SuperAdminService {
    groups: any[] = [
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

    documentPermissionTypes = [
        DocumentPermission.DOCUMENT_CANCEL,
        DocumentPermission.DOCUMENT_DRAFT,
        DocumentPermission.DOCUMENT_ISSUED,
        DocumentPermission.DOCUMENT_MODIFY,
        DocumentPermission.DOCUMENT_REVISE,
        DocumentPermission.DOCUMENT_WAIT_FOR_VERIFY,
        DocumentPermission.DOCUMENT_WAIT_FOR_APPROVE,
        DocumentPermission.DOCUMENT_WAIT_FOR_ISSUE,
        DocumentPermission.SOLVE_CLOSED,
        DocumentPermission.SOLVE_CLOSED_NEW,
        DocumentPermission.SOLVE_DRAFT
    ];

    menus: Menu[] = [
        {
            menuId: '30',
            menuTitle: 'ข้อมูลเป้าหมาย',
            menuDescription: '',
            parentId: '00',
            menuUrl: '',
            pageId: '',
            menuSequence: '1',
            status: MenuStatus.ACTIVE
        },
        {
            menuId: '32',
            menuTitle: 'ข้อมูลเป้าหมายฉบับเดิม',
            menuDescription: '',
            parentId: '30',
            menuUrl: '~/COM007.aspx',
            pageId: '',
            menuSequence: '3',
            status: MenuStatus.ACTIVE
        },
        {
            menuId: '33',
            menuTitle: 'ข้อมูลเป้าหมายของฉัน',
            menuDescription: '',
            parentId: '30',
            menuUrl: '~/COM001.aspx',
            pageId: '',
            menuSequence: '2',
            status: MenuStatus.ACTIVE
        },
        {
            menuId: '34',
            menuTitle: 'สร้างเป้าหมายใหม่',
            menuDescription: '',
            parentId: '30',
            menuUrl: '~/IPC003.aspx',
            pageId: '',
            menuSequence: '4',
            status: MenuStatus.ACTIVE
        },
        {
            menuId: '40',
            menuTitle: 'ผลการดำเนินงานตามเป้าหมาย',
            menuDescription: '',
            parentId: '00',
            menuUrl: '',
            pageId: '',
            menuSequence: '2',
            status: MenuStatus.ACTIVE
        },
        {
            menuId: '41',
            menuTitle: 'บันทึกผลการดำเนินงาน',
            menuDescription: '',
            parentId: '40',
            menuUrl: '~/RPT001.aspx',
            pageId: '',
            menuSequence: '1',
            status: MenuStatus.ACTIVE
        },
        {
            menuId: '42',
            menuTitle: 'สาเหตุและการแก้ไขสิ่งที่ไม่เป็นไปตามเป้าหมาย',
            menuDescription: '',
            parentId: '40',
            menuUrl: '~/FOW001.aspx',
            pageId: '',
            menuSequence: '2',
            status: MenuStatus.ACTIVE
        }
    ];

    groupMenus: GroupMenu[] = [
        {
            group: {
                groupCode: '00',
                groupDescription: 'Administrator',
                sequence: '1',
                status: GroupStatus.ACTIVE
            },
            menu: {
                menuId: '30',
                menuTitle: 'ข้อมูลเป้าหมาย',
                menuDescription: '',
                parentId: '00',
                menuUrl: '',
                pageId: '',
                menuSequence: '1',
                status: MenuStatus.ACTIVE
            },
            status: Status.ACTIVE
        }
    ];

    constructor() { }

    getGroups(): any[] {
        return this.groups
    }

    getRoles(): Role[] {
        return this.roles;
    }

    getRole(roleCode: string): Role {
        return this.roles.find((role) => role.roleCode === roleCode);
    }

    getRoleDocumentPermMap(roleCode: string): DocumentPermission[] {
        // return this.roleDocumentPermMap[roleCode];
        return this.documentPermissionTypes;
    }

    getMenus(): Menu[] {
        return this.menus;
    }

    getGroupMenus(): GroupMenu[] {
        return this.groupMenus;
    }
}
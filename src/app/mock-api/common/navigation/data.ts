/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboard',
        type    : 'collapsable',
        icon    : 'heroicons_outline:clipboard-check',
        children: [
            {
                id   : 'dashboards.dashboard1',
                title: 'Dashboard',
                type : 'basic',
                link : '/dashboards/dashboard1'
            }
        ]
    }, {
        id      : 'target-info',
        title   : 'ข้อมูลเป้าหมาย',
        type    : 'collapsable',
        icon    : 'heroicons_outline:information-circle',
        children: [
            {
                id   : 'target-info.my-target',
                title: 'ข้อมูลเป้าหมายของฉัน',
                type : 'basic',
                link : '/target-info/my-target'
            },
            {
                id   : 'target-info.old-target',
                title: 'ข้อมูลเป้าหมายฉบับเดิม',
                type : 'basic',
                link : '/target-info/old-target'
            },
            {
                id   : 'target-info.new-target',
                title: 'สร้างเป้าหมายใหม่',
                type : 'basic',
                link : '/target-info/new-target'
            }
        ]
    }, {
        id      : 'target-result',
        title   : 'ผลการดำเนินการตามเป้าหมาย',
        type    : 'collapsable',
        icon    : 'heroicons_outline:presentation-chart-bar',
        children: [
            {
                id   : 'target-result.target-entry',
                title: 'บันทึกผลการดำเนินงาน',
                type : 'basic',
                link : '/target-result/target-entry'
            },
            {
                id   : 'target-result.cause-edit-target',
                title: 'สาเหตุและการแก้ไขสิ่งที่ไม่เป็นไปตามเป้าหมาย',
                type : 'basic',
                link : '/target-result/cause-edit-target'
            },
            {
                id   : 'target-result.result-info',
                title: 'ข้อมูลผลการดำเนินการ',
                type : 'basic',
                link : '/target-result/result-info'
            }
        ]
    }, {
        id      : 'report',
        title   : 'Report',
        type    : 'collapsable',
        icon    : 'heroicons_outline:document-report',
        children: [
            {
                id   : 'report.standard-form',
                title: 'Standard Form',
                type : 'basic',
                link : '/report/standard-form'
            },
            {
                id   : 'report.annual-report',
                title: 'รายงานผลดำเนินงานประจำปี',
                type : 'basic',
                link : '/report/annual-report'
            },
            {
                id   : 'report.target-track',
                title: 'รายงานติดตามการขึ้นทะเบียนเป้าหมาย',
                type : 'basic',
                link : '/report/target-track'
            },
            {
                id   : 'report.save-cause-track',
                title: 'รายงานติดตามการบันทึกผลและการติดตามปิดสาเหตุ',
                type : 'basic',
                link : '/report/save-cause-track'
            },
        ]
    }, {
        id      : 'admin',
        title   : 'Admin Menu',
        type    : 'collapsable',
        icon    : 'heroicons_outline:user',
        children: [
            {
                id   : 'admin.bu',
                title: 'BU',
                type : 'basic',
                link : '/admin/bu'
            },
            {
                id   : 'admin.sub.bu',
                title: 'Sub-BU',
                type : 'basic',
                link : '/admin/sub-bu'
            },
            {
                id   : 'admin.plant',
                title: 'Plant',
                type : 'basic',
                link : '/admin/plant'
            },
            {
                id   : 'admin.division',
                title: 'Division',
                type : 'basic',
                link : '/admin/division'
            },
            {
                id   : 'admin.department',
                title: 'Department',
                type : 'basic',
                link : '/admin/department'
            },
            {
                id   : 'admin.organization',
                title: 'Organization',
                type : 'basic',
                link : '/admin/organization'
            },
            {
                id   : 'admin.document-control',
                title: 'Document Control',
                type : 'basic',
                link : '/admin/document-control'
            },
            {
                id   : 'admin.user',
                title: 'User',
                type : 'basic',
                link : '/admin/user'
            }
        ]
    }, {
        id      : 'super-admin',
        title   : 'Super Admin Menu',
        type    : 'collapsable',
        icon    : 'heroicons_outline:user',
        children: [
            {
                id   : 'super-admin.group',
                title: 'Group',
                type : 'basic',
                link : '/super-admin/user-group'
            },
            {
                id   : 'super-admin.role',
                title: 'Role',
                type : 'basic',
                link : '/super-admin/role'
            },
            {
                id   : 'super-admin.document-permission',
                title: 'Document Permission',
                type : 'basic',
                link : '/super-admin/document-permission'
            },
            {
                id   : 'super-admin.workflow',
                title: 'Workflow',
                type : 'basic',
                link : '/super-admin/workflow'
            },
            {
                id   : 'super-admin.report-setting',
                title: 'Report Setting',
                type : 'basic',
                link : '/super-admin/report-setting'
            },
            {
                id   : 'super-admin.application-setting',
                title: 'Application Setting',
                type : 'basic',
                link : '/super-admin/application-setting'
            },
            {
                id   : 'super-admin.data-management',
                title: 'Data Management',
                type : 'basic',
                link : '/super-admin/data-management'
            }
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];

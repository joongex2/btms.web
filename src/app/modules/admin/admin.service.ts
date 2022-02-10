import { Injectable } from "@angular/core";
import { RoleStatus } from "../super-admin/super-admin.types";
import { Bu, Department, Division, Organization, Plant, Status, SubBu, User, UserRole } from "./admin.types";

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    organizations: Organization[] = [
        {
            organizationCode: 'BTG-LP1MK',
            organizationDescription: 'OBJ-MKLP1',
            bu: {
                buCode: 'Agro',
                buDescription: 'Agro',
                status: Status.ACTIVE
            },
            subBu: {
                subBuCode: 'Feed',
                subBuDescription: 'Feed',
                status: Status.ACTIVE
            },
            plant: {
                plantCode: 'BTG-LP',
                plantDescription: 'บริษัท เบทาโกร จำกัด มหาชน (โรงงานลำพูน)',
                status: Status.ACTIVE
            },
            division: {
                divisionCode: 'ANTC',
                divisionDescription: 'ศูนย์นวัตกรรมเกษตรอุตสาหกรรม (AIC)',
                status: Status.ACTIVE
            },
            department: {
                departmentCode: 'BL',
                departmentDescription: 'แผนกหม้อไอน้ำ',
                status: Status.ACTIVE
            },
            status: Status.ACTIVE,
            userRoles: [
                {
                    user: { 
                        userLogin: 'abs_account',
                        password: '',
                        userName: 'ABS_ACCOUNT',
                        email: 'abs_account@betagro.com',
                        group: '06',
                        status: Status.ACTIVE
                    },
                    role: {
                            roleCode: 'D00',
                            roleDescription: 'บุคคลทั่วไป',
                            sequence: '0',
                            status: RoleStatus.ACTIVE
                    },
                    status: Status.ACTIVE
                }, 

            ]
        }
    ];

    bus: Bu[] = [
        {
            buCode: 'Agro',
            buDescription: 'Agro',
            status: Status.ACTIVE
        },
        {
            buCode: 'Food',
            buDescription: 'Food',
            status: Status.ACTIVE
        }
    ];

    subBus: SubBu[] = [
        {
            subBuCode: 'Feed',
            subBuDescription: 'Feed',
            status: Status.ACTIVE
        },
        {
            subBuCode: 'AHTB',
            subBuDescription: 'BP',
            status: Status.ACTIVE
        }
    ];

    plants: Plant[] = [
        {
            plantCode: 'BTG-LP',
            plantDescription: 'บริษัท เบทาโกร จำกัด มหาชน (โรงงานลำพูน)',
            status: Status.ACTIVE
        }
    ];

    divisions: Division[] = [
        {
            divisionCode: 'ANTC',
            divisionDescription: 'ศูนย์นวัตกรรมเกษตรอุตสาหกรรม (AIC)',
            status: Status.ACTIVE
        },
        {
            divisionCode: 'FC',
            divisionDescription: 'สำนักการผลิต (FC)',
            status: Status.ACTIVE
        }
    ];

    departments: Department[] = [
        {
            departmentCode: 'BL',
            departmentDescription: 'แผนกหม้อไอน้ำ',
            status: Status.ACTIVE
        },
        {
            departmentCode: 'EC',
            departmentDescription: 'แผนกวิศวกรอนุรักษ์พลังงาน (EC)',
            status: Status.ACTIVE
        }
    ];

    users: User[] = [
        {
            userLogin: 'abs_account',
            password: '',
            userName: 'ABS_ACCOUNT',
            email: 'abs_account@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_dcc',
            password: '',
            userName: 'ABS_DCC',
            email: 'abs_dcc@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_engineer',
            password: '',
            userName: 'ABS_ENGINEER',
            email: 'abs_engineer@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_ga',
            password: '',
            userName: 'ABS_GA',
            email: 'abs_ga@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_lab',
            password: '',
            userName: 'ABS_LAB',
            email: 'abs_lab@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_mk',
            password: '',
            userName: 'ABS_MK',
            email: 'abs_mk@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_payroll',
            password: '',
            userName: 'ABS_Payroll',
            email: 'abs_payroll@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_pc',
            password: '',
            userName: 'ABS_PC',
            email: 'abs_pc@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_pd',
            password: '',
            userName: 'ABS_PD',
            email: 'abs_pd@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_personal',
            password: '',
            userName: 'ABS_PERSONAL',
            email: 'abs_personal@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_ppcd',
            password: '',
            userName: 'ABS_PPCD',
            email: 'abs_ppcd@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_qa',
            password: '',
            userName: 'ABS_QA',
            email: 'abs_qa@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_rd',
            password: '',
            userName: 'ABS_RD',
            email: 'abs_rd@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_sales',
            password: '',
            userName: 'ABS_Sales',
            email: 'ABS_Sales@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_sn',
            password: '',
            userName: 'ABS_SN',
            email: 'ABS_SN@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_training',
            password: '',
            userName: 'ABS_Training',
            email: 'ABS_Training@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abs_wh',
            password: '',
            userName: 'ABS_WH',
            email: 'abs_wh@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'abssafety',
            password: '',
            userName: 'ABS Safety',
            email: 'abssafety@betagro.com',
            group: '06',
            status: Status.ACTIVE
        },
        {
            userLogin: 'access_wh_btf',
            password: '',
            userName: 'Access_WH_BTF',
            email: 'abs_wh_btf@betagro.com',
            group: '06',
            status: Status.ACTIVE
        }
    ];

    constructor() { }

    getOrganizations(): Organization[] {
        return this.organizations;
    }

    getBus(): Bu[] {
        return this.bus;
    }

    getSubBus(): SubBu[] {
        return this.subBus;
    }

    getPlants(): Plant[] {
        return this.plants;
    }

    getDivisions(): Division[] {
        return this.divisions;
    }

    getDepartments(): Department[] {
        return this.departments;
    }

    getUsers(): User[] {
        return this.users;
    }

    getUserRoles(organizationCode: string): UserRole[] {
        const organization = this.organizations.find((org) => org.organizationCode == organizationCode);
        return organization.userRoles;
    }
}
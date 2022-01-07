import { Injectable } from '@angular/core';
import { Method, RunningNo, RunningNoData, SubTarget, SubTargetRecord, TargetRecord } from './target.types';

@Injectable({
    providedIn: 'root'
})
export class TargetService {
    runningNos: RunningNo[] = [
        {
            data: {
                "site": "บริษัท เบทาโกร จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENPC-64-02",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "01/02/2021",
                "issuedDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": {
                    "records": [
                        {
                            "data": {
                                "targetId": "1",
                                "name": "รายงานการกระทำที่เป็นอันตรายและสภาพการที่เป็นอันตรายที่ได้รับขึ้นทะเบียน (unsafe act)",
                                "standard": "ISO 14001/ISO 45001",
                                "relativeTarget": "4"
                            },
                            "kids": {
                                "records": [
                                    {
                                        "data": {
                                            "subTargetId": "1",
                                            "subTargetName": "รายงานการกระทำที่เป็นอันตรายและสภาพการที่เป็นอันตรายที่ได้รับขึ้นทะเบียน (unsafe act)",
                                            "index": "ฉบับ/เดือน",
                                            "value": ">=1",
                                            "unit": "เรื่อง/เดือน",
                                            "currentValue": "1",
                                            "startMonth": "ม.ค.",
                                            "startYear": "2021",
                                            "finishMonth": "ธ.ค.",
                                            "finishYear": "2021"
                                        },
                                        "kids": {
                                            "records": [
                                                {
                                                    "data": {
                                                        ['methodId']: "1",
                                                        ["methodName"]: `1.ศึกษารายงานการกระทำที่เป็นอันตราย / สภาพที่เป็นอันตราย 
                                                    2. ประชุมชี้แจงพนักงานในแผนก 
                                                    3. พนักงานในแผนกดำเนินการค้นหาและบันทึกรายงานการกระทำที่เป็นอันตราย
                                                    4. ตรวจสอบและประเมินจำนวนของบันทึกรายงานการกระทำที่เป็นอันตราย / สภาพที่เป็นอันตราย ในแต่ละเดือน
                                                        `,
                                                        "jan": "1.000",
                                                        "feb": "1.000",
                                                        "mar": "1.000",
                                                        "apr": "1.000",
                                                        "may": "1.000",
                                                        "jun": "1.000",
                                                        "jul": "1.000",
                                                        "aug": "1.000",
                                                        "sep": "1.000",
                                                        "oct": "1.000",
                                                        "nov": "1.000",
                                                        "dec": "1.000",
                                                        "owner": "Department manager Maintenance Process Machine 1 PC"
                                                    },
                                                    "kids": {

                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        },
        {
            data: {
                "site": "บริษัท เบทาโกร2 จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENPC-64-01",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "30/01/2021",
                "issuedDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": {
                    "records": [
                        {
                            "data": {
                                "targetId": "1",
                                "name": "รายงานการกระทำที่เป็นอันตรายและสภาพการที่เป็นอันตรายที่ได้รับขึ้นทะเบียน (unsafe act)",
                                "standard": "ISO 14001/ISO 45001",
                                "relativeTarget": "4"
                            },
                            "kids": {
                                records: []
                            }
                        }
                    ]
                }
            }
        },
        {
            data: {
                "site": "บริษัท เบทาโกร3 จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENLR3-64-02",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "30/01/2021",
                "issuedDate": "09/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": undefined
            }
        },
        {
            data: {
                "site": "บริษัท เบทาโกร4 จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENLR3-64-01",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "30/01/2021",
                "issuedDate": "10/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": undefined
            }
        },
        {
            data: {
                "site": "บริษัท เบทาโกร3 จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENLR3-64-03",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "30/01/2021",
                "issuedDate": "10/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": undefined
            }
        },
        {
            data: {
                "site": "บริษัท เบทาโกร4 จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENLR3-64-04",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "30/01/2021",
                "issuedDate": "10/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": undefined
            }
        },
        {
            data: {
                "site": "บริษัท เบทาโกร5 จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENLR3-64-05",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "30/01/2021",
                "issuedDate": "10/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": undefined
            }
        },
        {
            data: {
                "site": "บริษัท เบทาโกร6 จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENLR3-64-06",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "30/01/2021",
                "issuedDate": "10/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": undefined
            }
        },
        {
            data: {
                "site": "บริษัท เบทาโกร7 จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENLR3-64-07",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "30/01/2021",
                "issuedDate": "10/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": undefined
            }
        },
        {
            data: {
                "site": "บริษัท เบทาโกร8 จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENLR3-64-08",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "30/01/2021",
                "issuedDate": "10/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": undefined
            }
        },
        {
            data: {
                "site": "บริษัท เบทาโกร9 จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENLR3-64-09",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "30/01/2021",
                "issuedDate": "10/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": undefined
            }
        },
        {
            data: {
                "site": "บริษัท เบทาโกร10 จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENLR3-64-10",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "30/01/2021",
                "issuedDate": "10/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": undefined
            }
        },
        {
            data: {
                "site": "บริษัท เบทาโกร11 จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENLR3-64-11",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "30/01/2021",
                "issuedDate": "10/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": undefined
            }
        },
        {
            data: {
                "site": "บริษัท เบทาโกร12 จำกัด มหาชน (โรงงานปากช่อง)",
                "division": "สำนักการผลิต (FC)",
                "department": "แผนกวิศวกรรม",
                "targetType": "ระบบการจัดการ",
                "status": "Issued",
                "runningNo": "OBJ-ENLR3-64-12",
                "year": "2021",
                "revisionNo": "01",
                "modifyNo": "",
                "createDate": "30/01/2021",
                "issuedDate": "10/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "hasTargets": undefined
            }
        }
    ];

    constructor() { }

    getRunningNos(): RunningNo[] {
        return this.runningNos;
    }

    getRunningNo(runningNo: string): RunningNo {
        return this.runningNos.find((_runningNo) => _runningNo.data["runningNo"] === runningNo);
    }

    getRunningNoData(runningNo: string): RunningNoData {
        const runningNoData = this.runningNos.find((_runningNo) => _runningNo.data["runningNo"] === runningNo);
        if (runningNoData) {
            return runningNoData.data;
        } else {
            return undefined;
        }
    }

    getTargets(runningNo: string): TargetRecord[] {
        const runningNoData = this.runningNos.find((_runningNo) => _runningNo.data["runningNo"] === runningNo);
        return runningNoData.kids.hasTargets.records;
    }

    addSubTarget(runningNo: string, targetId: string, subTarget: SubTarget): TargetRecord {
        const _runningNo = this.getRunningNo(runningNo);
        const target = _runningNo.kids.hasTargets.records.find((target) => target.data["targetId"] === targetId);
        target.kids.records.push({ data: subTarget, kids: { records: [] } });
        return target;
    }

    addMethod(runningNo: string, targetId: string, subTargetId: string, method: Method): SubTargetRecord {
        const _runningNo = this.getRunningNo(runningNo);
        const target = _runningNo.kids.hasTargets.records.find((target) => target.data["targetId"] === targetId);
        const subTarget = target.kids.records.find((subTarget) => subTarget.data["subTargetId"] === subTargetId);
        subTarget.kids.records.push({ data: method, kids: undefined });
        return subTarget;
    }
}

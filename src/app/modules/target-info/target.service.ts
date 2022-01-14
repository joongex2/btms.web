import { Injectable } from '@angular/core';
import { MainMethod, Method, RunningNoRecord, RunningNo, SubTarget, SubTargetRecord, TargetRecord } from './target.types';

@Injectable({
    providedIn: 'root'
})
export class TargetService {
    runningNos: RunningNoRecord[] = [
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
                                                data: {
                                                    mainMethodId: "1"
                                                },
                                                kids: {
                                                    planRecords: [
                                                        {
                                                            data: {
                                                                planActual: '1.',
                                                                planName: 'แผนงานที่ 1',
                                                                planOwner: 'เจ้าหน้าที่ขึ้นไป',
                                                                planResource: 'planResource1'
                                                            },
                                                            kids: {

                                                            }
                                                        }
                                                    ],
                                                    methodRecords: [
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
                    },
                    {
                        "data": {
                            "targetId": "2",
                            "name": "ควบคุมไม่ให้มีการเรียกปรับเงินจากลูกค้า Lotus ในกรณีที่เป็นความผิดพลาดของแผนกวางแผนผลิต",
                            "standard": "ISO 14001/ISO 45001",
                            "relativeTarget": "4"
                        },
                        "kids": {
                            "records": [
                                {
                                    "data": {
                                        "subTargetId": "1",
                                        "subTargetName": "ควบคุมไม่ให้มีการเรียกปรับเงินจากลูกค้า Lotus ในกรณีที่เป็นความผิดพลาดของแผนกวางแผนผลิต",
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
                                                data: {
                                                    mainMethodId: "1"
                                                },
                                                kids: {
                                                    planRecords: [
                                                        {
                                                            data: {
                                                                planActual: '1.',
                                                                planName: 'แผนงานที่ 1',
                                                                planOwner: 'เจ้าหน้าที่ขึ้นไป',
                                                                planResource: 'planResource1'
                                                            },
                                                            kids: {

                                                            }
                                                        }
                                                    ],
                                                    methodRecords: [
                                                        {
                                                            "data": {
                                                                ['methodId']: "1",
                                                                ["methodName"]: `1. ตรวจสอบปริมาณวัตถุดิบให้เพียงพอต่อการผลิต 2. ประสานงานทางทีมการผลิตในการ
                                                                    ตรวจสอบการผลิตที่สินค้ามีแนวโน้มที่จะผลิตได้ไม่ครบ 3. ดำเนินการประสานงานผล หรือผู้เกี่ยวข้อง กรณีที่
                                                                    จะไม่สามารถส่งสินค้าได้ตาม Commit 4. กรณีที่มีการเปลี่ยนแปลง เช่า เปลี่ยนแปลง Commit วางแผนต้อง
                                                                    แจ้งให้ผู้เกี่ยวข้องทราบ
                                                                    `,
                                                                "jan": "1.000",
                                                                "may": "1.000",
                                                                "jun": "1.000",
                                                                "jul": "1.000",
                                                                "aug": "1.000",
                                                                "sep": "1.000",
                                                                "oct": "1.000",
                                                                "dec": "1.000",
                                                                "owner": "เจ้าหน้าที่ขึ้นไป"
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
                    },
                    {
                        "data": {
                            "targetId": "3",
                            "name": "ควบคุมไม่ให้มีการเรียกปรับเงินจากลูกค้า Lotus ในกรณีที่เป็นความผิดพลาดของแผนกวางแผนผลิต",
                            "standard": "ISO 14001/ISO 45001",
                            "relativeTarget": "4"
                        },
                        "kids": {
                            "records": []
                        }
                    },
                    {
                        "data": {
                            "targetId": "4",
                            "name": "ติดตามปิดประเด็นข้อบกพร่องจากการตรวจ ประเมินภายในและการตรวจประเมินจากหน่วยงานภายนอกของระบบคุณภาพให้ได้ตามระยะเวลาที่กำหนด",
                            "standard": "ISO 14001/ISO 45001",
                            "relativeTarget": "4"
                        },
                        "kids": {
                            "records": [
                                {
                                    "data": {
                                        "subTargetId": "1",
                                        "subTargetName": "ติดตามปิดประเด็นข้อบกพร่องจากการตรวจ ประเมินภายในและการตรวจประเมินจากหน่วยงานภายนอกของระบบคุณภาพให้ได้ตามระยะเวลาที่กำหนด",
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
                                                data: {
                                                    mainMethodId: "1"
                                                },
                                                kids: {
                                                    planRecords: [
                                                        {
                                                            data: {
                                                                planActual: '1.',
                                                                planName: 'แผนงานที่ 1',
                                                                planOwner: 'เจ้าหน้าที่ขึ้นไป',
                                                                planResource: 'planResource1'
                                                            },
                                                            kids: {

                                                            }
                                                        }
                                                    ],
                                                    methodRecords: [
                                                        {
                                                            "data": {
                                                                ['methodId']: "1",
                                                                ["methodName"]: `1. วิเคราห์หาสาเหตุที่แท้จริงของประเด็นข้อบกพร่องจากการตรวจประเมิน ภายในและนอก 2.กำหนดวิธีการปฎิบัติและแกไข
                                                                    การปฎิบัติการป้องกัน ระยะเวลาและ ผุ้รับผิดชอบตามการวิเคราะห์หาสาเหตุที่แท้จริงของประเด็นข้อบกพร่อง 3. ดำเนินการแก้ไขประเด็นข้อบกพร่อง
                                                                    ตามวิธีการปฎิบัติการแก้ไขและวิธีการ ป้องกันภายในระยะเวลาที่กำหนด 4. ติดตามการปิดประเด็นข้อบกพร่องทุกเดือน 5. ทบทวนการติดตามการปิด
                                                                    ประเด็นข้อบกพร่อง เมื่อไม่เป็นไปตามเป้าหมายที่กำหนด`,
                                                                "jan": "1.000",
                                                                "feb": "1.000",
                                                                "mar": "1.000",
                                                                "apr": "1.000",
                                                                "may": "1.000",
                                                                "jun": "1.000",
                                                                "jul": "1.000",
                                                                "owner": "เจ้าหน้าที่ขึ้นไป"
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
                    },
                ]
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
                "records": []
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
                "records": []
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
                "records": []
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
                "records": []
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
                "records": []
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
                "records": []
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
                "records": []
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
                "records": []
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
                "records": []
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
                "records": []
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
                "records": []
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
                "records": []
            }
        }
    ];

    constructor() { }

    getRunningNoRecords(): RunningNoRecord[] {
        return this.runningNos;
    }

    getRunningNoRecord(runningNo: string): RunningNoRecord {
        return this.runningNos.find((_runningNo) => _runningNo.data["runningNo"] === runningNo);
    }

    getRunningNo(runningNo: string): RunningNo {
        const runningNoRecord = this.getRunningNoRecord(runningNo);
        if (runningNoRecord) {
            return runningNoRecord.data;
        } else {
            return undefined;
        }
    }

    getTargets(runningNo: string): TargetRecord[] {
        const runningNoData = this.runningNos.find((_runningNo) => _runningNo.data["runningNo"] === runningNo);
        return runningNoData.kids.records;
    }

    addSubTarget(runningNo: string, targetId: string, subTarget: SubTarget): TargetRecord {
        const _runningNo = this.getRunningNoRecord(runningNo);
        const target = _runningNo.kids.records.find((target) => target.data["targetId"] === targetId);
        target.kids.records.push({ data: subTarget, kids: { records: [] } });
        return target;
    }

    addMainMethod(runningNo: string, targetId: string, subTargetId: string, mainMethod: MainMethod): SubTargetRecord {
        const _runningNo = this.getRunningNoRecord(runningNo);
        const target = _runningNo.kids.records.find((target) => target.data["targetId"] === targetId);
        const subTarget = target.kids.records.find((subTarget) => subTarget.data["subTargetId"] === subTargetId);
        subTarget.kids.records.push({ data: mainMethod, kids: { planRecords: [], methodRecords: [] } });
        return subTarget;
    }
}

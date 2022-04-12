import { Injectable } from '@angular/core';
import { MainMethod, RunningNoRecord, RunningNo, SubTarget, SubTargetRecord, TargetRecord } from './target.types';

@Injectable({
    providedIn: 'root'
})
export class TargetService {
    runningNos: RunningNoRecord[] = [
        {
            data: {
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "records": [
                    {
                        "data": {
                            "targetId": "1",
                            "name": "ควบคุมค่าน้ำทิ้ง ให้อยู่ในเกณฑ์ที่กฎหมายกำหนด",
                            "standard": "ISO14001",
                            "relativeTarget": "3"
                        },
                        "kids": {
                            "records": [
                                {
                                    "data": {
                                        "subTargetId": "1",
                                        "subTargetName": "ควบคุมค่าพารามิเตอร์ pH ของมาตรฐานน้ำทิ้ง ให้อยู่ในเกณฑ์ที่กฎหมายกำหนด",
                                        "index": "ค่า pH",
                                        "symbol": "<",
                                        "value": "9",
                                        "unit": "",
                                        "currentValue": "5.5 - 9.0",
                                        "startMonth": 0,
                                        "startYear": 2022,
                                        "finishMonth": 11,
                                        "finishYear": 2022
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
                                                                planActual: '2021-10-10',
                                                                planName: 'ตรวจสอบการระบายน้ำทิ้งจากขั้นตอนการล้างไลน์',
                                                                planOwner: 'SN',
                                                                planResource: ''
                                                            },
                                                            kids: {

                                                            }
                                                        },
                                                        {
                                                            data: {
                                                                planActual: '2021-10-10',
                                                                planName: 'เก็บตัวอย่างน้ำทิ้งบ่อสุดท้ายของโรงงานส่งวิเคราะห์ตามพารามิเตอร์ที่กำหนดทุก 1 เดือน',
                                                                planOwner: 'SHE',
                                                                planResource: '1,000 บาท/เดือน'
                                                            },
                                                            kids: {

                                                            }
                                                        },
                                                        {
                                                            data: {
                                                                planActual: '2021-10-10',
                                                                planName: 'เมื่อไม่ได้เป้าหมายผู้ควบคุมระบบบำบัดร่วมกับเจ้าหน้าที่ประจำระบบบำบัดดำเนินการวิเคราะห์สาเหตุของปัญหาและรีบดำเนินการแก้ไขที่ต้นเหตุของปัญหา จากนั้นเก็บตัวอย่างเพื่อส่งวิเคราะห์อีกครั้งหลังการแก้ไข',
                                                                planOwner: 'SHE,EN',
                                                                planResource: ''
                                                            },
                                                            kids: {

                                                            }
                                                        },
                                                        {
                                                            data: {
                                                                planActual: '2021-10-10',
                                                                planName: 'ชี้แจงให้ทุกหน่วยงานที่เกี่ยวข้องทราบเพื่อการปฏิบัติที่ถูกต้อง',
                                                                planOwner: 'SHE',
                                                                planResource: ''
                                                            },
                                                            kids: {

                                                            }
                                                        },
                                                        {
                                                            data: {
                                                                planActual: '2021-10-10',
                                                                planName: 'ดำเนินการแก้ไขในกรณีที่ไม่เป็นไปตามที่กำหนด/และเฝ้าระวังป้องกันการเกิดซ้ำ ',
                                                                planOwner: 'SHE',
                                                                planResource: ''
                                                            },
                                                            kids: {

                                                            }

                                                        }
                                                    ],
                                                    methodRecords: [
                                                        {
                                                            "data": {
                                                                ['methodId']: "1",
                                                                ["methodName"]: `ควบคุมค่าพารามิเตอร์ pH ของมาตรฐานน้ำทิ้ง ให้อยู่ในเกณฑ์ที่กฎหมายกำหนด`,
                                                                resultRecords: [
                                                                    {
                                                                        year: '2019',
                                                                        "jan": {
                                                                            status: '>9',
                                                                            causeRecords: [
                                                                                {
                                                                                    data: {
                                                                                        causeNo: '1',
                                                                                        causeDetail: 'ไม่ได้ทำ',
                                                                                        causeNote: '',
                                                                                        causeStatus: 'Completed'
                                                                                    },
                                                                                    kids: {
                                                                                        fixRecords: [
                                                                                            {
                                                                                                data: {
                                                                                                    fixNo: '1',
                                                                                                    fixDetail: 'ไปแก้ไข',
                                                                                                    fixOwner: 'คุณเจตน์',
                                                                                                    fixDueDate: '2019-06-20',
                                                                                                    fixFollow: 'พบมีการดำเนินการแก้ไขไปเมื่อ',
                                                                                                    fixStartDate: '2019-06-18'
                                                                                                }
                                                                                            }
                                                                                        ],
                                                                                        protectRecords: [
                                                                                            {
                                                                                                data: {
                                                                                                    protectNo: '1',
                                                                                                    protectDetail: 'AAAA',
                                                                                                    protectOwner: 'AA',
                                                                                                    protectDueDate: '2019-12-31',
                                                                                                    protectFollow: 'มีการดำเนินงานอย่างต่อเนื่อง',
                                                                                                    protectStartDate: '2019-06-20'
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            ]
                                                                        },
                                                                        "feb": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "mar": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "apr": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "may": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "jun": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "jul": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "aug": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "sep": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "oct": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "nov": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "dec": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        }
                                                                    },
                                                                    {
                                                                        year: '2020',
                                                                        "jan": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "may": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "jun": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "jul": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "aug": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "sep": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "oct": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "dec": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        }
                                                                    }
                                                                ],
                                                                "owner": "จป.วิชาชีพอาวุโส,เจ้าหน้าที่สิ่งแวดล้อม"
                                                            },
                                                            "kids": {

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
                                        "subTargetId": "2",
                                        "subTargetName": "ควบคุมไม่ให้มีการเรียกปรับเงินจากลูกค้า Lotus ในกรณีที่เป็นความผิดพลาดของแผนกวางแผนผลิต",
                                        "index": "ฉบับ/เดือน",
                                        "symbol": ">=",
                                        "value": "1",
                                        "unit": "เรื่อง/เดือน",
                                        "currentValue": "1",
                                        "startMonth": 0,
                                        "startYear": 2021,
                                        "finishMonth": 11,
                                        "finishYear": 2021
                                    },
                                    "kids": {
                                        "records": []
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
                                        "symbol": ">=",
                                        "value": "1",
                                        "unit": "เรื่อง/เดือน",
                                        "currentValue": "1",
                                        "startMonth": 0,
                                        "startYear": 2021,
                                        "finishMonth": 11,
                                        "finishYear": 2021
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
                                                                planActual: '2021-10-10',
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
                                                                resultRecords: [
                                                                    {
                                                                        year: '2019',
                                                                        "jan": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "may": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "jun": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "jul": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "aug": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "sep": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "oct": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "dec": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        }
                                                                    }
                                                                ],
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
                                        "symbol": ">=",
                                        "value": "1",
                                        "unit": "เรื่อง/เดือน",
                                        "currentValue": "1",
                                        "startMonth": 0,
                                        "startYear": 2021,
                                        "finishMonth": 11,
                                        "finishYear": 2021
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
                                                                planActual: '2021-10-10',
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
                                                                resultRecords: [
                                                                    {
                                                                        year: '2019',
                                                                        "jan": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "feb": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "mar": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "apr": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "may": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "jun": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        },
                                                                        "jul": {
                                                                            status: '>9',
                                                                            causeRecords: []
                                                                        }
                                                                    }
                                                                ],
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
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
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
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "records": []
            }
        },
        {
            data: {
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "records": []
            }
        },
        {
            data: {
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "records": []
            }
        },
        {
            data: {
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "records": []
            }
        },
        {
            data: {
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "records": []
            }
        },
        {
            data: {
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "records": []
            }
        },
        {
            data: {
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "records": []
            }
        },
        {
            data: {
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "records": []
            }
        },
        {
            data: {
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "records": []
            }
        },
        {
            data: {
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "records": []
            }
        },
        {
            data: {
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
                "creator": "Phaiboon Charoensalung"
            },
            "kids": {
                "records": []
            }
        },
        {
            data: {
                "bu": "Agro",
                "subBu": "Feed",
                "plant": "BTG-LR1",
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
                "dueDate": "03/02/2021",
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

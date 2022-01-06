import { Injectable } from '@angular/core';
import { Method, RunningNo, RunningNoData, SubTarget, SubTargetRecord, Target } from './target.types';

@Injectable({
    providedIn: 'root'
})
export class TargetService {
    runningNos: RunningNo[] = [{
        data: {
            "Site": "บริษัท เบทาโกร จำกัด มหาชน (โรงงานปากช่อง)",
            "Division": "สำนักการผลิต (FC)",
            "Department": "แผนกวิศวกรรม",
            "Target Type": "ระบบการจัดการ",
            "Status": "Issued",
            "Running No.": "OBJ-ENPC-64-02",
            "Year": "2021",
            "Revision No.": "01",
            "Modify No.": "",
            "Create Date": "01/02/2021",
            "Issued Date": "03/02/2021",
            "Creator": "Phaiboon Charoensalung"
        },
        "kids": {
            "has_targets": {
                "records": [
                    {
                        "data": {
                            "Target ID": "1",
                            "Name": "รายงานการกระทำที่เป็นอันตรายและสภาพการที่เป็นอันตรายที่ได้รับขึ้นทะเบียน (unsafe act)",
                            "Standard": "ISO 14001/ISO 45001",
                            "Relative Target": "4"
                        },
                        "kids": {
                            "has_sub_targets": {
                                "records": [
                                    {
                                        "data": {
                                            "Sub Target ID": "1",
                                            "Sub Target Name": "รายงานการกระทำที่เป็นอันตรายและสภาพการที่เป็นอันตรายที่ได้รับขึ้นทะเบียน (unsafe act)",
                                            "Index": "ฉบับ/เดือน",
                                            "Value": ">=1",
                                            "Unit": "เรื่อง/เดือน",
                                            "Current Value": "1",
                                            "Start Month": "ม.ค.",
                                            "Start Year": "2021",
                                            "Finish Month": "ธ.ค.",
                                            "Finish Year": "2021"
                                        },
                                        "kids": {
                                            "has_methods": {
                                                "records": [
                                                    {
                                                        "data": {
                                                            ['Method ID']: "1",
                                                            ["Method Name"]: `1.ศึกษารายงานการกระทำที่เป็นอันตราย / สภาพที่เป็นอันตราย 
                                                            2. ประชุมชี้แจงพนักงานในแผนก 
                                                            3. พนักงานในแผนกดำเนินการค้นหาและบันทึกรายงานการกระทำที่เป็นอันตราย
                                                            4. ตรวจสอบและประเมินจำนวนของบันทึกรายงานการกระทำที่เป็นอันตราย / สภาพที่เป็นอันตราย ในแต่ละเดือน
                                                                `,
                                                            "Jan": "1.000",
                                                            "Feb": "1.000",
                                                            "Mar": "1.000",
                                                            "Apr": "1.000",
                                                            "May": "1.000",
                                                            "Jun": "1.000",
                                                            "Jul": "1.000",
                                                            "Aug": "1.000",
                                                            "Sep": "1.000",
                                                            "Oct": "1.000",
                                                            "Nov": "1.000",
                                                            "Dec": "1.000",
                                                            "Owner": "Department manager Maintenance Process Machine 1 PC"
                                                        },
                                                        "kids": {

                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        }
    }, {
        data: {
            "Site": "บริษัท เบทาโกร2 จำกัด มหาชน (โรงงานปากช่อง)",
            "Division": "สำนักการผลิต (FC)",
            "Department": "แผนกวิศวกรรม",
            "Target Type": "ระบบการจัดการ",
            "Status": "Issued",
            "Running No.": "OBJ-ENPC-64-01",
            "Year": "2021",
            "Revision No.": "01",
            "Modify No.": "",
            "Create Date": "30/01/2021",
            "Issued Date": "03/02/2021",
            "Creator": "Phaiboon Charoensalung"
        },
        "kids": {
            "has_targets": undefined
        }
    }, {
        data: {
            "Site": "บริษัท เบทาโกร3 จำกัด มหาชน (โรงงานปากช่อง)",
            "Division": "สำนักการผลิต (FC)",
            "Department": "แผนกวิศวกรรม",
            "Target Type": "ระบบการจัดการ",
            "Status": "Issued",
            "Running No.": "OBJ-ENLR3-64-02",
            "Year": "2021",
            "Revision No.": "01",
            "Modify No.": "",
            "Create Date": "30/01/2021",
            "Issued Date": "09/02/2021",
            "Creator": "Phaiboon Charoensalung"
        },
        "kids": {
            "has_targets": undefined
        }
    }, {
        data: {
            "Site": "บริษัท เบทาโกร4 จำกัด มหาชน (โรงงานปากช่อง)",
            "Division": "สำนักการผลิต (FC)",
            "Department": "แผนกวิศวกรรม",
            "Target Type": "ระบบการจัดการ",
            "Status": "Issued",
            "Running No.": "OBJ-ENLR3-64-01",
            "Year": "2021",
            "Revision No.": "01",
            "Modify No.": "",
            "Create Date": "30/01/2021",
            "Issued Date": "10/02/2021",
            "Creator": "Phaiboon Charoensalung"
        },
        "kids": {
            "has_targets": undefined
        }
    }];

    constructor() { }

    getRunningNos(): RunningNo[] {
        return this.runningNos;
    }

    getRunningNo(runningNo: string): RunningNo {
        return this.runningNos.find((_runningNo) => _runningNo.data["Running No."] === runningNo);
    }

    getRunningNoData(runningNo: string): RunningNoData {
        const runningNoData = this.runningNos.find((_runningNo) => _runningNo.data["Running No."] === runningNo);
        if (runningNoData) {
            return runningNoData.data;
        } else {
            return undefined;
        }
    }

    getTargets(runningNo: string): Target[] {
        const runningNoData = this.runningNos.find((_runningNo) => _runningNo.data["Running No."] === runningNo);
        return runningNoData.kids.has_targets.records;
    }

    addSubTarget(runningNo: string, targetId: string, subTarget: SubTarget): Target {
        const _runningNo = this.getRunningNo(runningNo);
        const target = _runningNo.kids.has_targets.records.find((target) => target.data["Target ID"] === targetId);
        if (!target.kids.has_sub_targets) { target.kids.has_sub_targets = { records: [] } }
        target.kids.has_sub_targets.records.push({ data: subTarget, kids: { has_methods: undefined } });
        return target;
    }

    addMethod(runningNo: string, targetId: string, subTargetId: string, method: Method): SubTargetRecord {
        const _runningNo = this.getRunningNo(runningNo);
        const target = _runningNo.kids.has_targets.records.find((target) => target.data["Target ID"] === targetId);
        const subTarget = target.kids.has_sub_targets.records.find((subTarget) => subTarget.data["Sub Target ID"] === subTargetId);
        if (!subTarget.kids.has_methods) { subTarget.kids.has_methods = { records: [] } }
        subTarget.kids.has_methods.records.push({ data: method, kids: undefined });
        return subTarget;
    }
}

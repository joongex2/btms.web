export interface RunningNoRecord {
    data: RunningNo;
    kids: {
        records: TargetRecord[];
    }
}

export interface RunningNo {
    site: string;
    division: string;
    department: string;
    targetType: string;
    status: string;
    runningNo: string;
    year: string;
    revisionNo: string;
    modifyNo: string;
    createDate: string;
    issuedDate: string;
    creator: string;
}

export interface TargetRecord {
    data: Target;
    kids: {
        records: SubTargetRecord[];
    };
}

export interface Target {
    targetId: string;
    name: string;
    standard: string;
    relativeTarget: string;
}

export interface SubTargetRecord {
    data?: SubTarget;
    kids?: {
        records: MainMethodRecord[];
    }
}

export interface SubTarget {
    subTargetId: string;
    subTargetName: string;
    index: string;
    value: string;
    unit: string;
    currentValue: string;
    startMonth: string;
    startYear: string;
    finishMonth: string;
    finishYear: string;
}

export interface MainMethodRecord {
    data?: MainMethod
    kids?: {
        planRecords: PlanRecord[],
        methodRecords: MethodRecord[]
    }
}

export interface MainMethod {
    mainMethodId: string;
}

export interface PlanRecord {
    data?: Plan;
    kids?: PlanRecord;
}

export interface Plan {
    planName: string;
    planActual: string;
    planResource: string;
    planOwner: string;
}

export interface MethodRecord {
    data?: Method;
    kids?: MethodRecord;
}

export interface Method {
    methodId: string;
    methodName: string;
    jan?: string;
    feb?: string;
    mar?: string;
    apr?: string;
    may?: string;
    jun?: string;
    jul?: string;
    aug?: string;
    sep?: string;
    oct?: string;
    nov?: string;
    dec?: string;
    owner: string;
}

export interface CauseRecord {
    data: Cause;
    kids: {
        fixRecords: FixRecord[];
        protectRecords: ProtectRecord[];
    }
}

export interface Cause {
    causeNo: string;
    causeDetail: string;
    causeNote: string;
    causeStatus: string;
}

export interface FixRecord {
    data: Fix;
    kids?: FixRecord;
}

export interface Fix {
    fixNo: string;
    fixDetail: string;
    fixOwner: string;
    fixDueDate: string;
    fixFollow: string;
    fixStartDate: string;
}

export interface ProtectRecord {
    data: Protect;
    kids?: ProtectRecord;
}

export interface Protect {
    protectNo: string;
    protectDetail: string;
    protectOwner: string;
    protectDueDate: string;
    protectFollow: string;
    protectStartDate: string;
}
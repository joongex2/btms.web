export interface RunningNo {
    data: RunningNoData;
    kids: {
        hasTargets?: {
            records: TargetRecord[];
        }
    }
}

export interface RunningNoData {
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
    jan: string;
    feb: string;
    mar: string;
    apr: string;
    may: string;
    jun: string;
    jul: string;
    aug: string;
    sep: string;
    oct: string;
    nov: string;
    dec: string;
    owner: string;
}